import React, { useState } from "react";
import { cars } from "../../assets/cars";
import { Link } from "react-router-dom";

const AllBrands = () => {
  // Extract unique brands with logo
  const brandMap = {};
  cars.forEach((car) => {
    if (!brandMap[car.company]) {
      brandMap[car.company] = car.logo;
    }
  });

  const allBrands = Object.entries(brandMap).map(([company, logo]) => ({
    company,
    logo,
  }));

  const [showAll, setShowAll] = useState(false);
  const displayedBrands = showAll ? allBrands : allBrands.slice(0, 8);

  return (
    <div className="px-6 py-10 bg-white">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Popular Car Brands
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayedBrands.map((brand, idx) => (
          <Link to={`/brands/${brand.company}`} key={idx}>
  <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl shadow p-4 hover:shadow-md transition">
    <img
      src={brand.logo}
      alt={brand.company}
      className="w-16 h-16 object-contain mb-2"
    />
    <h3 className="text-lg font-medium text-gray-700">
      {brand.company}
    </h3>
  </div>
</Link>
        ))}
      </div>

      {allBrands.length > 8 && (
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

export default AllBrands;
