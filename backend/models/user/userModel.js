import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isGoogleUser: {
      type: Boolean,
      default: false, // 👈 New field
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      state: {
        type: String,
        trim: true,
        default: "",
      },
      district: {
        type: String,
        trim: true,
        default: "",
      },
      pin: {
        type: Number,
        default: null,
      },
    },
    profilePic: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    testDrives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestDriveBooking",
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UsedCar",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
