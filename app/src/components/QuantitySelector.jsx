import { Pressable, StyleSheet, Text, View } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

/** Selector de cantidad (- valor +) usado en el detalle y en el carrito. */
export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  max = 99,
  size = "md",
}) {
  const isSmall = size === "sm";
  const iconSize = isSmall ? 14 : 16;

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <Pressable
        onPress={onDecrease}
        disabled={quantity <= min}
        hitSlop={6}
        style={[
          styles.button,
          isSmall && styles.buttonSmall,
          quantity <= min && styles.buttonDisabled,
        ]}
        accessibilityLabel="Disminuir cantidad"
      >
        <Minus size={iconSize} color={colors.textPrimary} />
      </Pressable>

      <Text style={[styles.quantity, isSmall && styles.quantitySmall]}>
        {quantity}
      </Text>

      <Pressable
        onPress={onIncrease}
        disabled={quantity >= max}
        hitSlop={6}
        style={[
          styles.button,
          isSmall && styles.buttonSmall,
          quantity >= max && styles.buttonDisabled,
        ]}
        accessibilityLabel="Aumentar cantidad"
      >
        <Plus size={iconSize} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 5,
  },
  containerSmall: {
    gap: 4,
    padding: 3,
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  buttonDisabled: {
    opacity: 0.35,
  },
  quantity: {
    minWidth: 26,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.base,
  },
  quantitySmall: {
    minWidth: 20,
    fontSize: fontSizes.sm,
  },
});
