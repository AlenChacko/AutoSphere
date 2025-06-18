import React, { useState } from "react";

const SellCar = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...previews].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">Sell Your Car</h2>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Company</label>
          <input
            type="text"
            placeholder="Enter company"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Model */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Model</label>
          <input
            type="text"
            placeholder="Enter model"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Year</label>
          <input
            type="number"
            placeholder="e.g. 2020"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Kilometers Driven */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Kilometers Driven</label>
          <input
            type="number"
            placeholder="e.g. 35000"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Accident History */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Accident History</label>
          <select className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Transmission</label>
          <select className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
            <option>Manual</option>
            <option>Automatic</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Fuel Type</label>
          <select className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
            <option>Petrol</option>
            <option>Diesel</option>
            <option>CNG</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>
        </div>

        {/* Insurance */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Insurance Available?</label>
          <select className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-gray-700">Upload Car Images (Max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-md bg-white"
          />

          {/* Image Previews */}
          <div className="mt-4 flex flex-wrap gap-4">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 border rounded-md overflow-hidden">
                <img
                  src={img.url}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover"
                />
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

        {/* Submit button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Submit Car Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellCar;
