import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BookTestdrive = () => {
  const { carId } = useParams();
  const { userInfo, bookTestDrive } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: {
      state: "",
      district: "",
      pin: "",
    },
    preferredDate: "", // ✅ fixed field name
  });

  // ✅ Prefill with userInfo
  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        location: {
          state: userInfo.location?.state || "",
          district: userInfo.location?.district || "",
          pin: userInfo.location?.pin || "",
        },
      }));
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["state", "district", "pin"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, phone, location, preferredDate } = formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !location.state ||
      !location.district ||
      !location.pin ||
      !preferredDate
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await bookTestDrive(carId, formData);
    if (result.success) {
      toast.success("Booking successful! We will contact you soon.");

      // Reset form with user info
      setFormData({
        firstName: userInfo?.firstName || "",
        lastName: userInfo?.lastName || "",
        email: userInfo?.email || "",
        phone: userInfo?.phone || "",
        location: {
          state: userInfo?.location?.state || "",
          district: userInfo?.location?.district || "",
          pin: userInfo?.location?.pin || "",
        },
        preferredDate: "",
      });

      setTimeout(() => {
        navigate("/test-drives");
      }, 1200);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-2xl bg-white p-8 shadow-xl rounded-2xl border border-blue-100">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          🚗 Book a Test Drive
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.location.state}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input
                type="text"
                name="district"
                required
                value={formData.location.district}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                PIN
              </label>
              <input
                type="number"
                name="pin"
                required
                value={formData.location.pin}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preferred Date
            </label>
            <input
              type="date"
              name="preferredDate"
              required
              value={formData.preferredDate}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Book Test Drive
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookTestdrive;
