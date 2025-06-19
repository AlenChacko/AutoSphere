// src/pages/user/AllAds.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const AllAds = () => {
  const { getAllUsedCars } = useUser();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      const res = await getAllUsedCars();
      if (res.success) {
        setAds(res.data);
      }
      setLoading(false);
    };

    fetchAds();
  }, []);

  if (loading)
    return <div className="text-center mt-10">Loading all ads...</div>;

  if (ads.length === 0)
    return (
      <div className="text-center mt-10 text-gray-500">
        No used car ads available at the moment.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        All Used Cars
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div
            key={ad._id}
            onClick={() => navigate(`/view-ad/${ad._id}`)}
            className="bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition duration-200"
          >
            <img
              src={ad.images?.[0]?.url}
              alt={`${ad.company} ${ad.model}`}
              className="w-full h-48 object-cover"
            />
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

              <p className="text-green-600 font-medium text-sm">
               {ad.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllAds;
