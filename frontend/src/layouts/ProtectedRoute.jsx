// layouts/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = () => {
  const { user, loadingUser } = useUser();

  if (loadingUser) return <p className="p-4">Loading...</p>;

  return user?.token ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
