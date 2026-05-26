const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authMiddleware } = require("../middlewares/authUserMiddleware");

// All booking routes require authentication
router.use(authMiddleware);

router.post("/", bookingController.createBooking);
router.get("/my-bookings", bookingController.getUserBookings);
router.get("/all-bookings", bookingController.getAllBookings); // Admin check inside controller
router.get("/:id", bookingController.getBookingById);
router.post("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
