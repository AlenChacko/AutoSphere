import React from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Dashboard Content */}
      <main className="flex-1 p-10 bg-gray-50">
        <div className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, Admin 👋
        </div>
        <p className="text-lg text-gray-600">
          Use the sidebar to manage cars, banners, test drives, and more.
        </p>
      </main>
    </div>
  );
};

export default AdminDashboard;
