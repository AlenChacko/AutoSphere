import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

const CarDetails = () => {
  const { id } = useParams(); // ✅ get id from URL
  const { cars, loadingCars, userInfo } = useUser();
  const navigate = useNavigate();

  const [selectedCar, setSelectedCar] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (cars && cars.length > 0) {
      const match = cars.find((car) => car._id === id); // ✅ match by ID
      setSelectedCar(match);
      if (match?.images?.[0]?.url) {
        setMainImage(match.images[0].url);
      }
    }
  }, [id, cars]);

  if (loadingCars) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  if (!selectedCar) {
    return <div className="text-center mt-10 text-red-600">Car not found.</div>;
  }

  const nextImage = () => {
    if (selectedCar.images && selectedCar.images.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % selectedCar.images.length
      );
    }
  };
  const prevImage = () => {
    if (selectedCar.images && selectedCar.images.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? selectedCar.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleTestDrive = () => {
    if (!userInfo) {
      toast.info("Please login to book a test drive");
      navigate("/auth");
    } else {
      navigate(`/book-testdrive/${selectedCar._id}`);
    }
  };

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        {selectedCar.logo?.url && (
          <img
            src={selectedCar.logo.url}
            alt={`${selectedCar.company} logo`}
            className="w-12 h-12 object-contain"
          />
        )}
        <h2 className="text-4xl font-bold text-gray-800">
          {selectedCar.model}
        </h2>
      </div>

      <p className="text-gray-600 text-lg mb-6">{selectedCar.descriptions}</p>

      {/* Image Carousel */}
      {/* Image Carousel */}
      <div className="relative w-full h-[500px] mb-6 shadow-xl rounded-xl overflow-hidden">
        <img
          src={selectedCar.images?.[currentIndex]?.url || "/fallback-car.jpg"}
          alt={`car-${currentIndex}`}
          className="w-full h-full object-contain"
        />

        {/* Left Arrow */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
        >
          ◀
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
        >
          ▶
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 justify-center mt-2 mb-8">
        {selectedCar.images?.map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={`thumb-${idx}`}
            onClick={() => setCurrentIndex(idx)}
            className={`w-20 h-14 object-cover rounded-md cursor-pointer border-2 ${
              currentIndex === idx ? "border-blue-500" : "border-transparent"
            }`}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Price</h4>
          <p className="text-gray-700">
            ₹ {selectedCar.price.start} – {selectedCar.price.final} Lakh
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Body Type
          </h4>
          <p className="text-gray-700">{selectedCar.body}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Fuel Options
          </h4>
          <p className="text-gray-700">{selectedCar.fuelOptions?.join(", ")}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Drive Trains
          </h4>
          <p className="text-gray-700">{selectedCar.driveTrains?.join(", ")}</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Transmission
          </h4>
          <p className="text-gray-700">
            {selectedCar.transmission?.join(", ")}
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            Available Colors
          </h4>
          <p className="text-gray-700">{selectedCar.colors?.join(", ")}</p>
        </div>
      </div>

      {/* Specs */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-2">
          Specifications
        </h4>
        {selectedCar.spec &&
          Object.entries(selectedCar.spec).map(([fuelType, spec], idx) => (
            <div key={idx} className="mb-2">
              <p className="font-medium">{fuelType.toUpperCase()}:</p>
              <p className="text-gray-700">
                Power: {spec.power} BHP | Torque: {spec.torque} Nm
              </p>
            </div>
          ))}
      </div>

      <button
        onClick={handleTestDrive}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Book a Test Drive
      </button>
    </div>
  );
};

export default CarDetails;
