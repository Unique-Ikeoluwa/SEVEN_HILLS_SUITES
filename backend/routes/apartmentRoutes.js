const express = require("express");
const router = express.Router();
const apartmentController = require("../controllers/apartmentController");
const { authMiddleware } = require("../middlewares/authUserMiddleware");

// Public routes
router.get("/", apartmentController.getApartments);
router.get("/:id", apartmentController.getApartmentById);

// Admin-only protected routes (protection verified in controller)
router.post("/", authMiddleware, apartmentController.createApartment);
router.put("/:id", authMiddleware, apartmentController.updateApartment);
router.delete("/:id", authMiddleware, apartmentController.deleteApartment);

module.exports = router;
