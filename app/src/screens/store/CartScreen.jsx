import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CreditCard, ShoppingCart } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import RequireAuth from "../../components/RequireAuth";
import CartItemCard from "../../components/CartItemCard";
import CustomTextInput from "../../components/CustomTextInput";
import PrimaryButton from "../../components/PrimaryButton";
import GhostButton from "../../components/GhostButton";
import SummaryRow from "../../components/SummaryRow";
import EmptyState from "../../components/EmptyState";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";
import { colors, fonts, fontSizes, radius, spacing } from "../../theme";

/** Cupones de descuento aceptados por la tienda. */
const COUPONS = {
  GOOSE10: 0.1,
  VINILO20: 0.2,
};

/** Carrito de compras: productos, cupones y resumen del pedido. */
export default function CartScreen({ navigation }) {
  const { items, subtotal, totalCount } = useCart();

  const [coupon, setCoupon] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  const applyCoupon = () => {
    const rate = COUPONS[coupon.trim().toUpperCase()];

    if (rate) {
      setDiscountRate(rate);
      setCouponMessage(`Cupón aplicado: ${rate * 100}% de descuento`);
      return;
    }

    setDiscountRate(0);
    setCouponMessage("El cupón ingresado no es válido");
  };

  const goToCheckout = () =>
    navigation.navigate("Checkout", { discountRate });

  const renderSummary = () => (
    <View style={styles.summary}>
      <Text style={styles.summaryTitle}>Resumen del Pedido</Text>

      <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
      <SummaryRow label="Descuento" value={`-${formatPrice(discount)}`} />
      <SummaryRow label="Envío" value="Gratis" accent={colors.success} />

      <View style={styles.divider} />

      <SummaryRow
        label="Total (IVA incluido)"
        value={formatPrice(total)}
        highlight
      />

      <View style={styles.couponRow}>
        <View style={styles.couponInput}>
          <CustomTextInput
            placeholder="Ingresa tu cupón"
            value={coupon}
            onChangeText={setCoupon}
            autoCapitalize="characters"
          />
        </View>

        <GhostButton title="Aplicar" onPress={applyCoupon} />
      </View>

      {!!couponMessage && (
        <Text
          style={[
            styles.couponMessage,
            discountRate ? styles.couponOk : styles.couponBad,
          ]}
        >
          {couponMessage}
        </Text>
      )}

      <PrimaryButton
        title="Finalizar Compra"
        onPress={goToCheckout}
        icon={<CreditCard size={18} color={colors.textPrimary} />}
        style={styles.checkoutButton}
      />

      <Text style={styles.paymentNote}>VISA · Mastercard · PayPal</Text>
    </View>
  );

  return (
    <RequireAuth
      navigation={navigation}
      title="Carrito"
      message="Necesitas una cuenta para guardar tu carrito y comprar vinilos."
    >
      <ScreenContainer edges={[]}>
        <AppHeader
          title="Carrito"
          subtitle={`${totalCount} ${
            totalCount === 1 ? "artículo" : "artículos"
          }`}
        />

        <FlatList
          data={items}
          keyExtractor={(item) => item.vinylId}
          renderItem={({ item }) => <CartItemCard item={item} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={items.length > 0 ? renderSummary : null}
          ListEmptyComponent={
            <EmptyState
              icon={<ShoppingCart size={48} color={colors.textMuted} />}
              title="Tu carrito está vacío"
              message="Explora el catálogo y agrega tus vinilos favoritos."
              actionLabel="Explorar vinilos"
              onAction={() => navigation.navigate("Home")}
            />
          }
        />
      </ScreenContainer>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
  summary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: 2,
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.md,
    marginBottom: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  couponRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  couponInput: {
    flex: 1,
  },
  couponMessage: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  couponOk: {
    color: colors.success,
  },
  couponBad: {
    color: colors.danger,
  },
  checkoutButton: {
    marginTop: spacing.md,
  },
  paymentNote: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
