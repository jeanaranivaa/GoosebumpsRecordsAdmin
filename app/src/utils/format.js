/** Formatea un número como precio en dólares. */
export const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`;

/** Formatea una fecha ISO al formato largo usado en la tienda. */
export const formatDate = (date) => {
  if (!date) return "Sin fecha";

  return new Date(date).toLocaleDateString("es-SV", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/** Devuelve un identificador corto y legible para una orden. */
export const formatOrderCode = (orderId) =>
  `#${String(orderId || "").slice(-6).toUpperCase()}`;

/** Extrae el mensaje de error que envía el backend. */
export const getErrorMessage = (error, fallback = "Ocurrió un error inesperado") =>
  error?.response?.data?.message || fallback;
