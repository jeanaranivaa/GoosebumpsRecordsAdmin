import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";

/** Catálogo completo de vinilos (tabla Vinyls). */
export const useVinyls = () => {
  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVinyls = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get("/vinyls");
      setVinyls(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVinyls();
  }, [fetchVinyls]);

  return { vinyls, loading, error, refetch: fetchVinyls };
};
