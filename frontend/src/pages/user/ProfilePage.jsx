import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

import profile from '../../assets/images/other/profile.avif'

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    location: "New Delhi",
    phone: "+91 9876543210",
  });

  const [editableFields, setEditableFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    location: false,
    phone: false,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleEdit = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Wishlist Link */}
      <div className="mb-4 text-right">
        <Link
          to="/wishlist"
          className="text-blue-600 hover:underline font-semibold"
        >
          Go to Wishlist →
        </Link>
      </div>

      {/* Profile Image Section */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            profileImage ||
            profile
          }
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover shadow-md"
        />
        <label className="mt-3">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition">
            Edit Image
          </span>
        </label>
      </div>

      {/* Name Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            disabled={!editableFields.firstName}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-3 py-2 ${
              editableFields.firstName
                ? "border-blue-500 focus:ring-2 focus:ring-blue-500"
                : "border-gray-300 bg-gray-100"
            }`}
          />
          <FiEdit
            className="absolute top-9 right-3 text-gray-500 cursor-pointer"
            onClick={() => toggleEdit("firstName")}
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            disabled={!editableFields.lastName}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-3 py-2 ${
              editableFields.lastName
                ? "border-blue-500 focus:ring-2 focus:ring-blue-500"
                : "border-gray-300 bg-gray-100"
            }`}
          />
          <FiEdit
            className="absolute top-9 right-3 text-gray-500 cursor-pointer"
            onClick={() => toggleEdit("lastName")}
          />
        </div>
      </div>

      {/* Additional Inputs */}
      {["email", "location", "phone"].map((field) => (
        <div key={field} className="relative mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
            {field}
          </label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            disabled={!editableFields[field]}
            onChange={handleInputChange}
            className={`w-full border rounded-lg px-3 py-2 ${
              editableFields[field]
                ? "border-blue-500 focus:ring-2 focus:ring-blue-500"
                : "border-gray-300 bg-gray-100"
            }`}
          />
          <FiEdit
            className="absolute top-9 right-3 text-gray-500 cursor-pointer"
            onClick={() => toggleEdit(field)}
          />
        </div>
      ))}

      {/* Reset Password Button */}
      <button className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
        Reset Password
      </button>
    </div>
  );
};

export default ProfilePage;
