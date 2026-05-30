const db = require("../models");
const { bookings, Apartment, Users } = db;

// Helper to check if user is admin/support
const isAdmin = (user) => {
  return user && (user.role === "admin" || user.role === "support");
};

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Users.findByPk(userId);
    let { apartment_id, check_in, check_out, guest_name, guest_email, guest_phone, payment_type } = req.body;
    const redirect_url = process.env.PAYSTACK_REDIRECT_URL || "http://localhost:8300/bookings/my-bookings";

    if (!apartment_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Apartment ID, check-in date, and check-out date are required.",
      });
    }

    if (!payment_type) {
      payment_type = "fiat";
    }

    const typeLower = payment_type.toLowerCase();
    if (typeLower !== "fiat" && typeLower !== "crypto") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment_type. Allowed options are: 'fiat' or 'crypto'.",
      });
    }

    // 1. Check if apartment exists and is available
    const apartment = await Apartment.findByPk(apartment_id);
    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found.",
      });
    }

    if (apartment.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "This apartment is already booked or unavailable.",
      });
    }

    // 2. Validate dates and calculate days of stay
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date format.",
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date.",
      });
    }

    const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
    const days = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    if (days <= 0) {
      return res.status(400).json({
        success: false,
        message: "Booking duration must be at least 1 day.",
      });
    }

    // 3. Calculate total price
    const dailyPrice = parseFloat(apartment.price);
    if (isNaN(dailyPrice)) {
      return res.status(500).json({
        success: false,
        message: "Invalid price configuration for this apartment.",
      });
    }

    const totalPrice = (dailyPrice * days).toFixed(2);

    // Guest Info Fallback
    const activeGuestName = guest_name || (user ? user.fullName : "Valued Guest");
    const activeGuestEmail = guest_email || (user ? user.email : "");
    const activeGuestPhone = guest_phone || (user ? user.phone_no : "");

    // 4. Create the booking as 'pending'
    const booking = await bookings.create({
      user_id: userId,
      apartment_id,
      check_in,
      check_out,
      total_price: totalPrice.toString(),
      booking_status: "pending",
      payment_status: "pending",
      guest_name: activeGuestName,
      guest_email: activeGuestEmail,
      guest_phone: activeGuestPhone,
      payment_type: typeLower,
    });

    // Auto-initialize payment based on payment_type
    let paymentData = null;
    let autoPaymentMessage = "";
    const { initPaystackInternal, initCryptoInternal } = require("./paymentController");

    if (typeLower === "fiat") {
      try {
        paymentData = await initPaystackInternal({
          bookingId: booking.id,
          userEmail: activeGuestEmail || user.email,
          protocol: req.protocol,
          host: req.get("host"),
          redirect_url,
        });
        autoPaymentMessage = "Paystack checkout session successfully generated.";
      } catch (paystackErr) {
        console.error("Auto Paystack Init Failed:", paystackErr.message);
        autoPaymentMessage = `Paystack auto-init failed: ${paystackErr.message}. You can retry payment initialization manually.`;
      }
    } else if (typeLower === "crypto") {
      try {
        paymentData = await initCryptoInternal({
          bookingId: booking.id,
        });
        autoPaymentMessage = "USDC crypto billing address successfully generated.";
      } catch (cryptoErr) {
        console.error("Auto USDC Crypto Init Failed:", cryptoErr.message);
        autoPaymentMessage = `USDC auto-init failed: ${cryptoErr.message}. You can retry payment initialization manually.`;
      }
    }

    // Send Booking Creation Notifications
    const { sendNotification, notifyAdmins } = require("../utils/notificationHelper");
    await sendNotification({
      userId: userId,
      message: `Your booking for "${apartment.title}" has been initialized successfully. Total amount: $${totalPrice}. Please proceed to complete your payment. Guest: ${activeGuestName} (Phone: ${activeGuestPhone}).`,
      emailSubject: "Booking Initialized 🔑",
      emailBodyText: `<h3>Booking Initialized Successfully</h3><p>We are pleased to inform you that your reservation for <b>${apartment.title}</b> is currently pending.</p><p><b>Guest Name:</b> ${activeGuestName}<br/><b>Guest Phone:</b> ${activeGuestPhone}<br/><b>Check-in:</b> ${check_in}<br/><b>Check-out:</b> ${check_out}<br/><b>Total Price:</b> $${totalPrice}</p><p>Please initialize the checkout process to secure your stay.</p>`
    });

    await notifyAdmins({
      message: `New booking initialized for "${apartment.title}" by guest: ${activeGuestName} (Phone: ${activeGuestPhone}). Total: $${totalPrice}.`,
      emailSubject: "New Pending Booking Alert 🔔",
      emailBodyText: `<p>A new booking has been initialized on the system.</p><p><b>Guest Name:</b> ${activeGuestName}<br/><b>Guest Phone:</b> ${activeGuestPhone}<br/><b>Apartment:</b> ${apartment.title}<br/><b>Check-in:</b> ${check_in}<br/><b>Check-out:</b> ${check_out}<br/><b>Total Amount:</b> $${totalPrice}</p>`
    });

    return res.status(201).json({
      success: true,
      message: "Booking initialized successfully! " + autoPaymentMessage,
      data: {
        booking: {
          ...booking.toJSON(),
          guest_name: activeGuestName,
          guest_email: activeGuestEmail,
          guest_phone: activeGuestPhone,
        },
        apartment: {
          title: apartment.title,
          location: apartment.location,
          pricePerDay: apartment.price,
        },
        days,
        payment: paymentData,
      },
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the booking.",
      error: error.message,
    });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const userBookings = await bookings.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Apartment,
          as: "apartment",
          attributes: ["id", "title", "description", "location", "price", "status"],
        },
        {
          model: Users,
          as: "user",
          attributes: ["id", "fullName", "email", "phone_no"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedBookings = userBookings.map((b) => {
      const bJson = b.toJSON();
      return {
        ...bJson,
        guest_name: bJson.user ? bJson.user.fullName : "N/A",
        guest_phone: bJson.user ? bJson.user.phone_no : "N/A",
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings,
    });
  } catch (error) {
    console.error("Get User Bookings Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching your bookings.",
      error: error.message,
    });
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can perform this action.",
      });
    }

    const allBookings = await bookings.findAll({
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "fullName", "email", "phone_no"],
        },
        {
          model: Apartment,
          as: "apartment",
          attributes: ["id", "title", "location", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedBookings = allBookings.map((b) => {
      const bJson = b.toJSON();
      return {
        ...bJson,
        guest_name: bJson.user ? bJson.user.fullName : "N/A",
        guest_phone: bJson.user ? bJson.user.phone_no : "N/A",
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings,
    });
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching all bookings.",
      error: error.message,
    });
  }
};


exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await bookings.findByPk(id, {
      include: [
        {
          model: Apartment,
          as: "apartment",
        },
        {
          model: Users,
          as: "user",
          attributes: ["id", "fullName", "email", "phone_no"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Verify ownership or admin privileges
    if (booking.user_id !== userId && !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to view this booking.",
      });
    }

    const bookingJson = booking.toJSON();
    return res.status(200).json({
      success: true,
      data: {
        ...bookingJson,
        guest_name: bookingJson.user ? bookingJson.user.fullName : "N/A",
        guest_phone: bookingJson.user ? bookingJson.user.phone_no : "N/A",
      },
    });
  } catch (error) {
    console.error("Get Booking By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the booking.",
      error: error.message,
    });
  }
};


exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await bookings.findByPk(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Verify ownership or admin privileges
    if (booking.user_id !== userId && !isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission to cancel this booking.",
      });
    }

    if (booking.booking_status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This booking is already cancelled.",
      });
    }

    // Update booking status
    booking.booking_status = "cancelled";
    await booking.save();

    // If the booking was confirmed or paid, restore apartment status to available
    const apartment = await Apartment.findByPk(booking.apartment_id);
    if (apartment && apartment.status === "booked") {
      apartment.status = "available";
      await apartment.save();
    }

    const user = await Users.findByPk(booking.user_id);

    // Send Booking Cancellation Notifications
    const { sendNotification, notifyAdmins } = require("../utils/notificationHelper");
    await sendNotification({
      userId: booking.user_id,
      message: `Your booking for booking ID ${booking.id} has been cancelled successfully. Guest: ${user ? user.fullName : 'Valued Guest'} (Phone: ${user ? user.phone_no : 'N/A'}).`,
      emailSubject: "Booking Cancellation Confirmed ❌",
      emailBodyText: `<h3>Booking Cancellation Confirmed</h3><p>This email confirms that your booking (ID: ${booking.id}) has been cancelled.</p><p><b>Guest Name:</b> ${user ? user.fullName : 'Valued Guest'}<br/><b>Guest Phone:</b> ${user ? user.phone_no : 'N/A'}</p><p>If you did not request this, please contact support immediately.</p>`
    });

    await notifyAdmins({
      message: `Booking ID ${booking.id} has been cancelled by guest: ${user ? user.fullName : 'Valued Guest'} (Phone: ${user ? user.phone_no : 'N/A'}).`,
      emailSubject: "Booking Cancelled 🔔",
      emailBodyText: `<p>Booking (ID: ${booking.id}) has been cancelled by the user or an administrator. Guest: ${user ? user.fullName : 'Valued Guest'} (${user ? user.email : 'N/A'}, Phone: ${user ? user.phone_no : 'N/A'}). The reserved suite status has been restored to available.</p>`
    });

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: {
        ...booking.toJSON(),
        guest_name: user ? user.fullName : "N/A",
        guest_phone: user ? user.phone_no : "N/A",
      },
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while cancelling the booking.",
      error: error.message,
    });
  }
};
