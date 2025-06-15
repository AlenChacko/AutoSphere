// context/AdminContext.jsx
import { createContext, useContext, useState } from "react";
import axios from "axios";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState([]);
  const [admin, setAdmin] = useState(
    () => JSON.parse(localStorage.getItem("admin")) || null
  );

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  const addCar = async (formDataObj) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append basic fields
      formData.append("company", formDataObj.company);
      formData.append("model", formDataObj.model);
      formData.append("priceStart", formDataObj.price.start);
      formData.append("priceFinal", formDataObj.price.final);
      formData.append("body", formDataObj.body);
      formData.append("descriptions", formDataObj.descriptions);
      formData.append("spec", JSON.stringify(formDataObj.spec)); // ✅ object

      // ✅ Stringify arrays before appending
      formData.append("colors", JSON.stringify(formDataObj.colors));
      formData.append("fuelOptions", JSON.stringify(formDataObj.fuelOptions));
      formData.append("driveTrains", JSON.stringify(formDataObj.driveTrains));
      formData.append(
        "transmissions",
        JSON.stringify(formDataObj.transmissions)
      );

      // Append files
      if (formDataObj.logo) {
        formData.append("logo", formDataObj.logo);
      }
      formDataObj.images.forEach((img) => formData.append("images", img));

      // Auth header
      const storedAdmin = JSON.parse(localStorage.getItem("admin"));
      const token = storedAdmin?.token;
      if (!token) throw new Error("Admin is not authenticated");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/add-cars`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCars((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error("Add car error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      const storedAdmin = JSON.parse(localStorage.getItem("admin"));
      const token = storedAdmin?.token;
      if (!token) throw new Error("Admin is not authenticated");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/cars`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCars(res.data);
    } catch (err) {
      console.error("Fetch cars error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (carId) => {
    try {
      setLoading(true);

      const admin = JSON.parse(localStorage.getItem("admin")); // ✅ parse the stored admin object
      const token = admin?.token;

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/delete-car/${carId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCars((prev) => prev.filter((car) => car._id !== carId));
    } catch (err) {
      console.error("Delete car error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        loginAdmin,
        logoutAdmin,
        addCar,
        fetchCars,
        deleteCar,
        loading,
        cars,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
