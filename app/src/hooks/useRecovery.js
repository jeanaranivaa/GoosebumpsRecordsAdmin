import { useState, useCallback } from "react";
import apiClient from "../api/apiClient";

/** Flujo de recuperación de contraseña para clientes (tabla RecoveryCodes). */
export const useRecovery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (callback) => {
    setLoading(true);
    setError(null);

    try {
      const res = await callback();
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendCode = useCallback(
    (email) =>
      request(() =>
        apiClient.post("/customer-recovery/send-code", {
          email: email.trim().toLowerCase(),
        })
      ),
    [request]
  );

  const verifyCode = useCallback(
    (email, code) =>
      request(() =>
        apiClient.post("/customer-recovery/verify-code", { email, code })
      ),
    [request]
  );

  const changePassword = useCallback(
    (email, password) =>
      request(() =>
        apiClient.put("/customer-recovery/change-password", {
          email,
          password,
        })
      ),
    [request]
  );

  return { sendCode, verifyCode, changePassword, loading, error };
};
