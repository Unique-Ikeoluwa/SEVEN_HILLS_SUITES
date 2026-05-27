const db = require("../models");
const { Apartment } = db;
const { Op } = require("sequelize");


const isAdmin = (user) => {
  return user && (user.role === "admin" || user.role === "support");
};


exports.createApartment = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can perform this action.",
      });
    }

    const { title, description, location, price, amenities, apartment_type } = req.body;

    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required.",
      });
    }

    const { uploadToCloudinary } = require("../config/cloudinaryConfig");
    let imageUrls = [];
    let videoUrls = [];

    // Parse and stream files to Cloudinary
    if (req.files) {
      if (req.files.images) {
        if (req.files.images.length > 6) {
          return res.status(400).json({
            success: false,
            message: "You can upload a maximum of 6 images.",
          });
        }
        for (const file of req.files.images) {
          const url = await uploadToCloudinary(file.buffer, "images", file.originalname);
          imageUrls.push(url);
        }
      }

      if (req.files.videos) {
        if (req.files.videos.length > 2) {
          return res.status(400).json({
            success: false,
            message: "You can upload a maximum of 2 videos.",
          });
        }
        for (const file of req.files.videos) {
          const url = await uploadToCloudinary(file.buffer, "videos", file.originalname);
          videoUrls.push(url);
        }
      }
    }

    const newApartment = await Apartment.create({
      title,
      description: description || "",
      location: location || "",
      price: price.toString(),
      status: "available",
      amenities: Array.isArray(amenities) ? amenities.join(",") : amenities || "",
      apartment_type: apartment_type || "Suite",
      images: imageUrls.join(","),
      videos: videoUrls.join(","),
    });

    return res.status(201).json({
      success: true,
      message: "Apartment created successfully!",
      data: newApartment,
    });
  } catch (error) {
    console.error("Create Apartment Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the apartment.",
      error: error.message,
    });
  }
};


exports.getApartments = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, status, search } = req.query;

    const whereClause = {};


    if (location) {
      whereClause.location = {
        [Op.iLike]: `%${location}%`,
      };
    }

   
    if (status) {
      whereClause.status = status;
    }

    
    if (search) {
      whereClause([Op.or]) = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    let apartments = await Apartment.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

   
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;

      apartments = apartments.filter((apt) => {
        const priceNum = parseFloat(apt.price);
        return !isNaN(priceNum) && priceNum >= min && priceNum <= max;
      });
    }

    return res.status(200).json({
      success: true,
      count: apartments.length,
      data: apartments,
    });
  } catch (error) {
    console.error("Get Apartments Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving apartments.",
      error: error.message,
    });
  }
};


exports.getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const apartment = await Apartment.findByPk(id);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: apartment,
    });
  } catch (error) {
    console.error("Get Apartment By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the apartment.",
      error: error.message,
    });
  }
};


exports.updateApartment = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can perform this action.",
      });
    }

    const { id } = req.params;
    const { title, description, location, price, status, amenities, apartment_type } = req.body;

    const apartment = await Apartment.findByPk(id);
    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found.",
      });
    }

    const { uploadToCloudinary } = require("../config/cloudinaryConfig");
    let imageUrls = apartment.images ? apartment.images.split(",") : [];
    let videoUrls = apartment.videos ? apartment.videos.split(",") : [];

    // Parse and stream files to Cloudinary if uploaded (completely replaces old lists)
    if (req.files) {
      if (req.files.images) {
        if (req.files.images.length > 6) {
          return res.status(400).json({
            success: false,
            message: "You can upload a maximum of 6 images.",
          });
        }
        imageUrls = [];
        for (const file of req.files.images) {
          const url = await uploadToCloudinary(file.buffer, "images", file.originalname);
          imageUrls.push(url);
        }
      }

      if (req.files.videos) {
        if (req.files.videos.length > 2) {
          return res.status(400).json({
            success: false,
            message: "You can upload a maximum of 2 videos.",
          });
        }
        videoUrls = [];
        for (const file of req.files.videos) {
          const url = await uploadToCloudinary(file.buffer, "videos", file.originalname);
          videoUrls.push(url);
        }
      }
    }

    if (title) apartment.title = title;
    if (description !== undefined) apartment.description = description;
    if (location !== undefined) apartment.location = location;
    if (price) apartment.price = price.toString();
    if (status) apartment.status = status;
    if (apartment_type) apartment.apartment_type = apartment_type;
    if (amenities !== undefined) {
      apartment.amenities = Array.isArray(amenities) ? amenities.join(",") : amenities || "";
    }

    apartment.images = imageUrls.join(",");
    apartment.videos = videoUrls.join(",");

    await apartment.save();

    return res.status(200).json({
      success: true,
      message: "Apartment updated successfully!",
      data: apartment,
    });
  } catch (error) {
    console.error("Update Apartment Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the apartment.",
      error: error.message,
    });
  }
};


exports.deleteApartment = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators can perform this action.",
      });
    }

    const { id } = req.params;
    const apartment = await Apartment.findByPk(id);

    if (!apartment) {
      return res.status(404).json({
        success: false,
        message: "Apartment not found.",
      });
    }

    await apartment.destroy();

    return res.status(200).json({
      success: true,
      message: "Apartment deleted successfully!",
    });
  } catch (error) {
    console.error("Delete Apartment Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the apartment.",
      error: error.message,
    });
  }
};
