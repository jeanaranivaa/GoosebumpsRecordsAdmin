import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../api/apiClient";

const AuthContext = createContext(null);

/**
 * Maneja la sesión del cliente: login, registro, confirmación por correo
 * y cierre de sesión. El token se guarda en AsyncStorage para que la
 * sesión sobreviva al cierre de la aplicación.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Restaura la sesión guardada al abrir la aplicación
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log("No se pudo restaurar la sesión:", error);
      } finally {
        setLoadingSession(false);
      }
    };

    restoreSession();
  }, []);

  const persistSession = useCallback(async (token, userData) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await apiClient.post("/customers/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      await persistSession(res.data.token, res.data.user);
      return res.data;
    },
    [persistSession]
  );

  // El registro no inicia sesión: la cuenta debe confirmarse por correo
  const register = useCallback(async ({ fullName, email, password, phone }) => {
    const res = await apiClient.post("/customers/register", {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone,
    });

    return res.data;
  }, []);

  const verifyAccount = useCallback(
    async (email, code) => {
      const res = await apiClient.post("/customers/verify-account", {
        email,
        code,
      });

      await persistSession(res.data.token, res.data.user);
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

  /** Refresca en memoria los datos del cliente tras editar su perfil. */
  const updateUser = useCallback(async (userData) => {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loadingSession,
        login,
        register,
        verifyAccount,
        resendVerification,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
