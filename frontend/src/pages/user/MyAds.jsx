import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyAds = () => {
  const { getMyUsedCars, deleteUsedCar, markAsSold } = useUser();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null); // for disabling buttons

  useEffect(() => {
    const fetchAds = async () => {
      const res = await getMyUsedCars();
      if (res.success) setAds(res.data);
      setLoading(false);
    };

    fetchAds();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      setProcessingId(id);
      const res = await deleteUsedCar(id);
      if (res.success) {
        toast.success("Ad deleted successfully");
        setAds((prev) => prev.filter((ad) => ad._id !== id));
      } else {
        toast.error(res.message || "Failed to delete ad");
      }
      setProcessingId(null);
    }
  };

  const handleMarkAsSold = async (id) => {
    setProcessingId(id);
    const res = await markAsSold(id);
    if (res.success) {
      toast.success("Ad marked as sold");
      setAds((prev) =>
        prev.map((ad) => (ad._id === id ? { ...ad, status: "sold" } : ad))
      );
    } else {
      toast.error(res.message || "Failed to update status");
    }
    setProcessingId(null);
  };

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
        {ads.map((ad) => {
          const normalizedStatus = ad.status?.toLowerCase().trim();

          return (
            <div
              key={ad._id}
              className="bg-white shadow-md rounded-lg overflow-hidden relative"
            >
              <img
                src={ad.images?.[0]?.url}
                alt={`${ad.company} ${ad.model}`}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => navigate(`/view-ad/${ad._id}`)}
              />

              {/* Status badge */}
              <span
                className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full text-white ${
                  normalizedStatus === "sold"
                    ? "bg-red-600"
                    : normalizedStatus === "pending"
                    ? "bg-yellow-500"
                    : "bg-green-600"
                }`}
              >
                {ad.status?.charAt(0).toUpperCase() + ad.status?.slice(1)}
              </span>

              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {ad.company} {ad.model} ({ad.year})
                </h3>

                <p className="text-indigo-600 font-bold text-base">
                  ₹ {ad.price?.toLocaleString("en-IN")}
                </p>

                <p className="text-sm text-gray-500">
                  {ad.place}, {ad.district}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
                    disabled={processingId === ad._id}
                  >
                    Delete
                  </button>

                  {normalizedStatus === "available" && (
                    <button
                      onClick={() => handleMarkAsSold(ad._id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded disabled:opacity-50"
                      disabled={processingId === ad._id}
                    >
                      Mark as Sold
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAds;
