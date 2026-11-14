import { Navigate } from "react-router-dom";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = getStoredUser();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.userType !== role) return <Navigate to="/" replace />;
  return children;
}