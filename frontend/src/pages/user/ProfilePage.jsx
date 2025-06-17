import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import profile from "../../assets/images/other/profile.avif";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";

const ProfilePage = () => {
  const { userInfo, loadingUser } = useUser();

  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    phone: "",
  });

  const [editableFields, setEditableFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    location: false,
    phone: false,
  });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        location:
          userInfo.location?.state ||
          userInfo.location?.district ||
          userInfo.location?.pin
            ? `${userInfo.location?.district || ""}, ${userInfo.location?.state || ""} - ${userInfo.location?.pin || ""}`
            : "",
      });

      if (userInfo.profilePic) {
        setProfileImage(userInfo.profilePic);
      }
    }
  }, [userInfo]);

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

  if (loadingUser) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <img
            src={profileImage || profile}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <FiEdit size={16} />
          </label>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-800">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-gray-500">{formData.email}</p>

          {/* Navigation Buttons */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              to="/wishlist"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 text-sm font-medium"
            >
              Wishlist
            </Link>
            <Link
              to="/your-ads"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 text-sm font-medium"
            >
              Your Ads
            </Link>
            <Link
              to="/sell"
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 text-sm font-medium"
            >
              Sell Your Car
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white mt-8 p-6 rounded-xl shadow space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
          Edit Profile Info
        </h3>

        {/* Name Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["firstName", "lastName"].map((field) => (
            <div key={field} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === "firstName" ? "First Name" : "Last Name"}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                disabled={!editableFields[field]}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 text-sm ${
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
        </div>

        {/* Other Inputs */}
        {["email", "location", "phone"].map((field) => (
          <div key={field} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field}
            </label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              disabled={!editableFields[field]}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 text-sm ${
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

        {/* Reset Password */}
        <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
