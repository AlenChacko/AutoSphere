import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const CarSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for cars, models, or brands..."
          className="w-full pl-12 pr-4 py-3 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600">
          <FaSearch />
        </div>
        <button
          onClick={handleSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default CarSearchBar;
