import { Pressable, StyleSheet, Text, View } from "react-native";
import { Trash2 } from "lucide-react-native";
import VinylCover from "./VinylCover";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

/** Fila de un producto dentro del carrito de compras. */
export default function CartItemCard({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <View style={styles.card}>
      <View style={styles.cover}>
        <VinylCover
          src={item.coverUrl}
          alt={item.title}
          placeholderSize={26}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>

        <Text style={styles.artist} numberOfLines={1}>
          {item.artist}
        </Text>

        <QuantitySelector
          size="sm"
          quantity={item.quantity}
          max={item.stock || 99}
          onDecrease={() => updateQuantity(item.vinylId, item.quantity - 1)}
          onIncrease={() => updateQuantity(item.vinylId, item.quantity + 1)}
        />
      </View>

      <View style={styles.side}>
        <Pressable
          onPress={() => removeItem(item.vinylId)}
          hitSlop={10}
          accessibilityLabel={`Eliminar ${item.title} del carrito`}
        >
          <Trash2 size={18} color={colors.danger} />
        </Pressable>

        <Text style={styles.price}>
          {formatPrice(item.price * item.quantity)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.sm,
  },
  cover: {
    width: 76,
    height: 76,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
  },
  artist: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    marginBottom: 4,
  },
  side: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  price: {
    color: colors.primary,
    fontFamily: fonts.black,
    fontSize: fontSizes.base,
  },
});
