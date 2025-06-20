import handler from "express-async-handler";
import Car from "../../models/admin/carModel.js";
import User from "../../models/user/userModel.js";
import UsedCar from '../../models/user/usedCarModel.js'
import TestDriveBooking from "../../models/user/testDriveModel.js";
import cloudinary from '../../utils/cloudinary.js'

export const getAllCars = handler(async (req, res) => {
  const cars = await Car.find();
  res.status(200).json(cars);
});

export const getUserInfo = handler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

export const updateProfile = handler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { firstName, lastName, email, phone, state, district, pin } = req.body;

  // Update basic fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  // Update location
  user.location = {
    state: state || user.location?.state || "",
    district: district || user.location?.district || "",
    pin: pin || user.location?.pin || "",
  };

  // If a new profile image is uploaded
  if (req.file && req.file.path) {
    // 🔥 Delete old image from Cloudinary if it exists
    if (user.profilePic?.public_id) {
      await cloudinary.uploader.destroy(user.profilePic.public_id);
    }

    // Upload new image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "autosphere/profiles",
    });

    // Set new profile image (as an object)
    user.profilePic = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    phone: updatedUser.phone,
    location: updatedUser.location,
    profilePic: updatedUser.profilePic,
  });
});

export const bookTestDrive = handler(async (req, res) => {
  const userId = req.user._id;
  const {
    car,
    firstName,
    lastName,
    email,
    phone,
    location,
    preferredDate,
  } = req.body;

  // Validation
  if (
    !car ||
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !location?.state ||
    !location?.district ||
    !location?.pin ||
    !preferredDate
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Check if car exists
  const carExists = await Car.findById(car);
  if (!carExists) {
    res.status(404);
    throw new Error("Car not found");
  }

  // Create booking
  const booking = await TestDriveBooking.create({
    user: userId,
    car,
    firstName,
    lastName,
    email,
    phone,
    location,
    preferredDate,
  });

  // ⬇️ NEW: Push booking to user's testDrives array
  await User.findByIdAndUpdate(userId, {
    $push: { testDrives: booking._id },
  });

  res.status(201).json({
    message: "Test drive booked successfully",
    booking,
  });
});

export const getUserTestDrives = handler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .populate({
      path: "testDrives",
      populate: {
        path: "car", 
      },
    });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.testDrives); // send populated test drives
});

export const addUsedCar = handler(async (req, res) => {
  const {
    company,
    model,
    year,
    kilometersDriven,
    accidentHistory,
    transmission,
    fuelType,
    insuranceAvailable,
    place,
    district,
    state,
    phone,
    price,
    description, // ✅ include description
  } = req.body;

  const imageFiles = req?.files || [];

  // ✅ Upload images to Cloudinary
  const images = await Promise.all(
    imageFiles.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "autosphere/used-cars",
      });

      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    })
  );

  // ✅ Validate required fields
  if (
    !company ||
    !model ||
    !year ||
    !kilometersDriven ||
    !accidentHistory ||
    !transmission ||
    !fuelType ||
    !insuranceAvailable ||
    !place ||
    !district ||
    !state ||
    !phone ||
    !price ||
    images.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  // ✅ Create and save the used car
  const usedCar = new UsedCar({
    company: company.trim(),
    model: model.trim(),
    year: Number(year),
    kilometersDriven: Number(kilometersDriven),
    accidentHistory,
    transmission,
    fuelType,
    insuranceAvailable,
    place: place.trim(),
    district: district.trim(),
    state: state.trim(),
    phone: phone.trim(),
    price: Number(price),
    description: description?.trim() || "", // ✅ add description safely
    images,
    postedBy: req.user._id,
  });

  await usedCar.save();

  res.status(201).json({
    message: "Used car added successfully",
    usedCar,
  });
});

export const getMyUsedCars = handler(async (req, res) => {
  const userId = req.user._id;

  const myAds = await UsedCar.find({ postedBy: userId }).sort({
    createdAt: -1,
  });

  res.status(200).json(myAds);
});

export const getAllUsedCars = handler(async (req, res) => {
  const cars = await UsedCar.find({}).sort({ createdAt: -1 });
  res.status(200).json(cars);
});

export const getUsedCarById = handler(async (req, res) => {
  const usedCar = await UsedCar.findById(req.params.id).populate("postedBy", "firstName lastName email")
  if (!usedCar) {
    return res.status(404).json({ message: "Ad not found" });
  }
  res.status(200).json(usedCar);
});

export const updateUsedCar = handler(async (req, res) => {
  const usedCar = await UsedCar.findById(req.params.id);

  if (!usedCar) {
    return res.status(404).json({ message: "Used car not found" });
  }

  // 🔒 Check if the logged-in user is the owner
  if (usedCar.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const {
    company,
    model,
    year,
    kilometersDriven,
    accidentHistory,
    transmission,
    fuelType,
    insuranceAvailable,
    place,
    district,
    state,
    phone,
    price,
    description,
  } = req.body;

  console.log("usedcarrr",req.body)

  const imageFiles = req.files || [];

  // 🔄 Upload new images (if any)
  let newImages = [];
  if (imageFiles.length > 0) {
    // 🗑️ Delete old images from Cloudinary
    for (const img of usedCar.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // ⬆️ Upload new images
    newImages = await Promise.all(
      imageFiles.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "autosphere/used-cars",
        });

        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      })
    );
  }

  // 📝 Update fields
  usedCar.company = company?.trim() || usedCar.company;
  usedCar.model = model?.trim() || usedCar.model;
  usedCar.year = year || usedCar.year;
  usedCar.kilometersDriven = kilometersDriven || usedCar.kilometersDriven;
  usedCar.accidentHistory = accidentHistory || usedCar.accidentHistory;
  usedCar.transmission = transmission || usedCar.transmission;
  usedCar.fuelType = fuelType || usedCar.fuelType;
  usedCar.insuranceAvailable = insuranceAvailable || usedCar.insuranceAvailable;
  usedCar.place = place?.trim() || usedCar.place;
  usedCar.district = district?.trim() || usedCar.district;
  usedCar.state = state?.trim() || usedCar.state;
  usedCar.phone = phone?.trim() || usedCar.phone;
  usedCar.price = price || usedCar.price;
  usedCar.description = description?.trim() || usedCar.description;
  if (newImages.length > 0) usedCar.images = newImages;

  await usedCar.save();

  res.status(200).json({
    message: "Used car updated successfully",
    usedCar,
  });
});

export const addToWishlist = handler(async (req, res) => {
  const userId = req.user._id;
  const carId = req.params.carId;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.wishlist.includes(carId)) {
    user.wishlist.push(carId);
    await user.save();
  }

  res.status(200).json({ success: true, message: "Added to wishlist" });
});

export const removeFromWishlist = handler(async (req, res) => {
  const userId = req.user._id;
  const carId = req.params.carId;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const index = user.wishlist.indexOf(carId);
  if (index > -1) {
    user.wishlist.splice(index, 1);
    await user.save();
  }

  res.status(200).json({ success: true, message: "Removed from wishlist" });
});

export const getWishlist = handler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user.wishlist);
});

export const markUsedCarAsSold = handler(async (req, res) => {
  const userId = req.user._id;
  const carId = req.params.id;

  const car = await UsedCar.findById(carId);

  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  if (car.postedBy.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("You are not authorized to update this ad");
  }

  car.status = "Sold";
  await car.save();

  res.status(200).json({ success: true, message: "Car marked as sold" });
});