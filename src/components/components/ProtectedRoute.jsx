import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated = false, redirectTo = "/login" }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
