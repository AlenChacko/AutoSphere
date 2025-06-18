import { useUser } from "../context/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { userInfo, loadingUser } = useUser();

  if (loadingUser) return <div>Loading...</div>;

  return userInfo ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;
