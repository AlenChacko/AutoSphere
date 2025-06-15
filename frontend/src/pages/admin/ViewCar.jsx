// pages/admin/ViewCar.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

const ViewCar = () => {
  const { id } = useParams();
  const { fetchCarById, selectedCar, loading } = useAdmin();
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    fetchCarById(id);
  }, [id]);

  useEffect(() => {
    if (selectedCar?.images?.length > 0) {
      setMainImage(selectedCar.images[0].url);
    }
  }, [selectedCar]);

  if (loading || !selectedCar) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading car details...</p>
    );
  }

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        {selectedCar.logo?.url && (
  <img
    src={selectedCar.logo.url}
    alt={`${selectedCar.company} logo`}
    className="w-12 h-12 object-contain"
  />
)}
        <h2 className="text-4xl font-bold text-gray-800">
          {selectedCar.model}
        </h2>
      </div>
      <p className="text-gray-600 text-lg mb-6">{selectedCar.descriptions}</p>

      {/* Main image */}
      <div className="mb-4">
        <img
          src={mainImage || "/fallback-car.jpg"}
          alt="main"
          className="rounded-xl w-full h-[400px] object-contain shadow-lg transition-all"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-4 mb-8">
        {selectedCar.images?.slice(1).map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={`thumb-${idx}`}
            onClick={() => setMainImage(img.url)}
            className="w-32 h-20 object-cover rounded-md cursor-pointer border-2 hover:border-blue-500 transition"
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Price</h4>
          <p className="text-gray-700">
            ₹ {selectedCar.price.start} – {selectedCar.price.final} Lakh
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Body Type
          </h4>
          <p className="text-gray-700">{selectedCar.body}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Fuel Options
          </h4>
          <p className="text-gray-700">{selectedCar.fuelOptions?.join(", ")}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Drive Trains
          </h4>
          <p className="text-gray-700">{selectedCar.driveTrains?.join(", ")}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Transmission
          </h4>
          <p className="text-gray-700">
            {selectedCar.transmission?.join(", ")}
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Available Colors
          </h4>
          <p className="text-gray-700">{selectedCar.colors?.join(", ")}</p>
        </div>
      </div>

      {/* Specs */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">
          Specifications
        </h4>
        {selectedCar.spec &&
          Object.entries(selectedCar.spec).map(([fuelType, spec], idx) => (
            <div key={idx} className="mb-2">
              <p className="font-medium">{fuelType.toUpperCase()}:</p>
              <p className="text-gray-700">
                Power: {spec.power} BHP | Torque: {spec.torque} Nm
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ViewCar;
