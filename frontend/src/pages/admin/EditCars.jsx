// pages/admin/EditCars.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { toast } from "react-toastify";

const OPTIONS = {
  bodyTypes: [
    "Mini SUV",
    "Compact SUV",
    "Full Size SUV",
    "Coupe SUV",
    "Coupe",
    "Sedan",
    "Compact Sedan",
    "MPV",
    "Hatchback",
    "Pick-up Truck",
    "Others",
  ],
  driveTrains: ["FWD", "RWD", "AWD", "4x4"],
  fuelOptions: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
  transmission: ["CVT", "DSG", "DCT", "AMT", "MT", "TC","AT"], 
};

const EditCars = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCarById, selectedCar, updateCar } = useAdmin();

  const [formData, setFormData] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [engineTypes, setEngineTypes] = useState([]);
  const [previewLogo, setPreviewLogo] = useState(null);

  useEffect(() => {
    fetchCarById(id);
  }, [id]);

  useEffect(() => {
    if (selectedCar) {
      setFormData({
        company: selectedCar.company || "",
        model: selectedCar.model || "",
        price: {
          start: selectedCar.price?.start || "",
          final: selectedCar.price?.final || "",
        },
        body: selectedCar.body || "",
        fuelOptions: selectedCar.fuelOptions || [],
        driveTrains: selectedCar.driveTrains || [],
        transmission: selectedCar.transmission || [], // ✅ use correct field
        colors: selectedCar.colors || [""],
        descriptions: selectedCar.descriptions || "",
        logo: null,
        images: [],
        spec: selectedCar.spec || {},
      });
      setPreviewImages(selectedCar.images?.map((img) => img.url) || []);
      setEngineTypes(Object.keys(selectedCar.spec || {}));
      setPreviewLogo(selectedCar.logo?.url || null);
    }
  }, [selectedCar]);

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
      await updateCar(id, formData);
      toast.success("Car updated successfully");
      navigate("/admin/list-cars");
    } catch (error) {
      toast.error("Failed to update car");
      console.error("Update error:", error);
    }
  };

  if (!formData) return <p className="p-10">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-8 rounded-lg shadow"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit Car</h2>

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
                  value={formData.spec?.[type]?.power || ""}
                  onChange={(e) =>
                    handleSpecChange(type, "power", e.target.value)
                  }
                />
                <input
                  className="input-style"
                  type="number"
                  placeholder="Torque"
                  value={formData.spec?.[type]?.torque || ""}
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

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Update Logo</label>
            <input
              className="input-style"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFormData({ ...formData, logo: file });
                  setPreviewLogo(URL.createObjectURL(file));
                }
              }}
            />

            {previewLogo && (
              <div className="relative w-20 h-20 mt-2">
                <img
                  src={previewLogo}
                  alt="Logo Preview"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                  onClick={() => {
                    setPreviewLogo(null);
                    setFormData({ ...formData, logo: null });
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
          <input
            className="input-style"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <div className="flex flex-wrap gap-4 mt-4">
            {previewImages.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20">
                <img
                  src={img}
                  className="w-full h-full object-cover rounded"
                  alt="preview"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                  onClick={() => {
                    const updatedImages = [...previewImages];
                    updatedImages.splice(idx, 1);
                    setPreviewImages(updatedImages);

                    // Also remove from formData.images if files were selected
                    const updatedFiles = [...formData.images];
                    if (updatedFiles.length > 0) {
                      updatedFiles.splice(idx, 1);
                      setFormData({ ...formData, images: updatedFiles });
                    }
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
          >
            Save Changes
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditCars;
