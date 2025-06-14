import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState([]);


  const [admin, setAdmin] = useState(() =>
    JSON.parse(localStorage.getItem("admin")) || null
  );

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

   const addCar = async (formDataObject) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("company", formDataObject.company);
      formData.append("model", formDataObject.model);
      formData.append("priceStart", formDataObject.price.start);
      formData.append("priceFinal", formDataObject.price.final);
      formData.append("body", formDataObject.body);
      formData.append("descriptions", formDataObject.descriptions);

      formDataObject.colors.forEach((color) => formData.append("colors", color));
      formDataObject.fuelOptions.forEach((fuel) => formData.append("fuelOptions", fuel));
      formDataObject.driveTrains.forEach((d) => formData.append("driveTrains", d));
      formDataObject.transmission.forEach((t) => formData.append("transmission", t));

      formData.append("logo", formDataObject.logo);
      formDataObject.images.forEach((img) => formData.append("images", img));

      formData.append("spec", JSON.stringify(formDataObject.spec));

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/add-cars`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Optionally update local list
      setCars((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error("Add car error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin,addCar, loading, cars  }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
