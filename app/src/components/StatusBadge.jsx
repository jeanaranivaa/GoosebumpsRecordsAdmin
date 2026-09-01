import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, radius, statusColors } from "../theme";

/** Etiquetas en español de los estados que maneja el backend. */
export const ORDER_STATUS_LABELS = {
  pending: "Pendiente",
  processing: "En proceso",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

/** Distintivo de color según el estado de una orden. */
export default function StatusBadge({ status }) {
  const color = statusColors[status] || colors.textMuted;

  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />

      <Text style={[styles.label, { color }]}>
        {ORDER_STATUS_LABELS[status] || status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.xs,
  },
});
