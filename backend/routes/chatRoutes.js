const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { authMiddleware } = require("../middlewares/authUserMiddleware");

// All chat support routes require authentication
router.use(authMiddleware);

router.get("/history/:userId", chatController.getHistory);
router.get("/rooms", chatController.getRooms); // Admin check inside controller
router.post("/mark-read/:userId", chatController.markAsRead);

module.exports = router;
