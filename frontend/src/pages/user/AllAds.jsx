import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const AllAds = () => {
  const { getAllUsedCars } = useUser();
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      const res = await getAllUsedCars();
      if (res.success) {
        setAds(res.data);
        setFilteredAds(res.data);
      }
      setLoading(false);
    };
    fetchAds();
  }, []);

  useEffect(() => {
    let filtered = [...ads];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ad) =>
          ad.company.toLowerCase().includes(term) ||
          ad.model.toLowerCase().includes(term) ||
          ad.place.toLowerCase().includes(term) ||
          ad.district.toLowerCase().includes(term)
      );
    }

    const min = parseInt(priceRange.min);
    const max = parseInt(priceRange.max);

    if (!isNaN(min)) filtered = filtered.filter((ad) => ad.price >= min);
    if (!isNaN(max)) filtered = filtered.filter((ad) => ad.price <= max);

    if (sortOrder === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredAds(filtered);
  }, [searchTerm, sortOrder, priceRange, ads]);

  if (loading)
    return <div className="text-center mt-10">Loading all ads...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        All Used Cars
      </h2>

      {/* 🔍 Filter & Search */}
      <div className="mb-6 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end w-full">
        <input
          type="text"
          placeholder="Search by company, model, or location..."
          className="border p-2 rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="lowToHigh">Low → High</option>
          <option value="highToLow">High → Low</option>
        </select>

        <div className="flex gap-2 w-full">
          <input
            type="number"
            placeholder="Min ₹"
            className="border p-2 rounded w-1/2"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Max ₹"
            className="border p-2 rounded w-1/2"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
          />
        </div>

        <div className="sm:col-span-2 md:col-span-1">
          <button
            className="w-full bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
            onClick={() => {
              setSearchTerm("");
              setSortOrder("");
              setPriceRange({ min: "", max: "" });
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* 🛑 No results */}
      {filteredAds.length === 0 ? (
        <div className="text-center text-gray-500">
          No cars match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <div
              key={ad._id}
              onClick={() => navigate(`/view-ad/${ad._id}`)}
              className="bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition duration-200 relative"
            >
              <div className="relative">
                <img
                  src={ad.images?.[0]?.url}
                  alt={`${ad.company} ${ad.model}`}
                  className="w-full h-48 object-cover"
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full text-white font-medium ${
                    ad.status?.toLowerCase().trim() === "sold"
                      ? "bg-red-600"
                      : ad.status?.toLowerCase().trim() === "pending"
                      ? "bg-yellow-500"
                      : "bg-green-600"
                  }`}
                >
                  {ad.status?.charAt(0).toUpperCase() +
                    ad.status?.slice(1) ||
                    "Available"}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {ad.company} {ad.model} ({ad.year})
                </h3>

                <p className="text-indigo-600 font-bold text-base">
                  ₹ {ad.price?.toLocaleString("en-IN")}
                </p>

                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.5-7.5 10.5-7.5 10.5S4.5 18 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  {ad.place}, {ad.district}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAds;
