import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const { getWishlist } = useUser();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await getWishlist();
      if (res.success) setWishlist(res.data);
      setLoading(false);
    };

    fetchWishlist();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading wishlist...</div>;

  if (!wishlist.length)
    return <div className="text-center mt-10 text-gray-500">No saved ads yet.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((car) => (
          <div
            key={car._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 cursor-pointer"
            onClick={() => navigate(`/view-ad/${car._id}`)}
          >
            <div className="relative">
              <img
                src={car.images?.[0]?.url}
                alt={car.model}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {/* ✅ Status tag */}
              <span
                className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full text-white ${
                  car.status === "sold"
                    ? "bg-red-500"
                    : car.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-green-600"
                }`}
              >
                {car.status || "available"}
              </span>
            </div>

            <div className="p-4 space-y-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {car.company} {car.model} ({car.year})
              </h3>
              <p className="text-indigo-600 font-bold text-sm">
                ₹ {car.price?.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-gray-600">
                {car.place}, {car.district}, {car.state}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
