import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCar,
  FaSignOutAlt,
  FaTools,
  FaEdit,
  FaImage,
  FaClipboardList,
  FaPlus,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AdminSidebar = () => {
  const location = useLocation();
  const { logoutAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const activeClass = "bg-blue-600 text-white";
  const defaultClass = "hover:bg-gray-700";

  const getLinkClasses = (path) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
      location.pathname === path ? activeClass : defaultClass
    }`;

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      <Link
        to="/admin/dashboard"
        className="p-6 text-2xl font-bold text-center border-b border-gray-700"
      >
        AutoSphere
      </Link>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link to="/admin/add-car" className={getLinkClasses("/admin/add-car")}>
          <FaPlus />
          <span>Add Cars</span>
        </Link>

        <Link
          to="/admin/edit-car"
          className={getLinkClasses("/admin/edit-car")}
        >
          <FaEdit />
          <span>Edit Cars</span>
        </Link>

        <Link
          to="/admin/list-cars"
          className={getLinkClasses("/admin/list-cars")}
        >
          <FaCar />
          <span>List Cars</span>
        </Link>

        <Link
          to="/admin/edit-banner"
          className={getLinkClasses("/admin/edit-banner")}
        >
          <FaImage />
          <span>Edit Banners</span>
        </Link>

        <Link
          to="/admin/test-drives"
          className={getLinkClasses("/admin/test-drives")}
        >
          <FaClipboardList />
          <span>Test Drive Info</span>
        </Link>

        <Link to="/admin/others" className={getLinkClasses("/admin/others")}>
          <FaTools />
          <span>Others</span>
        </Link>

        <Link
          to="/admin/logout"
          className={`${getLinkClasses(
            "/admin/logout"
          )} text-red-400 hover:text-white`}
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
