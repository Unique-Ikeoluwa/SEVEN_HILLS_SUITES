const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const apartmentRoutes = require("./apartmentRoutes");
const bookingRoutes = require("./bookingRoutes");
const paymentRoutes = require("./paymentRoutes");
const chatRoutes = require("./chatRoutes");
const notificationRoutes = require("./notificationRoutes");

router.use("/auth", authRoutes);
router.use("/apartments", apartmentRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/chat", chatRoutes);
router.use("/notifications", notificationRoutes);

module.exports = router;
