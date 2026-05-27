const express = require("express");
const router = express.Router();
const apartmentController = require("../controllers/apartmentController");
const { authMiddleware } = require("../middlewares/authUserMiddleware");

const { upload } = require("../config/cloudinaryConfig");

// Public routes
router.get("/", apartmentController.getApartments);
router.get("/:id", apartmentController.getApartmentById);

// Admin-only protected routes (protection verified in controller)
router.post(
  "/",
  authMiddleware,
  upload.fields([{ name: 'images', maxCount: 6 }, { name: 'videos', maxCount: 2 }]),
  apartmentController.createApartment
);
router.put(
  "/:id",
  authMiddleware,
  upload.fields([{ name: 'images', maxCount: 6 }, { name: 'videos', maxCount: 2 }]),
  apartmentController.updateApartment
);
router.delete("/:id", authMiddleware, apartmentController.deleteApartment);

module.exports = router;
