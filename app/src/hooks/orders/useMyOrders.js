import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";

/** Historial de pedidos del cliente autenticado (tabla Orders). */
export const useMyOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get(`/orders/user/${user.id}`);
      setOrders(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
};
