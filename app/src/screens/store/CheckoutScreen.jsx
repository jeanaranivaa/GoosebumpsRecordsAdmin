import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Banknote, CreditCard, Landmark } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import CustomTextInput from "../../components/CustomTextInput";
import PrimaryButton from "../../components/PrimaryButton";
import SummaryRow from "../../components/SummaryRow";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useFeedback } from "../../context/FeedbackContext";
import { useCreateOrder } from "../../hooks/orders/useCreateOrder";
import { useCreatePayment } from "../../hooks/payments/useCreatePayment";
import { validateCheckoutForm } from "../../utils/validators";
import { formatPrice, getErrorMessage } from "../../utils/format";
import { colors, fonts, fontSizes, radius, spacing } from "../../theme";

/** Métodos de pago aceptados, con los valores que espera el backend. */
const PAYMENT_METHODS = [
  { value: "card", label: "Tarjeta de crédito/débito", icon: CreditCard },
  { value: "transfer", label: "Transferencia bancaria", icon: Landmark },
  { value: "cash", label: "Contra entrega (efectivo)", icon: Banknote },
];

/** Confirmación de la compra: dirección, método de pago y registro del pedido. */
export default function CheckoutScreen({ navigation, route }) {
  const discountRate = route.params?.discountRate || 0;

  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { showToast } = useFeedback();
  const { createOrder, loading: creatingOrder } = useCreateOrder();
  const { createPayment } = useCreatePayment();

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});

  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  const handleConfirmOrder = async () => {
    if (creatingOrder) return;

    const validationErrors = validateCheckoutForm({ shippingAddress });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const products = items.map((item) => ({
        vinylId: item.vinylId,
        quantity: item.quantity,
      }));

      const data = await createOrder({
        userId: user.id,
        products,
        shippingAddress: shippingAddress.trim(),
      });

      // El pago queda registrado junto a la orden recién creada
      await createPayment({
        orderId: data.order._id,
        userId: user.id,
        paymentMethod,
        amount: data.order.total,
      });

      clearCart();

      showToast({
        type: "success",
        title: "¡Compra realizada!",
        message: "Tu pedido fue registrado correctamente",
      });

      navigation.navigate("MainTabs", { screen: "MyOrders" });
    } catch (error) {
      showToast({
        type: "error",
        title: "No se pudo completar la compra",
        message: getErrorMessage(error, "Intenta de nuevo"),
      });
    }
  };

  return (
    <ScreenContainer edges={[]}>
      <AppHeader
        title="Finalizar Compra"
        subtitle="Revisa tus datos y confirma el pedido"
        onBack={navigation.goBack}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CustomTextInput
            label="Nombre"
            value={user?.fullName || ""}
            editable={false}
          />

          <CustomTextInput
            label="Correo"
            value={user?.email || ""}
            editable={false}
          />

          <CustomTextInput
            label="Dirección de envío"
            placeholder="Calle, número, ciudad, referencia..."
            value={shippingAddress}
            onChangeText={setShippingAddress}
            error={errors.shippingAddress}
            multiline
            maxLength={150}
          />

          <View style={styles.methods}>
            <Text style={styles.methodsLabel}>Método de pago</Text>

            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.value;

              return (
                <Pressable
                  key={method.value}
                  onPress={() => setPaymentMethod(method.value)}
                  style={[styles.method, isSelected && styles.methodSelected]}
                >
                  <Icon
                    size={20}
                    color={isSelected ? colors.primary : colors.textMuted}
                  />

                  <Text
                    style={[
                      styles.methodLabel,
                      isSelected && styles.methodLabelSelected,
                    ]}
                  >
                    {method.label}
                  </Text>

                  <View
                    style={[styles.radio, isSelected && styles.radioSelected]}
                  />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.summary}>
            <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />

            {discountRate > 0 && (
              <SummaryRow
                label={`Descuento (${discountRate * 100}%)`}
                value={`-${formatPrice(discount)}`}
              />
            )}

            <SummaryRow label="Envío" value="Gratis" accent={colors.success} />

            <View style={styles.divider} />

            <SummaryRow label="Total a pagar" value={formatPrice(total)} highlight />
          </View>

          <PrimaryButton
            title="Confirmar Pedido"
            onPress={handleConfirmOrder}
            loading={creatingOrder}
            disabled={items.length === 0}
            icon={<CreditCard size={18} color={colors.textPrimary} />}
          />

          <Text style={styles.note}>
            El total se calcula en el servidor con los precios vigentes de cada
            vinilo.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  methods: {
    gap: spacing.xs,
  },
  methodsLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
    marginBottom: 4,
  },
  method: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  methodSelected: {
    borderColor: colors.primary,
    backgroundColor: "rgba(236, 72, 153, 0.08)",
  },
  methodLabel: {
    flex: 1,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
  },
  methodLabelSelected: {
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  summary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  note: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    textAlign: "center",
  },
});
