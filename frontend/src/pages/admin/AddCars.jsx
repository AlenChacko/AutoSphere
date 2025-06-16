import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { toast } from "react-toastify";
import { useAdmin } from "../../context/AdminContext";

const OPTIONS = {
  bodyTypes: [
    "Mini SUV",
    "Compact SUV",
    "Full Size SUV",
    "Coupe",
    "Sedan",
    "MPV",
    "Hatchback",
    "Others",
  ],
  driveTrains: ["FWD", "RWD", "AWD", "4x4"],
  fuelOptions: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
  transmission: ["CVT", "DSG", "DCT", "AMT", "MT", "TC"], // ✅ fixed key
};

const AddCars = () => {
  const navigate = useNavigate();
  const { addCar } = useAdmin();

  const [formData, setFormData] = useState({
    company: "",
    model: "",
    price: { start: "", final: "" },
    body: "",
    fuelOptions: [],
    driveTrains: [],
    transmission: [], // ✅ renamed from transmissions
    colors: [""],
    descriptions: "",
    logo: null,
    images: [],
    spec: {},
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [engineTypes, setEngineTypes] = useState([""]);

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

  const toggleCheckbox = (field, value) => {
    const updated = formData[field].includes(value)
      ? formData[field].filter((v) => v !== value)
      : [...formData[field], value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCar(formData);
      toast.success("Car added successfully!");
      navigate("/admin/list-cars");
    } catch {
      toast.error("Failed to add car.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-8 rounded-lg shadow"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Car</h2>

          {/* Basic Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="input-style"
              placeholder="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
            <input
              className="input-style"
              placeholder="Model"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
            <input
              className="input-style"
              type="number"
              placeholder="Start Price"
              value={formData.price.start}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, start: e.target.value },
                })
              }
            />
            <input
              className="input-style"
              type="number"
              placeholder="Final Price"
              value={formData.price.final}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, final: e.target.value },
                })
              }
            />
            <select
              className="input-style col-span-2"
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
            >
              <option value="">Select Body Type</option>
              {OPTIONS.bodyTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <textarea
            className="input-style w-full"
            placeholder="Description"
            rows={3}
            value={formData.descriptions}
            onChange={(e) =>
              setFormData({ ...formData, descriptions: e.target.value })
            }
          />

          {/* Checkbox Groups */}
          {["fuelOptions", "driveTrains", "transmission"].map((field) => (
            <div key={field}>
              <label className="block font-semibold mb-2 text-gray-700 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <div className="flex flex-wrap gap-4">
                {OPTIONS[field]?.map((option) => (
                  <label
                    key={option}
                    className="flex gap-2 items-center text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={formData[field]?.includes(option)}
                      onChange={() => toggleCheckbox(field, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Colors */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Colors
            </label>
            {formData.colors.map((val, idx) => (
              <input
                key={idx}
                className="input-style"
                placeholder={`Color ${idx + 1}`}
                value={val}
                onChange={(e) =>
                  handleArrayChange("colors", idx, e.target.value)
                }
              />
            ))}
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline mt-1"
              onClick={() => addArrayField("colors")}
            >
              + Add More
            </button>
          </div>

          {/* Specs */}
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">
              Engine Specs
            </label>
            {engineTypes.map((type, idx) => (
              <div key={idx} className="grid md:grid-cols-3 gap-4 mb-2">
                <input
                  className="input-style"
                  placeholder="Engine Type"
                  value={type}
                  onChange={(e) => {
                    const newTypes = [...engineTypes];
                    newTypes[idx] = e.target.value;
                    setEngineTypes(newTypes);
                  }}
                />
                <input
                  className="input-style"
                  type="number"
                  placeholder="Power"
                  onChange={(e) =>
                    handleSpecChange(type, "power", e.target.value)
                  }
                />
                <input
                  className="input-style"
                  type="number"
                  placeholder="Torque"
                  onChange={(e) =>
                    handleSpecChange(type, "torque", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline mt-1"
              onClick={() => setEngineTypes([...engineTypes, ""])}
            >
              + Add Engine
            </button>
          </div>

          {/* Uploads */}
          <input
            className="input-style"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, logo: e.target.files[0] })
            }
          />
          <input
            className="input-style"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <div className="flex flex-wrap gap-2 mt-4">
            {previewImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                className="w-20 h-20 object-cover rounded"
                alt="preview"
              />
            ))}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
          >
            Submit Car
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddCars;
