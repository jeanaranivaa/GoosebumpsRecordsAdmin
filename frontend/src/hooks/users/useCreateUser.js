import { useState, useCallback } from "react";
import apiClient from "../../api/apiClient";

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createUser = useCallback(async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post("/users", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUser, loading, error };
};