import { v2 as cloudinary } from "cloudinary";
import handler from "express-async-handler";
import Car from "../../models/admin/carModel.js";

// export const addCars = handler(async (req, res) => {
//   const {
//     company,
//     model,
//     priceStart,
//     priceFinal,
//     body,
//     fuelOptions,
//     driveTrains,
//     transmission,
//     colors,
//     descriptions,
//     spec,
//   } = req.body;

//   // Extract files
//   const logoFile = req?.files?.logo?.[0];
//   const imageFiles = req?.files?.images || [];

//   const logoUrl = logoFile?.path || "";
//   const imageUrls = imageFiles.map((file) => file.path);

//   // Safely parse JSON fields
//   let parsedFuelOptions = [],
//     parsedDriveTrains = [],
//     parsedTransmission = [],
//     parsedColors = [],
//     parsedSpec = {};
//   try {
//     parsedFuelOptions = JSON.parse(fuelOptions || "[]");
//     parsedDriveTrains = JSON.parse(driveTrains || "[]");
//     parsedTransmission = JSON.parse(transmission || "[]");
//     parsedColors = JSON.parse(colors || "[]");
//     parsedSpec = JSON.parse(spec || "{}");
//   } catch (err) {
//     console.error("❌ JSON parsing error:", err);
//     return res
//       .status(400)
//       .json({ message: "Invalid JSON in form data", error: err.message });
//   }

//   // Minimal validation
//   if (
//     !company ||
//     !model ||
//     !priceStart ||
//     !priceFinal ||
//     !body ||
//     parsedFuelOptions.length === 0 ||
//     imageUrls.length === 0
//   ) {
//     console.warn("⚠️ Missing required fields");
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   // Construct new car document
//   const newCar = new Car({
//     company,
//     model,
//     price: {
//       start: Number(priceStart),
//       final: Number(priceFinal),
//     },
//     body,
//     fuelOptions: parsedFuelOptions,
//     driveTrains: parsedDriveTrains,
//     transmission: parsedTransmission,
//     colors: parsedColors,
//     descriptions,
//     imageUrls,
//     logoUrl,
//     spec: parsedSpec,
//   });

//   await newCar.save();

//   res.status(201).json({ message: "Car added successfully", car: newCar });
// });


export const addCars = handler(async (req, res) => {
  const {
    company,
    model,
    priceStart,
    priceFinal,
    body,
    fuelOptions,
    driveTrains,
    transmission,
    colors,
    descriptions,
    spec,
  } = req.body;

  const logoFile = req?.files?.logo?.[0];
  const imageFiles = req?.files?.images || [];

  // Upload logo to Cloudinary
  let logo = {};
  if (logoFile) {
    const result = await cloudinary.uploader.upload(logoFile.path, {
      folder: "cars/logos",
    });
    logo = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  // Upload car images to Cloudinary
  const images = await Promise.all(
    imageFiles.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "cars/gallery",
      });
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    })
  );

  // Parse JSON fields safely
  let parsedFuelOptions = [],
    parsedDriveTrains = [],
    parsedTransmission = [],
    parsedColors = [],
    parsedSpec = {};

  try {
    parsedFuelOptions = JSON.parse(fuelOptions || "[]");
    parsedDriveTrains = JSON.parse(driveTrains || "[]");
    parsedTransmission = JSON.parse(transmission || "[]");
    parsedColors = JSON.parse(colors || "[]");
    parsedSpec = JSON.parse(spec || "{}");
  } catch (err) {
    console.error("❌ JSON parsing error:", err);
    return res
      .status(400)
      .json({ message: "Invalid JSON in form data", error: err.message });
  }

  // Validate required fields
  if (
    !company ||
    !model ||
    !priceStart ||
    !priceFinal ||
    !body ||
    parsedFuelOptions.length === 0 ||
    images.length === 0
  ) {
    console.warn("⚠️ Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Create and save car
  const newCar = new Car({
    company,
    model,
    price: {
      start: Number(priceStart),
      final: Number(priceFinal),
    },
    body,
    fuelOptions: parsedFuelOptions,
    driveTrains: parsedDriveTrains,
    transmission: parsedTransmission,
    colors: parsedColors,
    descriptions,
    logo,      // Now an object with public_id and url
    images,    // Now an array of objects with public_id and url
    spec: parsedSpec,
  });

  await newCar.save();

  res.status(201).json({ message: "Car added successfully", car: newCar });
});

export const getCars = handler(async (req, res) => {
  const cars = await Car.find(); 
  res.status(200).json(cars);
});

export const deleteCar = handler(async (req, res) => {
  const { id } = req.params;
  console.log("➡️ Attempting to delete car with ID:", id);

  const car = await Car.findById(id);
  if (!car) {
    console.log("❌ Car not found in the database.");
    return res.status(404).json({ message: "Car not found" });
  }

  console.log(`✅ Car found: ${car.name || "Unnamed Car"}, checking for images...`);
  console.log("🧾 car.images =", car.images); // <-- Added debug log here

  // Delete images from Cloudinary
  if (car.images && car.images.length > 0) {
    console.log(`🖼️ Found ${car.images.length} image(s). Attempting to delete from Cloudinary...`);

    for (const image of car.images) {
      try {
        let publicId;

        if (typeof image === "string") {
          // handle if image is just a public_id string
          publicId = image;
        } else if (typeof image === "object" && image.public_id) {
          publicId = image.public_id;
        } else {
          console.warn("⚠️ Skipping image: Invalid format or missing public_id", image);
          continue;
        }

        console.log("🗑️ Deleting image from Cloudinary with public_id:", publicId);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`✅ Cloudinary response for ${publicId}:`, result);
      } catch (err) {
        console.error(`❌ Error deleting image from Cloudinary:`, err.message);
      }
    }
  } else {
    console.log("ℹ️ No images found to delete for this car.");
  }

  await car.deleteOne();
  console.log("✅ Car deleted from database.");

  res.status(200).json({ message: "Car and its images deleted successfully" });
});