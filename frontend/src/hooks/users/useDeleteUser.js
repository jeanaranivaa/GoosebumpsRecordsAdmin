import { useState, useCallback } from "react";
import apiClient from "../../api/apiClient";

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.delete(`/users/${id}`);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteUser, loading, error };
};