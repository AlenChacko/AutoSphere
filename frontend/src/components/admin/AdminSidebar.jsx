import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCar,
  FaSignOutAlt,
  FaTools,
  FaHome,
  FaEdit,
  FaImage,
  FaClipboardList,
  FaPlus,
} from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Add Cars", icon: <FaPlus />, path: "/admin/add-car" },
    { label: "Edit Cars", icon: <FaEdit />, path: "/admin/edit-car" },
    { label: "List Cars", icon: <FaCar />, path: "/admin/list-cars" }, // ✅ New Tab
    { label: "Edit Banners", icon: <FaImage />, path: "/admin/edit-banner" },
    {
      label: "Test Drive Info",
      icon: <FaClipboardList />,
      path: "/admin/test-drives",
    },
    { label: "Others", icon: <FaTools />, path: "/admin/others" },
    { label: "Logout", icon: <FaSignOutAlt />, path: "/admin/logout" },
  ];

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      <Link
        to={"/admin/dashboard"}
        className="p-6 text-2xl font-bold text-center border-b border-gray-700"
      >
        AutoSphere
      </Link>
      <nav className="flex-1 px-4 py-6 space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
