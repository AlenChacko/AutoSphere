import React from "react";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";

const AllBrands = () => {
  const { cars, loadingCars, errorCars } = useUser();

  // Handle loading/error states
  if (loadingCars) {
    return (
      <div className="text-center py-10 text-gray-500">Loading brands...</div>
    );
  }

  if (errorCars) {
    return <div className="text-center py-10 text-red-600">{errorCars}</div>;
  }

  // Map unique brands with logo from backend data
  const brandMap = {};
  cars.forEach((car) => {
    if (!brandMap[car.company]) {
      brandMap[car.company] = car.logo?.url;
    }
  });

  const allBrands = Object.entries(brandMap).map(([company, logo]) => ({
    company,
    logo,
  }));

  return (
    <div className="px-6 py-10 bg-white">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Popular Car Brands
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {allBrands.map((brand, idx) => (
          <Link to={`/brands/${brand.company}`} key={idx}>
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-xl shadow p-4 hover:shadow-md transition">
              <img
                src={brand.logo || "/fallback-logo.png"}
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
    </div>
  );
};

export default AllBrands;
