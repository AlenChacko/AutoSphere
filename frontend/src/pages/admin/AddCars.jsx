import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAdmin } from "../../context/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const bodyOptions = [
  "SUV",
  "Compact SUV",
  "Sub 4mtr SUV",
  "Sedan",
  "MPV",
  "Hatchback",
  "Others",
];

const driveTrainOptions = ["FWD", "RWD", "AWD", "4x4"];
const fuelOptionsList = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const transmissionOptions = ["CVT", "DSG", "DCT", "AMT", "MT", "TC"];

const AddCars = () => {
  const [formData, setFormData] = useState({
    company: "",
    model: "",
    price: { start: "", final: "" },
    body: "",
    fuelOptions: [],
    driveTrains: [],
    transmission: [],
    colors: [""],
    descriptions: "",
    logo: null,
    images: [],
    spec: {},
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [engineTypes, setEngineTypes] = useState([""]);
  const navigate = useNavigate();

  const { addCar, loading } = useAdmin();

  const handleArrayChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const handleSpecChange = (type, key, value) => {
    const updatedSpec = { ...formData.spec };
    if (!updatedSpec[type]) updatedSpec[type] = {};
    updatedSpec[type][key] = value;
    setFormData({ ...formData, spec: updatedSpec });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleLogoChange = (e) => {
    setFormData({ ...formData, logo: e.target.files[0] });
  };

  const toggleFuelOption = (fuel) => {
    const updated = formData.fuelOptions.includes(fuel)
      ? formData.fuelOptions.filter((f) => f !== fuel)
      : [...formData.fuelOptions, fuel];
    setFormData({ ...formData, fuelOptions: updated });
  };

  const toggleTransmission = (value) => {
    const updated = formData.transmission.includes(value)
      ? formData.transmission.filter((t) => t !== value)
      : [...formData.transmission, value];
    setFormData({ ...formData, transmission: updated });
  };

  const toggleDriveTrain = (value) => {
    const updated = formData.driveTrains.includes(value)
      ? formData.driveTrains.filter((d) => d !== value)
      : [...formData.driveTrains, value];
    setFormData({ ...formData, driveTrains: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addCar(formData);
      toast.success("Car uploaded successfully!");

      // Reset form
      setFormData({
        company: "",
        model: "",
        price: { start: "", final: "" },
        body: "",
        fuelOptions: [],
        driveTrains: [],
        transmission: [],
        colors: [""],
        descriptions: "",
        logo: null,
        images: [],
        spec: {},
      });
      setPreviewImages([]);

      // Redirect after short delay (optional)
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload car. Check console.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Add New Car</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-10 bg-white p-8 rounded-lg shadow-lg"
        >
          {/* --- Basic Info --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Company"
              className="input-style"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Model"
              className="input-style"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Start Price (₹ Lakh)"
              className="input-style"
              value={formData.price.start}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, start: e.target.value },
                })
              }
            />
            <input
              type="number"
              placeholder="Final Price (₹ Lakh)"
              className="input-style"
              value={formData.price.final}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, final: e.target.value },
                })
              }
            />

            {/* --- Body Type --- */}
            <select
              className="input-style col-span-2"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
            >
              <option value="">Select Body Type</option>
              {bodyOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* --- Description --- */}
          <textarea
            placeholder="Description"
            className="input-style w-full"
            rows={3}
            value={formData.descriptions}
            onChange={(e) =>
              setFormData({ ...formData, descriptions: e.target.value })
            }
          />

          {/* --- Fuel Options --- */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Fuel Options
            </label>
            <div className="flex flex-wrap gap-4">
              {fuelOptionsList.map((fuel) => (
                <label
                  key={fuel}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={formData.fuelOptions.includes(fuel)}
                    onChange={() => toggleFuelOption(fuel)}
                  />
                  {fuel}
                </label>
              ))}
            </div>
          </div>

          {/* --- Drive Trains --- */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Drive Trains
            </label>
            <div className="flex flex-wrap gap-4">
              {driveTrainOptions.map((drive) => (
                <label
                  key={drive}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={formData.driveTrains.includes(drive)}
                    onChange={() => toggleDriveTrain(drive)}
                  />
                  {drive}
                </label>
              ))}
            </div>
          </div>

          {/* --- Transmission --- */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Transmission Types
            </label>
            <div className="flex flex-wrap gap-4">
              {transmissionOptions.map((trans) => (
                <label
                  key={trans}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={formData.transmission.includes(trans)}
                    onChange={() => toggleTransmission(trans)}
                  />
                  {trans}
                </label>
              ))}
            </div>
          </div>

          {/* --- Colors --- */}
          <div>
            <label className="block font-semibold mb-2 capitalize text-gray-700">
              Colors
            </label>
            <div className="space-y-2">
              {formData.colors.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  placeholder={`Color ${idx + 1}`}
                  className="input-style"
                  value={val}
                  onChange={(e) =>
                    handleArrayChange("colors", idx, e.target.value)
                  }
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => addArrayField("colors")}
              className="mt-1 text-blue-600 text-sm hover:underline"
            >
              + Add More
            </button>
          </div>

          {/* --- Specs --- */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Engine Specifications
            </label>

            {engineTypes.map((type, idx) => (
              <div key={idx} className="grid md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Engine Type (e.g. turboPetrol)"
                  className="input-style"
                  value={type}
                  onChange={(e) => {
                    const updatedTypes = [...engineTypes];
                    updatedTypes[idx] = e.target.value;
                    setEngineTypes(updatedTypes);
                  }}
                />

                <input
                  type="number"
                  placeholder="Power (e.g. 120)"
                  className="input-style"
                  onChange={(e) =>
                    handleSpecChange(engineTypes[idx], "power", e.target.value)
                  }
                />

                <input
                  type="number"
                  placeholder="Torque (e.g. 170)"
                  className="input-style"
                  onChange={(e) =>
                    handleSpecChange(engineTypes[idx], "torque", e.target.value)
                  }
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => setEngineTypes([...engineTypes, ""])}
              className="mt-1 text-blue-600 text-sm hover:underline"
            >
              + Add More
            </button>
          </div>

          {/* --- Upload Logo --- */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Upload Logo
            </label>
            <input
              type="file"
              accept="image/*"
              className="input-style"
              onChange={handleLogoChange}
            />
          </div>

          {/* --- Upload Images --- */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Upload Car Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="input-style"
              onChange={handleImageChange}
            />
            <div className="flex flex-wrap gap-4 mt-4">
              {previewImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`preview-${idx}`}
                  className="w-24 h-24 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>

          {/* --- Submit Button --- */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit Car
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddCars;
