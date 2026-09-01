/**
 * Paleta de Goosebumps Records.
 * Los valores son los mismos que usa el frontend web (tienda pública),
 * para que la app móvil y la web se vean como un solo producto.
 */
export const colors = {
  // Fondos
  background: "#0c0d15",
  surface: "#14162a",
  surfaceAlt: "#0f1020",
  sidebar: "#1a2143",
  sidebarTop: "#26305a",
  topbarStart: "#232a55",
  topbarEnd: "#2c2c63",

  // Marca
  primary: "#ec4899",
  primaryDark: "#d6336c",
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  purpleSoft: "#c084fc",

  // Texto
  textPrimary: "#ffffff",
  textSecondary: "#d4d7ee",
  textMuted: "#9aa0c8",
  textSoft: "#b9bde0",
  textOnSidebar: "#e7e9f7",
  textPlaceholder: "#7b80a8",

  // Bordes y estados
  border: "rgba(255, 255, 255, 0.08)",
  borderStrong: "rgba(255, 255, 255, 0.18)",
  overlay: "rgba(6, 6, 12, 0.82)",
  success: "#34d399",
  danger: "#f87171",
  warning: "#fbbf24",
  info: "#60a5fa",
  disabled: "#4a4a66",
};

/** Degradados reutilizables (expo-linear-gradient recibe arreglos de color). */
export const gradients = {
  primary: [colors.primary, colors.primaryDark],
  header: [colors.topbarStart, colors.topbarEnd],
  hero: ["rgba(12, 13, 21, 0.92)", "rgba(20, 16, 45, 0.75)", "rgba(139, 92, 246, 0.35)"],
  splash: ["#0c0d15", "#1a1030", "#0c0d15"],
  categories: [
    ["#7c3aed", "#db2777"],
    ["#2563eb", "#7c3aed"],
    ["#d97706", "#dc2626"],
    ["#0891b2", "#7c3aed"],
    ["#db2777", "#f59e0b"],
    ["#4f46e5", "#06b6d4"],
  ],
};

/** Colores por estado de una orden, iguales a los del panel web. */
export const statusColors = {
  pending: colors.warning,
  processing: colors.info,
  shipped: colors.purpleLight,
  delivered: colors.success,
  cancelled: colors.danger,
};
