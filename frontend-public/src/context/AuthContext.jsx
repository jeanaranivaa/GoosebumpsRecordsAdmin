import { createContext, useContext, useState, useCallback } from "react";
import apiClient from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const persistSession = useCallback((token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await apiClient.post("/customers/login", {
        email,
        password,
      });

      persistSession(res.data.token, res.data.user);
      return res.data;
    },
    [persistSession]
  );

  // El registro ya no inicia sesión: la cuenta debe confirmarse por correo
  const register = useCallback(async ({ fullName, email, password }) => {
    const res = await apiClient.post("/customers/register", {
      fullName,
      email,
      password,
    });

    return res.data;
  }, []);

  const verifyAccount = useCallback(
    async (email, code) => {
      const res = await apiClient.post("/customers/verify-account", {
        email,
        code,
      });

      persistSession(res.data.token, res.data.user);
      return res.data;
    },
    [persistSession]
  );

  const resendVerification = useCallback(async (email) => {
    const res = await apiClient.post("/customers/resend-verification", {
      email,
    });

    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        verifyAccount,
        resendVerification,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
