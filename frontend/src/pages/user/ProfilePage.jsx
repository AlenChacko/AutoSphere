import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import profile from "../../assets/images/other/profile.avif";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { userInfo, loadingUser, updateUserProfile } = useUser();

 

  const [profileImage, setProfileImage] = useState(null);
  const [profileFile, setProfileFile] = useState(null); // To store actual file for upload
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: {
      state: "",
      district: "",
      pin: "",
    },
    phone: "",
  });

  const [editableFields, setEditableFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    location: {
      state: false,
      district: false,
      pin: false,
    },
    phone: false,
  });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        location: {
          state: userInfo.location?.state || "",
          district: userInfo.location?.district || "",
          pin: userInfo.location?.pin || "",
        },
      });

      if (userInfo.profilePic) {
        setProfileImage(userInfo.profilePic);
      }
    }
  }, [userInfo]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const toggleEdit = (field) => {
    if (field.startsWith("location.")) {
      const key = field.split(".")[1];
      setEditableFields((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [key]: !prev.location[key],
        },
      }));
    } else {
      setEditableFields((prev) => ({
        ...prev,
        [field]: !prev[field],
      }));
    }
  };

  const handleProfileUpdate = async () => {
    const formPayload = {
      ...formData,
      profilePic: profileFile || null,
    };

    const result = await updateUserProfile(formPayload);

    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(result.message || "Profile update failed");
    }
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
            <Link
              to="/test-drives"
              className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-blue-700 text-sm font-medium"
            >
              Your Bookings
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

        {/* Email and Phone Inputs */}
        {["email", "phone"].map((field) => (
          <div key={field} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {field}
            </label>
            <input
              type={field === "email" ? "email" : "number"}
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

        {/* Location Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["state", "district", "pin"].map((field) => (
            <div key={field} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field}
              </label>
              <input
                type={field === "pin" ? "number" : "text"}
                name={`location.${field}`}
                value={formData.location[field]}
                disabled={!editableFields.location[field]}
                onChange={handleInputChange}
                className={`w-full border rounded-lg px-4 py-2 text-sm ${
                  editableFields.location[field]
                    ? "border-blue-500 focus:ring-2 focus:ring-blue-500"
                    : "border-gray-300 bg-gray-100"
                }`}
              />
              <FiEdit
                className="absolute top-9 right-3 text-gray-500 cursor-pointer"
                onClick={() => toggleEdit(`location.${field}`)}
              />
            </div>
          ))}
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleProfileUpdate}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
        </button>

        {/* Reset Password */}
        <button className="w-full mt-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
