import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center mt-12">
        <h1 className="text-2xl font-medium text-gray-600">Loading...</h1>
      </div>
    );
  }
  
  return user ? <Navigate to="/classes" /> : children;
};

export default PublicRoute; 