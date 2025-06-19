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
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

      return { success: true, data: res.data };
    } catch (err) {
      console.error("Failed to fetch my ads:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to fetch your ads",
      };
    }
  };

  const getAllUsedCars = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/used-cars`
      );

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Failed to fetch all used cars:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch used cars",
      };
    }
  };

  const getUsedCarById = async (id) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/used-car/${id}`
      );

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching used car:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error fetching used car",
      };
    }
  };

  const updateUsedCar = async (id, updatedData) => {
    const token = user?.token;

    const res = await axios({
      method: "put",
      url: `${import.meta.env.VITE_BACKEND_URL}/api/user/update/used-car/${id}`,
      data: updatedData,
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT manually set Content-Type
      },
      withCredentials: true, // optional, if you're using cookies
    });

    return res.data;
  };

  const saveToWishlist = async (carId) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/wishlist/${carId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Ad saved to your wishlist.");
      await fetchUserInfo(); // Refresh updated wishlist
    } catch (err) {
      console.error("Failed to save to wishlist", err);
      toast.error("Failed to save ad.");
    }
  };

  const removeFromWishlist = async (carId) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/wishlist/${carId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.info("Ad removed from wishlist.");
      await fetchUserInfo(); // Refresh updated wishlist
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
      toast.error("Failed to remove ad.");
    }
  };

  const isInWishlist = (carId) => {
    return userInfo?.wishlist?.includes(carId);
  };

  const getWishlist = async () => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, data: res.data };
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load wishlist",
      };
    }
  };

  const markAsSold = async (carId) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/mark-sold/${carId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, message: res.data?.message || "Marked as sold" };
    } catch (err) {
      console.error("Failed to mark as sold:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to mark as sold",
      };
    }
  };

  const createConversation = async (sellerId, adId) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/start`,
        { sellerId, adId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data; // contains conversation._id
    } catch (error) {
      console.error("❌ Error creating conversation:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed",
      };
    }
  };

  const getConversationById = async (conversationId) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/chat/conversations/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { success: true, data: res.data.conversation };
    } catch (error) {
      console.error("❌ Failed to fetch conversation:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch chat",
      };
    }
  };

  const getMessages = async (conversationId) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/chat/message/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, data: res.data.messages };
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load messages",
      };
    }
  };

  const sendMessage = async (conversationId, text, image = null) => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/message`,
        {
          conversationId, // ✅ should be a string only
          text,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, data: res.data.message };
    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send message",
      };
    }
  };

  const getUserConversations = async () => {
    try {
      const token = user?.token;
      if (!token) throw new Error("User not authenticated");

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`, // ✅ Ensure this endpoint includes unread logic
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setConversations(res.data.conversations); // ✅ You must have this state in context
        setUnreadCount(res.data.unreadTotal); // ✅ Store unread count
      }

      return res.data;
    } catch (error) {
      console.error("❌ Failed to fetch user conversations:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to load inbox",
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
        getAllUsedCars,
        getUsedCarById,
        updateUsedCar,
        saveToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlist,
        markAsSold,
        createConversation,
        getConversationById,
        getMessages,
        sendMessage,
        getUserConversations,
        conversations,
        unreadCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
