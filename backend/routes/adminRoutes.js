const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authUserMiddleware");

// All administrative routes require both active authentication and administrator role privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Stats & Dashboard
router.get("/stats", adminController.getSystemStats);

// User Profile & Role Management
router.get("/users", adminController.getAllUsers);
router.put("/users/:id", adminController.updateUserStatus);

// System Ethers Blockchain Wallet Details
router.get("/wallet", adminController.getAdminWallet);

// Booking Administrative Overrides
router.post("/bookings/:id/cancel", adminController.cancelBookingGlobal);
router.delete("/bookings/:id", adminController.deleteBookingGlobal);

// System Settings Management
router.get("/settings", adminController.getSystemSettings);
router.put("/settings", adminController.updateSystemSettings);

module.exports = router;
