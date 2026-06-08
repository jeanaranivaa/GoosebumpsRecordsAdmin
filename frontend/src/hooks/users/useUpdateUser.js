import { useState, useCallback } from "react";
import apiClient from "../../api/apiClient";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateUser = useCallback(async (id, formData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.put(`/users/${id}`, formData, {
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

  return { updateUser, loading, error };
};