/* eslint-disable react/prop-types -- Route wrappers accept React children. */
import { Loading } from "../components/ui/Ui";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading label="Checking your account…" />;
  }
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
