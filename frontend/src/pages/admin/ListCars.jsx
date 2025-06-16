import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAdmin } from "../../context/AdminContext";
import { toast } from "react-toastify";

const ListCars = () => {
  const { cars, fetchCars, loading, deleteCar } = useAdmin();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Get unique companies with logos
  const uniqueCompanies = cars.reduce((acc, car) => {
    const exists = acc.find((c) => c.company === car.company);
    if (!exists) {
      acc.push({ company: car.company, logo: car.logo?.url });
    }
    return acc;
  }, []);

  // Filter and sort cars by selected company and search term
  let filteredCars = [];
  if (selectedCompany) {
    filteredCars = cars
      .filter(
        (car) =>
          car.company === selectedCompany &&
          car.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "low-high") return a.price.start - b.price.start;
        if (sortOrder === "high-low") return b.price.start - a.price.start;
        return 0;
      });
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {selectedCompany ? `Cars from ${selectedCompany}` : "Select a Company"}
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : selectedCompany ? (
          <>
            {/* Header row: Back button | Search bar | Sort dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => {
                  setSelectedCompany(null);
                  setSortOrder("default");
                  setSearchTerm("");
                }}
              >
                ⬅ Back to Company List
              </button>

              {/* Search Bar */}
              <div className="w-full sm:w-1/2 px-4">
                <input
                  type="text"
                  placeholder="Search by model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border rounded text-sm shadow-sm"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center">
                <label className="mr-2 font-medium text-gray-700">Sort by Price:</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="default">Default</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Car Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center text-center"
                >
                  <img
                    src={car.images?.[0]?.url || "/fallback-car.jpg"}
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
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {uniqueCompanies.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedCompany(item.company)}
                className="cursor-pointer bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-lg transition"
              >
                <img
                  src={item.logo || "/fallback-logo.jpg"}
                  alt={item.company}
                  className="w-20 h-20 object-contain mb-2"
                />
                <p className="text-gray-800 font-medium">{item.company}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ListCars;
