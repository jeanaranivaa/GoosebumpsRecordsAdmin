import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../theme";

/** Fila etiqueta/valor del resumen de pedido y del checkout. */
export default function SummaryRow({ label, value, highlight = false, accent }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, highlight && styles.labelHighlight]}>
        {label}
      </Text>

      <Text
        style={[
          styles.value,
          highlight && styles.valueHighlight,
          !!accent && { color: accent },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingVertical: 6,
  },
  label: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
  },
  labelHighlight: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.base,
  },
  value: {
    color: colors.textSecondary,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
  },
  valueHighlight: {
    color: colors.primary,
    fontFamily: fonts.black,
    fontSize: fontSizes.md,
  },
});
