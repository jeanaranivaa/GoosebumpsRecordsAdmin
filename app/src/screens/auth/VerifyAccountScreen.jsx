import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { ShieldCheck } from "lucide-react-native";
import AuthCard from "../../components/AuthCard";
import CodeInput from "../../components/CodeInput";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";
import { getErrorMessage } from "../../utils/format";
import { colors, fonts, fontSizes, spacing } from "../../theme";

const EMPTY_CODE = ["", "", "", ""];

/** Confirmación de la cuenta con el código de 4 dígitos enviado por correo. */
export default function VerifyAccountScreen({ navigation, route }) {
  const { email } = route.params;

  const [code, setCode] = useState(EMPTY_CODE);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { verifyAccount, resendVerification } = useAuth();
  const { showToast } = useFeedback();

  const isCodeComplete = code.every((digit) => digit !== "");

  const handleVerify = async () => {
    if (loading) return;

    if (!isCodeComplete) {
      setError("Ingresa los 4 dígitos del código");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await verifyAccount(email, code.join(""));

      showToast({
        type: "success",
        title: "¡Cuenta confirmada!",
        message: "Ya puedes comprar en Goosebumps Records",
      });

      navigation.getParent()?.goBack();
    } catch (err) {
      setError(getErrorMessage(err, "Código incorrecto"));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setError("");
      await resendVerification(email);

      showToast({
        type: "info",
        title: "Código reenviado",
        message: "Revisa tu bandeja de entrada",
      });
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo reenviar el código"));
    }
  };

  return (
    <AuthCard
      title="Confirma tu cuenta"
      subtitle={`Te enviamos un código de 4 dígitos a ${email}.`}
      footer={
        <Pressable onPress={navigation.goBack} hitSlop={8} style={styles.back}>
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
      }
    >
      <CodeInput code={code} onChangeCode={setCode} hasError={!!error} />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <PrimaryButton
        title="Confirmar Cuenta"
        onPress={handleVerify}
        loading={loading}
        disabled={!isCodeComplete}
        icon={<ShieldCheck size={18} color={colors.textPrimary} />}
      />

      <Pressable onPress={handleResendCode} hitSlop={8}>
        <Text style={styles.resend}>Reenviar código</Text>
      </Pressable>
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  error: {
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    textAlign: "center",
  },
  resend: {
    color: colors.purpleLight,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
    textAlign: "center",
  },
  back: {
    marginTop: spacing.lg,
  },
  backText: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    textAlign: "center",
  },
});
