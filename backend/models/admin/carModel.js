import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    model: { type: String, required: true },
    price: {
      start: { type: Number, required: true },
      final: { type: Number, required: true },
    },
    body: { type: String, required: true },
    fuelOptions: [{ type: String, required: true }],
    driveTrains: [{ type: String }],
    transmission: [{ type: String }],
    colors: [{ type: String }],
    imageUrls: [{ type: String }],
    logoUrl: { type: String },      
    descriptions: { type: String }, 
    spec: {
      type: Map,
      of: new mongoose.Schema({
        power: String,
        torque: String,
      }),
      default: {},
    }, 
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;
