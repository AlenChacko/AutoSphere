import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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
    console.log(res.data);
    setUserInfo(res.data);
  } catch (err) {
    console.error("Failed to fetch user info", err);
  } finally {
    setLoadingUser(false);
  }
};

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        cars,
        popularCars,
        loadingCars,
        errorCars,
        userInfo,
        loadingUser,
        fetchUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
