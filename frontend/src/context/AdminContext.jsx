import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
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

  return (
    <AdminContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
