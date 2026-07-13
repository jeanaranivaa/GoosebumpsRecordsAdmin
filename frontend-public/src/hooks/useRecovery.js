import { useState, useCallback } from "react";
import apiClient from "../api/apiClient";

// Flujo de recuperación de contraseña para clientes
export const useRecovery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendCode = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post("/customer-recovery/send-code", {
        email,
      });
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyCode = useCallback(async (email, code) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post("/customer-recovery/verify-code", {
        email,
        code,
      });
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.put("/customer-recovery/change-password", {
        email,
        password,
      });
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendCode, verifyCode, changePassword, loading, error };
};
