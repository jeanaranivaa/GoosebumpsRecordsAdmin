import { Pressable, StyleSheet, Text, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import VinylCover from "./VinylCover";
import { useCart } from "../context/CartContext";
import { useFeedback } from "../context/FeedbackContext";
import { formatPrice } from "../utils/format";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

/** Tarjeta de vinilo del catálogo, con botón rápido para agregar al carrito. */
export default function VinylCard({ vinyl, onPress, style }) {
  const { addItem } = useCart();
  const { showToast } = useFeedback();

  const isSoldOut = vinyl.status === "Agotado" || vinyl.stock === 0;

  const handleAddToCart = () => {
    if (isSoldOut) return;

    addItem(vinyl, 1);

    showToast({
      type: "success",
      title: "Agregado al carrito",
      message: vinyl.title,
    });
  };

  return (
    <Pressable
      onPress={() => onPress?.(vinyl)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
    >
      <View style={styles.cover}>
        <VinylCover src={vinyl.coverUrl} alt={vinyl.title} />

        {isSoldOut && (
          <View style={styles.soldOutBadge}>
            <Text style={styles.soldOutText}>Agotado</Text>
          </View>
        )}

        <Pressable
          onPress={handleAddToCart}
          disabled={isSoldOut}
          hitSlop={6}
          style={[styles.addButton, isSoldOut && styles.addButtonDisabled]}
          accessibilityLabel="Agregar al carrito"
        >
          <ShoppingCart size={16} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {vinyl.title}
        </Text>

        <Text style={styles.artist} numberOfLines={1}>
          {vinyl.artist}
        </Text>

        <Text style={styles.price}>{formatPrice(vinyl.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  pressed: {
    borderColor: "rgba(236, 72, 153, 0.4)",
    transform: [{ scale: 0.98 }],
  },
  cover: {
    aspectRatio: 1,
    backgroundColor: colors.surfaceAlt,
  },
  soldOutBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  soldOutText: {
    color: "#ff8fab",
    fontFamily: fonts.bold,
    fontSize: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  body: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
    marginBottom: 2,
  },
  artist: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    marginBottom: 8,
  },
  price: {
    color: colors.primary,
    fontFamily: fonts.black,
    fontSize: fontSizes.base,
  },
});
