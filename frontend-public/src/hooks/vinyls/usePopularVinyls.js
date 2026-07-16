import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";

export const usePopularVinyls = (limit = 6) => {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPopular = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get("/vinyls/popular", {
        params: { limit },
      });

      setPopular(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  return { popular, loading, error, refetch: fetchPopular };
};
