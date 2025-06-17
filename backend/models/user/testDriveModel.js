import mongoose from "mongoose";

const testDriveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    location: {
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      district: {
        type: String,
        required: [true, "District is required"],
        trim: true,
      },
      pin: {
        type: Number,
        required: [true, "PIN code is required"],
      },
    },

    // 🟢 User's preferred test drive date
    preferredDate: {
      type: Date,
      required: [true, "Preferred test drive date is required"],
    },

    // 🟠 Admin-assigned confirmed date (optional initially)
    assignedDate: {
      type: Date,
      default: null,
    },

    // 🔵 Booking status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const TestDriveBooking = mongoose.model("TestDriveBooking", testDriveSchema);

export default TestDriveBooking;
