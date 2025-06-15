import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAdmin } from "../../context/AdminContext";
import { toast } from "react-toastify";

const ListCars = () => {
  const { cars, fetchCars, loading, deleteCar } = useAdmin();

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this car?");
    if (!confirm) return;

    try {
      await deleteCar(id);
      toast.success("Car deleted successfully");
    } catch (err) {
      toast.error("Failed to delete car");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">All Cars</h1>

        {loading ? (
          <p className="text-gray-600">Loading cars...</p>
        ) : cars.length === 0 ? (
          <p className="text-gray-600">No cars available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center text-center"
              >
                <img
                  src={car.imageUrls?.[0]}
                  alt={`${car.company} ${car.model}`}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  {car.company} {car.model}
                </h2>

                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/admin/view-car/${car._id}`}
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    View
                  </Link>
                  <Link
                    to={`/admin/edit-car/${car._id}`}
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ListCars;
