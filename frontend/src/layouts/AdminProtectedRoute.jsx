// src/routes/AdminProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

const AdminProtectedRoute = ({ children }) => {
  const { admin } = useAdmin();

  if (!admin?.token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
