import { useState, useCallback } from "react";
import apiClient from "../../api/apiClient";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get(`/users/${id}`);
      setUser(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, getUserById, loading, error };
};