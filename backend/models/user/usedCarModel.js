import mongoose from "mongoose";

const usedCarSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1950,
    },
    kilometersDriven: {
      type: Number,
      required: true,
      min: 0,
    },
    accidentHistory: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
      required: true,
    },
    insuranceAvailable: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1000, // you can adjust minimum based on your use case
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Available", "Sold"],
      default: "Available",
    },
  },
  { timestamps: true }
);

const UsedCar = mongoose.model("UsedCar", usedCarSchema);

export default UsedCar;
