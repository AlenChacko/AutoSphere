import React from "react";
import { useParams } from "react-router-dom";
import { cars } from "../../assets/cars";

const CarDetails = () => {
  const { brand, model } = useParams();

  const selectedCar = cars.find(
    (car) =>
      car.company.toLowerCase() === decodeURIComponent(brand).toLowerCase() &&
      car.model.toLowerCase() === decodeURIComponent(model).toLowerCase()
  );

  if (!selectedCar) {
    return <div className="text-center mt-10 text-red-600">Car not found.</div>;
  }

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">{selectedCar.model}</h2>
      <p className="text-gray-600 text-lg mb-6">{selectedCar.descriptions}</p>

      {/* Image carousel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {selectedCar.images.map((img, idx) => (
          <img key={idx} src={img} alt={`car-${idx}`} className="rounded-lg w-full h-56 object-cover" />
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
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Body Type</h4>
          <p className="text-gray-700">{selectedCar.body}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Fuel Options</h4>
          <p className="text-gray-700">{selectedCar.fuelOptions.join(", ")}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Drive Trains</h4>
          <p className="text-gray-700">{selectedCar.driveTrains.join(", ")}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Transmission</h4>
          <p className="text-gray-700">{selectedCar.transmission.join(", ")}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Available Colors</h4>
          <p className="text-gray-700">{selectedCar.colors.join(", ")}</p>
        </div>
      </div>

      {/* Specs */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">Specifications</h4>
        {Object.entries(selectedCar.spec).map(([fuelType, spec], idx) => (
          <div key={idx} className="mb-2">
            <p className="font-medium">{fuelType.toUpperCase()}:</p>
            <p className="text-gray-700">Power: {spec.power} BHP | Torque: {spec.torque} Nm</p>
          </div>
        ))}
      </div>

      {/* Book test drive */}
      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
        Book a Test Drive
      </button>
    </div>
  );
};

export default CarDetails;
