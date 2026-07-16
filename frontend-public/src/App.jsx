import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import NewPasswordPage from "./pages/NewPasswordPage";

import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Rutas de autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/recovery" element={<PasswordRecoveryPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
        <Route path="/verify-account" element={<VerifyAccountPage />} />
        <Route path="/newPassword" element={<NewPasswordPage />} />

        {/* Tienda pública (navegable) */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />

        {/* Rutas privadas (requieren sesión de cliente) */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}
