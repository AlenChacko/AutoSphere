import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SellCar = () => {
  const { addUsedCar } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    model: "",
    year: "",
    kilometersDriven: "",
    price: "",
    accidentHistory: "No",
    transmission: "Manual",
    fuelType: "Petrol",
    insuranceAvailable: "No",
    place: "",
    district: "",
    state: "",
    phone: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...previews].slice(0, 5));
  };

  const removeImage = (index) => {
    const updated = [...selectedImages];
    updated.splice(index, 1);
    setSelectedImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImages.length === 0) {
      return toast.error("Please upload at least one image.");
    }

    const submitData = new FormData();
    for (const key in formData) {
      submitData.append(key, formData[key]);
    }

    selectedImages.forEach((img) => submitData.append("images", img.file));

    try {
      setUploading(true);
      await addUsedCar(submitData);
      toast.success("Ad posted");
      navigate("/your-ads");

      // Reset form
      setFormData({
        company: "",
        model: "",
        year: "",
        kilometersDriven: "",
        price: "",
        accidentHistory: "No",
        transmission: "Manual",
        fuelType: "Petrol",
        insuranceAvailable: "No",
        place: "",
        district: "",
        state: "",
        phone: "",
      });
      setSelectedImages([]);
    } catch (err) {
      toast.error("Something went wrong while submitting.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Sell Your Car
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company */}
        <InputField label="Company" name="company" value={formData.company} onChange={handleChange} required />

        {/* Model */}
        <InputField label="Model" name="model" value={formData.model} onChange={handleChange} required />

        {/* Year */}
        <InputField type="number" label="Year" name="year" value={formData.year} onChange={handleChange} required />

        {/* Kilometers Driven */}
        <InputField
          type="number"
          label="Kilometers Driven"
          name="kilometersDriven"
          value={formData.kilometersDriven}
          onChange={handleChange}
          required
        />

        {/* Price */}
        <InputField
          type="number"
          label="Expected Price (in ₹)"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        {/* Accident History */}
        <SelectField label="Accident History" name="accidentHistory" value={formData.accidentHistory} onChange={handleChange} options={["No", "Yes"]} />

        {/* Transmission */}
        <SelectField label="Transmission" name="transmission" value={formData.transmission} onChange={handleChange} options={["Manual", "Automatic"]} />

        {/* Fuel Type */}
        <SelectField
          label="Fuel Type"
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          options={["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]}
        />

        {/* Insurance Available */}
        <SelectField label="Insurance Available?" name="insuranceAvailable" value={formData.insuranceAvailable} onChange={handleChange} options={["No", "Yes"]} />

        {/* Place */}
        <InputField label="Place" name="place" value={formData.place} onChange={handleChange} placeholder="e.g. Kakkanad" required />

        {/* District */}
        <InputField label="District" name="district" value={formData.district} onChange={handleChange} placeholder="e.g. Ernakulam" required />

        {/* State */}
        <InputField label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g. Kerala" required />

        {/* Phone */}
        <InputField type="tel" label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. 9876543210" required />

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-gray-700">
            Upload Car Images (Max 5)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-md bg-white"
          />
          <div className="mt-4 flex flex-wrap gap-4">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 border rounded-md overflow-hidden">
                <img src={img.url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-sm hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {uploading ? "Submitting..." : "Submit Car Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable Input Field
const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", required = false }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      required={required}
    />
  </div>
);

// Reusable Select Field
const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block mb-1 font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default SellCar;
