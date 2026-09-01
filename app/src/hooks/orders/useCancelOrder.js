import { useState, useCallback } from "react";
import apiClient from "../../api/apiClient";

/** Cancela un pedido pendiente (UPDATE del estado en la tabla Orders). */
export const useCancelOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.put(`/orders/${orderId}`, {
        status: "cancelled",
      });

      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancelOrder, loading, error };
};
