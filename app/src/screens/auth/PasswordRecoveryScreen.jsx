import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Mail } from "lucide-react-native";
import AuthCard from "../../components/AuthCard";
import CustomTextInput from "../../components/CustomTextInput";
import PrimaryButton from "../../components/PrimaryButton";
import { useRecovery } from "../../hooks/useRecovery";
import { useFeedback } from "../../context/FeedbackContext";
import { isValidEmail } from "../../utils/validators";
import { getErrorMessage } from "../../utils/format";
import { colors, fonts, fontSizes, spacing } from "../../theme";

/** Primer paso de la recuperación: se envía el código al correo del cliente. */
export default function PasswordRecoveryScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { sendCode, loading } = useRecovery();
  const { showToast } = useFeedback();

  const handleSendCode = async () => {
    if (loading) return;

    if (!email.trim()) {
      setError("El correo es obligatorio");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Ingresa un correo válido");
      return;
    }

    try {
      setError("");
      await sendCode(email);

      showToast({
        type: "info",
        title: "Código enviado",
        message: "Revisa tu correo electrónico",
      });

      navigation.navigate("VerifyCode", {
        email: email.trim().toLowerCase(),
      });
    } catch (err) {
      setError(getErrorMessage(err, "Error al enviar el código"));
    }
  };

  return (
    <AuthCard
      title="Recuperar Contraseña"
      subtitle="Ingresa tu correo para enviarte el código de verificación."
      footer={
        <Pressable onPress={navigation.goBack} hitSlop={8} style={styles.back}>
          <Text style={styles.backText}>Volver al inicio de sesión</Text>
        </Pressable>
      }
    >
      <CustomTextInput
        label="Correo electrónico"
        placeholder="Ingresa tu correo"
        value={email}
        onChangeText={setEmail}
        error={error}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <PrimaryButton
        title="Enviar Código"
        onPress={handleSendCode}
        loading={loading}
        icon={<Mail size={18} color={colors.textPrimary} />}
      />
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  back: {
    marginTop: spacing.lg,
  },
  backText: {
    color: colors.purpleLight,
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    textAlign: "center",
  },
});
