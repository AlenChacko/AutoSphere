import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const PopularCars = () => {
  const { popularCars, loadingCars, errorCars } = useUser();

  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  const sortedCars = [...popularCars].sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price.start - b.price.start;
    if (sortOrder === "highToLow") return b.price.start - a.price.start;
    return 0;
  });

  const displayedCars = showAll ? sortedCars : sortedCars.slice(0, 8);

  if (loadingCars) return <p className="px-6 py-10">Loading cars...</p>;
  if (errorCars) return <p className="px-6 py-10 text-red-500">{errorCars}</p>;

  return (
    <div className="px-6 py-10 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-semibold text-gray-800">
          Popular Cars (₹5L – ₹15L)
        </h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedCars.map((car) => (
          <Link
            // to={`/car/${encodeURIComponent(car.company)}/${encodeURIComponent(car.model)}`}
             to={`/car/${car._id}`}
            key={car._id}
            className="bg-white rounded-xl shadow hover:shadow-md transition duration-300 overflow-hidden"
          >
            <img
              src={car.images?.[0]?.url || "/fallback-car.jpg"}
              alt={car.model}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800">
                {car.company} {car.model}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Starting at ₹{car.price.start}L
              </p>
            </div>
          </Link>
        ))}
      </div>

      {popularCars.length > 8 && (
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            {showAll ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PopularCars;
