import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const SearchResults = () => {
  const { cars, loadingCars, errorCars } = useUser();
  const [filteredCars, setFilteredCars] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q")?.toLowerCase() || "";

  useEffect(() => {
    const result = cars.filter(
      (car) =>
        car.model.toLowerCase().includes(query) ||
        car.company.toLowerCase().includes(query) ||
        (car.title && car.title.toLowerCase().includes(query))
    );
    setFilteredCars(result);
  }, [cars, query]);

  useEffect(() => {
    if (sortOrder === "lowToHigh") {
      setFilteredCars((prev) =>
        [...prev].sort((a, b) => a.price.start - b.price.start)
      );
    } else if (sortOrder === "highToLow") {
      setFilteredCars((prev) =>
        [...prev].sort((a, b) => b.price.start - a.price.start)
      );
    }
  }, [sortOrder]);

  if (loadingCars) {
    return <div className="text-center text-gray-500 py-10">Loading cars...</div>;
  }

  if (errorCars) {
    return <div className="text-center text-red-600 py-10">{errorCars}</div>;
  }

  if (filteredCars.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        No cars found matching <strong>"{query}"</strong>.
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Results for "<span className="text-blue-600">{query}</span>"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car, index) => (
          <Link key={index} to={`/car/${car._id}`}>
            <div className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
              <img
                src={car.images?.[0]?.url || "/fallback-car.jpg"}
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

export default SearchResults;
