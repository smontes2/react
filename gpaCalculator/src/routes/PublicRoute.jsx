/* eslint-disable react/prop-types -- Route wrappers accept React children. */
import { Loading } from "../components/ui/Ui";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading label="Checking your account…" />;
  }
  
  return user ? <Navigate to="/classes" /> : children;
};

export default PublicRoute; 