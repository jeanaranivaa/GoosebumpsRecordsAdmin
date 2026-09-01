import { useState, useCallback } from "react";
import apiClient from "../../api/apiClient";

/** Crea una orden a partir del carrito (INSERT en la tabla Orders). */
export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(
    async ({ userId, products, shippingAddress }) => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.post("/orders", {
          userId,
          products,
          shippingAddress,
        });

        return res.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createOrder, loading, error };
};
