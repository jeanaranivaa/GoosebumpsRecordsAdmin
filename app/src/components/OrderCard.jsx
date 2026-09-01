import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import VinylCover from "./VinylCover";
import StatusBadge from "./StatusBadge";
import { formatDate, formatOrderCode, formatPrice } from "../utils/format";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

const MAX_VISIBLE_COVERS = 3;

/** Resumen de un pedido dentro del historial del cliente. */
export default function OrderCard({ order, onPress }) {
  const visibleProducts = order.products.slice(0, MAX_VISIBLE_COVERS);
  const hiddenCount = order.products.length - visibleProducts.length;

  return (
    <Pressable
      onPress={() => onPress?.(order)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.code}>Pedido {formatOrderCode(order._id)}</Text>
          <Text style={styles.date}>
            {formatDate(order.orderDate || order.createdAt)}
          </Text>
        </View>

        <StatusBadge status={order.status} />
      </View>

      <View style={styles.covers}>
        {visibleProducts.map((product, index) => (
          <View key={`${order._id}-${index}`} style={styles.cover}>
            <VinylCover
              src={product.vinylId?.coverUrl}
              alt={product.title}
              placeholderSize={20}
            />
          </View>
        ))}

        {hiddenCount > 0 && (
          <View style={[styles.cover, styles.moreCover]}>
            <Text style={styles.moreText}>+{hiddenCount}</Text>
          </View>
        )}

        <View style={styles.summary}>
          <Text style={styles.itemCount}>
            {order.products.length}{" "}
            {order.products.length === 1 ? "artículo" : "artículos"}
          </Text>
          <Text style={styles.total}>{formatPrice(order.total)}</Text>
        </View>

        <ChevronRight size={20} color={colors.textMuted} />
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
    padding: spacing.md,
    gap: spacing.md,
  },
  pressed: {
    borderColor: "rgba(236, 72, 153, 0.4)",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  code: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.base,
  },
  date: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  covers: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  moreCover: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt,
  },
  moreText: {
    color: colors.textSoft,
    fontFamily: fonts.bold,
    fontSize: fontSizes.xs,
  },
  summary: {
    flex: 1,
    alignItems: "flex-end",
  },
  itemCount: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
  },
  total: {
    color: colors.primary,
    fontFamily: fonts.black,
    fontSize: fontSizes.md,
  },
});
