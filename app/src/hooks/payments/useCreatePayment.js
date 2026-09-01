import { useState, useCallback } from "react";
import apiClient from "../../api/apiClient";

/** Registra el pago de una orden confirmada (INSERT en la tabla Payments). */
export const useCreatePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPayment = useCallback(
    async ({ orderId, userId, paymentMethod, amount }) => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.post("/payments", {
          orderId,
          userId,
          paymentMethod,
          amount,
          status: paymentMethod === "cash" ? "pending" : "paid",
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

  return { createPayment, loading, error };
};
