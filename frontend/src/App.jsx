import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import VinylsPage from "./pages/VinylsPage";
import ArtistsPage from "./pages/ArtistsPage";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PasswordRecoveryPage from "./pages/PasswordRecoveryPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import NewPasswordPage from "./pages/NewPasswordPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/recovery" element={<PasswordRecoveryPage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
        <Route path="/newPassword" element={<NewPasswordPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vinyls" element={<VinylsPage />} />
        <Route path="/artists" element={<ArtistsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/users" element={<UsersPage />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}