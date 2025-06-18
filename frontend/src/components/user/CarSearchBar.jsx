import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const CarSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const { cars } = useUser();

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = cars.filter((car) => {
      const lower = value.toLowerCase();
      return (
        car.model.toLowerCase().includes(lower) ||
        car.company.toLowerCase().includes(lower)
      );
    });

    setSuggestions(filtered.slice(0, 5));
  };

  return (
  <div className="w-full max-w-2xl mx-auto px-4 py-6">
    <div className="relative">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search for cars, models, or brands..."
        className="w-full pl-12 pr-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      {/* Search icon */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600">
        <FaSearch />
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
      >
        Search
      </button>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md max-h-64 overflow-y-auto">
          {suggestions.map((car, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
              onClick={() => {
                navigate(`/search?q=${encodeURIComponent(car.model)}`);
                setSearchTerm(car.model);
                setSuggestions([]);
              }}
            >
              <div className="flex items-center gap-2">
                {car.logo?.url && (
                  <img
                    src={car.logo.url}
                    alt={`${car.company} logo`}
                    className="h-5 w-5 object-contain"
                  />
                )}
                <span>{car.company} {car.model}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

};

export default CarSearchBar;
