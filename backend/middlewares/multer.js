import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// 🚗 Storage for car images
const carStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "autosphere/cars",
      allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const uploadCar = multer({ storage: carStorage });

// 👤 Storage for profile pictures
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "autosphere/profiles",
      allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const uploadProfile = multer({ storage: profileStorage });

// 🚙 Used Cars Storage (new)
const usedCarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "autosphere/used-cars",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "avif"],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});
const uploadUsedCar = multer({ storage: usedCarStorage });

// ✅ Export both uploaders
export { uploadCar, uploadProfile, uploadUsedCar };
