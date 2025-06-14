import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Auth from "./pages/user/Auth";
import Home from "./pages/user/Home";
import Cars from "./pages/user/Cars";
import CarDetails from "./pages/user/CarDetails";
import ProfilePage from "./pages/user/ProfilePage";
import WishlistPage from "./pages/user/WishlistPage";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddCars from "./pages/admin/AddCars";
import ListCars from "./pages/admin/ListCars";

import MainLayout from "./layouts/MainLayout";
import PlainLayout from "./layouts/PlainLayout";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} />

      <Routes>
        {/* Main UI Routes (with Navbar and Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/brands/:brand" element={<Cars />} />
          <Route path="/car/:brand/:model" element={<CarDetails />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>

        {/* Auth Route (no Navbar/Footer) */}
        <Route element={<PlainLayout />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        {/* Admin Routes (no Navbar/Footer) */}
        <Route element={<PlainLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-car" element={<AddCars />} />
          <Route path="/admin/list-cars" element={<ListCars />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
