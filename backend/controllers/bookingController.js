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
    const { apartment_id, check_in, check_out } = req.body;

    if (!apartment_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Apartment ID, check-in date, and check-out date are required.",
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

    // 4. Create the booking as 'pending'
    const booking = await bookings.create({
      user_id: userId,
      apartment_id,
      check_in,
      check_out,
      total_price: totalPrice.toString(),
      booking_status: "pending",
      payment_status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Booking initialized successfully! Please proceed to payment.",
      data: {
        booking,
        apartment: {
          title: apartment.title,
          location: apartment.location,
          pricePerDay: apartment.price,
        },
        days,
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

// Get Bookings for Logged-In User
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
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: userBookings.length,
      data: userBookings,
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

// Get All Bookings (Admin Only)
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

    return res.status(200).json({
      success: true,
      count: allBookings.length,
      data: allBookings,
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

// Get Booking By ID
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

    return res.status(200).json({
      success: true,
      data: booking,
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

// Cancel Booking
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

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: booking,
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
