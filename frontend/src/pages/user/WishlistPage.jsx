import React, { useState } from "react";

const WishlistPage = () => {
  // Mock data (replace this with actual wishlist from context or backend)
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Kia Seltos",
      image: "/images/kia/seltos1.avif", // adjust to actual image path
    },
    {
      id: 2,
      name: "Maruti Fronx",
      image: "/images/suzuki/fronx1.avif",
    },
    {
      id: 3,
      name: "Hyundai Creta",
      image: "/images/hyundai/creta1.avif",
    },
  ]);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-6">
          {wishlist.map((car) => (
            <div
              key={car.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <span className="text-lg font-medium">{car.name}</span>
              </div>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => alert(`Deal initiated for ${car.name}`)}
                >
                  Make a Deal
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => handleRemove(car.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
