import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MapPin, XCircle } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import VinylCover from "../../components/VinylCover";
import StatusBadge from "../../components/StatusBadge";
import SummaryRow from "../../components/SummaryRow";
import GhostButton from "../../components/GhostButton";
import { useCancelOrder } from "../../hooks/orders/useCancelOrder";
import { useFeedback } from "../../context/FeedbackContext";
import {
  formatDate,
  formatOrderCode,
  formatPrice,
  getErrorMessage,
} from "../../utils/format";
import { colors, fonts, fontSizes, radius, spacing } from "../../theme";

/** Detalle de un pedido, con la opción de cancelarlo mientras esté pendiente. */
export default function OrderDetailScreen({ navigation, route }) {
  const [order, setOrder] = useState(route.params.order);

  const { cancelOrder, loading } = useCancelOrder();
  const { showToast } = useFeedback();

  const canBeCancelled = order.status === "pending";

  const handleCancelOrder = async () => {
    if (loading) return;

    try {
      const data = await cancelOrder(order._id);

      setOrder((previous) => ({
        ...previous,
        status: data.order?.status || "cancelled",
      }));

      showToast({
        type: "info",
        title: "Pedido cancelado",
        message: `El pedido ${formatOrderCode(order._id)} fue cancelado`,
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "No se pudo cancelar",
        message: getErrorMessage(error),
      });
    }
  };

  return (
    <ScreenContainer edges={[]}>
      <AppHeader
        title={`Pedido ${formatOrderCode(order._id)}`}
        subtitle={formatDate(order.orderDate || order.createdAt)}
        onBack={navigation.goBack}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Estado del pedido</Text>
          <StatusBadge status={order.status} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Productos</Text>

          {order.products.map((product, index) => (
            <View key={`${order._id}-${index}`} style={styles.product}>
              <View style={styles.cover}>
                <VinylCover
                  src={product.vinylId?.coverUrl}
                  alt={product.title}
                  placeholderSize={22}
                />
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={1}>
                  {product.title}
                </Text>

                <Text style={styles.productArtist} numberOfLines={1}>
                  {product.vinylId?.artist || "Artista no disponible"}
                </Text>
              </View>

              <View style={styles.productPrices}>
                <Text style={styles.productQuantity}>
                  {product.quantity} x {formatPrice(product.price)}
                </Text>

                <Text style={styles.productSubtotal}>
                  {formatPrice(product.subtotal)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Envío</Text>

          <View style={styles.addressRow}>
            <MapPin size={18} color={colors.purpleLight} />
            <Text style={styles.address}>{order.shippingAddress}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <SummaryRow
            label="Artículos"
            value={String(order.products.length)}
          />

          <SummaryRow
            label="Fecha"
            value={formatDate(order.orderDate || order.createdAt)}
          />

          <View style={styles.divider} />

          <SummaryRow label="Total" value={formatPrice(order.total)} highlight />
        </View>

        {canBeCancelled && (
          <GhostButton
            title={loading ? "Cancelando..." : "Cancelar pedido"}
            onPress={handleCancelOrder}
            disabled={loading}
            icon={<XCircle size={18} color={colors.danger} />}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  statusLabel: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.base,
  },
  product: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  cover: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    overflow: "hidden",
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
  },
  productArtist: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
  productPrices: {
    alignItems: "flex-end",
  },
  productQuantity: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
  },
  productSubtotal: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
    marginTop: 2,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  address: {
    flex: 1,
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
