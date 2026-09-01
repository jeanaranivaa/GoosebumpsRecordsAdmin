import { useState, useCallback } from "react";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";

/** Lectura y actualización del perfil del cliente (tabla Users). */
export const useProfile = () => {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return null;

    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get(`/users/${user.id}`);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const saveProfile = useCallback(
    async ({ fullName, email, phone }) => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.put(`/users/${user.id}`, {
          fullName,
          email,
          phone,
        });

        // Se refresca la sesión para que el menú muestre los datos nuevos
        await updateUser({
          ...user,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone,
        });

        return res.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [user, updateUser]
  );

  return { fetchProfile, saveProfile, loading, error };
};
