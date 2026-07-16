import { Navigate } from "react-router-dom";

// Protege las rutas del panel: sin sesión de admin, redirige al login
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const admin = localStorage.getItem("admin");

  if (!token || !admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
