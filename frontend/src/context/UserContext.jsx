import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [errorCars, setErrorCars] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [filteredCars, setFilteredCars] = useState([]);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/cars`
        );
        const allCars = Array.isArray(res.data?.cars)
          ? res.data.cars
          : res.data;

        setCars(allCars);
      } catch (err) {
        setErrorCars("Failed to fetch cars");
        setCars([]);
      } finally {
        setLoadingCars(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    if (cars.length > 0) {
      setFilteredCars(cars);
    }
  }, [cars]);

  const searchCars = (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      setFilteredCars(cars); // reset to all cars
      return;
    }

    const term = searchTerm.toLowerCase();
    const result = cars.filter(
      (car) =>
        car.model.toLowerCase().includes(term) ||
        car.company.toLowerCase().includes(term) ||
        (car?.title && car.title.toLowerCase().includes(term))
    );
    setFilteredCars(result);
  };

  // Safely filter popular cars
  const popularCars = cars.filter(
    (car) => car?.price?.start >= 5 && car?.price?.start <= 15
  );

  const fetchUserInfo = async () => {
    try {
      setLoadingUser(true);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserInfo(res.data);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchUserInfo();
    } else {
      setLoadingUser(false); // stop loading state if no user
    }
  }, [user]);

  const updateUserProfile = async (formDataObj) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token;

      if (!token) throw new Error("No token");

      const formData = new FormData();

      // Append fields
      for (const key in formDataObj) {
        if (key === "location") {
          for (const locKey in formDataObj.location) {
            formData.append(locKey, formDataObj.location[locKey]);
          }
        } else if (
          key === "profilePic" &&
          formDataObj.profilePic instanceof File
        ) {
          formData.append("profilePic", formDataObj.profilePic);
        } else {
          formData.append(key, formDataObj[key]);
        }
      }

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchUserInfo(); // Refresh updated data
      return { success: true };
    } catch (err) {
      console.error("Profile update failed", err);
      return {
        success: false,
        message: err.response?.data?.message || "Update failed",
      };
    }
  };

  const bookTestDrive = async (carId, formData) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/book/testdrive`,
        {
          car: carId,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        success: true,
        message: res.data?.message || "Booking successful!",
      };
    } catch (err) {
      console.error("Test drive booking failed", err);
      return {
        success: false,
        message: err.response?.data?.message || "Booking failed",
      };
    }
  };

  const getUserTestDrives = async () => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/testdrives`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("📦 Test Drives:", res.data);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Failed to fetch test drives:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch test drives",
      };
    }
  };

 const addUsedCar = async (formData) => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) throw new Error("User not authenticated");

    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/add-used-car`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    
    return data;
  } catch (error) {
    console.error("❌ Error adding used car:", error.response?.data || error);
    toast.error(
      error.response?.data?.message ||
        "Failed to list your car. Please try again."
    );
    throw error;
  }
};

const getMyUsedCars = async () => {
  try {
    const token = user?.token;
    if (!token) throw new Error("User not authenticated");

    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/my-used-cars`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data)

    return { success: true, data: res.data };
  } catch (err) {
    console.error("Failed to fetch my ads:", err);
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch your ads",
    };
  }
};

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        cars,
        filteredCars,
        popularCars,
        loadingCars,
        errorCars,
        userInfo,
        loadingUser,
        fetchUserInfo,
        updateUserProfile,
        bookTestDrive,
        getUserTestDrives,
        searchCars,
        addUsedCar,
        getMyUsedCars,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
