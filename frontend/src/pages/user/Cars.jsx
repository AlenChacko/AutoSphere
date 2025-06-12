import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { cars } from "../../assets/cars";

const Cars = () => {
  const { brand } = useParams();
  const [sortOrder, setSortOrder] = useState("default");

  if (!brand) {
    return <div className="text-center text-red-500">Brand not specified.</div>;
  }

  let filteredCars = cars.filter(
    (car) => car.company.toLowerCase() === brand.toLowerCase()
  );

  if (filteredCars.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No cars found for brand <strong>{brand}</strong>.
      </div>
    );
  }

  // Apply sorting based on selected order
  if (sortOrder === "lowToHigh") {
    filteredCars.sort((a, b) => a.price.start - b.price.start);
  } else if (sortOrder === "highToLow") {
    filteredCars.sort((a, b) => b.price.start - a.price.start);
  }

  return (
    <div className="px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          {filteredCars[0]?.logo && (
            <img
              src={filteredCars[0].logo}
              alt={`${brand} logo`}
              className="h-8 w-auto object-contain"
            />
          )}
          <h2 className="text-3xl font-semibold text-gray-800">{brand}</h2>
        </div>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-auto text-gray-700"
        >
          <option value="default">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car, index) => (
          <Link
            key={index}
            to={`/car/${encodeURIComponent(car.company)}/${encodeURIComponent(
              car.model
            )}`}
          >
            <div className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
              <img
                src={car.images[0]}
                alt={car.model}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">{car.model}</h3>
              <p className="text-gray-600">
                ₹ {car.price.start} - {car.price.final} Lakh
              </p>
              <p className="text-sm text-gray-500 mt-2">{car.body}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Cars;
