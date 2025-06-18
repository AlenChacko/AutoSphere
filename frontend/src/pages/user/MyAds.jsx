import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const MyAds = () => {
  const { getMyUsedCars } = useUser();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      const res = await getMyUsedCars();
      if (res.success) {
        setAds(res.data);
      }
      setLoading(false);
    };

    fetchAds();
  }, []);

  if (loading)
    return <div className="text-center mt-10">Loading your ads...</div>;

  if (ads.length === 0)
    return (
      <div className="text-center mt-10 text-gray-500">
        You haven't posted any ads yet.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">My Ads</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <div
            key={ad._id}
            onClick={() => navigate(`/view-ad/${ad._id}`)}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition"
          >
            <img
              src={ad.images?.[0]?.url}
              alt={`${ad.company} ${ad.model}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {ad.company} {ad.model} ({ad.year})
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAds;
