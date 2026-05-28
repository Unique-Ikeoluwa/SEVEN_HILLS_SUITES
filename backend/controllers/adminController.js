const db = require("../models");
const { Users, bookings, Apartment, Payments } = db;
const { getWalletDetails } = require("./walletLogic");

/**
 * 1. Get System Statistics Dashboard
 */
exports.getSystemStats = async (req, res) => {
  try {
    // Basic Counts
    const totalUsers = await Users.count();
    const totalBookings = await bookings.count();
    const totalApartments = await Apartment.count();

    // Booking statuses aggregation
    const pendingBookings = await bookings.count({ where: { booking_status: "pending" } });
    const confirmedBookings = await bookings.count({ where: { booking_status: "confirmed" } });
    const cancelledBookings = await bookings.count({ where: { booking_status: "cancelled" } });

    // Apartment status aggregation
    const availableApartments = await Apartment.count({ where: { status: "available" } });
    const bookedApartments = await Apartment.count({ where: { status: "booked" } });

    // Financial revenue calculation (Sum of verified payments in NGN/USD)
    const paidPayments = await Payments.findAll({
      where: { payment_status: "paid" },
    });

    let totalRevenueNGN = 0;
    let totalRevenueUSD = 0;

    paidPayments.forEach((payment) => {
      const amount = parseFloat(payment.amount) || 0;
      // If currency is NGN, add to NGN sum. If it's a cryptocurrency like ETH, USDT, BTC or USD, resolve appropriately.
      if (payment.currency === "NGN") {
        totalRevenueNGN += amount;
      } else if (payment.currency === "USD" || payment.currency === "USDT") {
        totalRevenueUSD += amount;
      } else {
        // Fallback or cryptocurrency conversions if available
        totalRevenueUSD += amount;
      }
    });

    return res.status(200).json({
      success: true,
      message: "System analytical statistics retrieved successfully.",
      data: {
        counters: {
          users: totalUsers,
          bookings: totalBookings,
          apartments: totalApartments,
        },
        bookingsBreakdown: {
          pending: pendingBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
        },
        apartmentsBreakdown: {
          available: availableApartments,
          booked: bookedApartments,
        },
        revenue: {
          totalNGN: totalRevenueNGN.toFixed(2),
          totalUSD: totalRevenueUSD.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error("Get System Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while compiling system statistics.",
      error: error.message,
    });
  }
};

/**
 * 2. Get All Registered Users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.findAll({
      attributes: { exclude: ["password", "otpCode", "otpExpiresAt"] },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: allUsers.length,
      data: allUsers,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching system users.",
      error: error.message,
    });
  }
};

/**
 * 3. Update User Status / Assign Administrative Roles
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, is_active } = req.body;

    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Prevent changing the current logged-in administrator's own role to avoid lockout
    if (user.id === req.user.id && role && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Safety block: You cannot downgrade your own administrative privileges.",
      });
    }

    if (role !== undefined) {
      const allowedRoles = ["user", "support", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role assignment. Supported roles are: ${allowedRoles.join(", ")}`,
        });
      }
      user.role = role;
    }

    if (is_active !== undefined) {
      user.is_active = is_active;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User account permissions updated successfully.",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    console.error("Update User Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the user profile status.",
      error: error.message,
    });
  }
};

/**
 * 4. Get Admin Crypto Wallet Details
 */
exports.getAdminWallet = async (req, res) => {
  return getWalletDetails(req, res);
};

/**
 * 5. Globally Cancel Any Booking
 */
exports.cancelBookingGlobal = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await bookings.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking record not found.",
      });
    }

    if (booking.booking_status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This booking is already marked as cancelled.",
      });
    }

    // Cancel booking
    booking.booking_status = "cancelled";
    await booking.save();

    // Release apartment back to available status
    const apartment = await Apartment.findByPk(booking.apartment_id);
    if (apartment && apartment.status === "booked") {
      apartment.status = "available";
      await apartment.save();
    }

    // Send Admin Override Cancellation Notification
    const { sendNotification, notifyAdmins } = require("../utils/notificationHelper");
    await sendNotification({
      userId: booking.user_id,
      message: `Your booking (ID: ${booking.id}) has been cancelled by the system administrator.`,
      emailSubject: "Booking Cancelled by Administrator ❌",
      emailBodyText: `<h3>Booking Cancellation Alert</h3><p>Your reservation (ID: <b>${booking.id}</b>) has been cancelled by a system administrator.</p><p>Please contact the Seven Hills Suites administrative desk for further details.</p>`,
    });

    await notifyAdmins({
      message: `Administrator Override: Booking ID ${booking.id} has been cancelled by Admin User ID ${req.user.id}.`,
      emailSubject: "Admin Override: Booking Cancelled ⚠️",
      emailBodyText: `<p>Administrator (ID: ${req.user.id}) has manually cancelled Booking ID ${booking.id}. The associated suite has been set back to available.</p>`,
    });

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully via administrative override.",
      data: booking,
    });
  } catch (error) {
    console.error("Global Cancel Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while globally cancelling the booking.",
      error: error.message,
    });
  }
};

/**
 * 6. Globally Delete Any Booking
 */
exports.deleteBookingGlobal = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await bookings.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking record not found.",
      });
    }

    // Release the apartment if it's currently booked under this booking
    const apartment = await Apartment.findByPk(booking.apartment_id);
    if (apartment && apartment.status === "booked") {
      apartment.status = "available";
      await apartment.save();
    }

    await booking.destroy();

    return res.status(200).json({
      success: true,
      message: "Booking record successfully deleted from the database.",
    });
  } catch (error) {
    console.error("Global Delete Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the booking.",
      error: error.message,
    });
  }
};

const fs = require("fs");
const path = require("path");

/**
 * 7. Get System Settings (Exchange Rates, etc.)
 */
exports.getSystemSettings = async (req, res) => {
  try {
    const settingsPath = path.join(__dirname, "../config/settings.json");
    if (!fs.existsSync(settingsPath)) {
      const defaults = { usd_to_ngn_rate: 1500.0 };
      fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
      fs.writeFileSync(settingsPath, JSON.stringify(defaults, null, 2), "utf-8");
    }

    const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

    return res.status(200).json({
      success: true,
      message: "System settings retrieved successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("Get System Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching system settings.",
      error: error.message,
    });
  }
};

/**
 * 8. Update System Settings (Exchange Rates, etc.)
 */
exports.updateSystemSettings = async (req, res) => {
  try {
    const { usd_to_ngn_rate } = req.body;

    if (usd_to_ngn_rate === undefined || isNaN(parseFloat(usd_to_ngn_rate))) {
      return res.status(400).json({
        success: false,
        message: "usd_to_ngn_rate must be a valid number.",
      });
    }

    const rateVal = parseFloat(usd_to_ngn_rate);
    if (rateVal <= 0) {
      return res.status(400).json({
        success: false,
        message: "usd_to_ngn_rate must be greater than zero.",
      });
    }

    const settingsPath = path.join(__dirname, "../config/settings.json");
    let currentSettings = {};
    if (fs.existsSync(settingsPath)) {
      try {
        currentSettings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
      } catch (err) {
        console.warn("Could not parse current settings, overwriting...", err);
      }
    }

    currentSettings.usd_to_ngn_rate = rateVal;

    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(currentSettings, null, 2), "utf-8");

    return res.status(200).json({
      success: true,
      message: "System settings updated successfully.",
      data: currentSettings,
    });
  } catch (error) {
    console.error("Update System Settings Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating system settings.",
      error: error.message,
    });
  }
};
