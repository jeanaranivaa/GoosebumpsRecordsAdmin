import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { KeyRound } from "lucide-react-native";
import AuthCard from "../../components/AuthCard";
import CodeInput from "../../components/CodeInput";
import PrimaryButton from "../../components/PrimaryButton";
import { useRecovery } from "../../hooks/useRecovery";
import { getErrorMessage } from "../../utils/format";
import { colors, fonts, fontSizes, spacing } from "../../theme";

const EMPTY_CODE = ["", "", "", ""];

/** Segundo paso de la recuperación: validación del código recibido. */
export default function VerifyCodeScreen({ navigation, route }) {
  const { email } = route.params;

  const [code, setCode] = useState(EMPTY_CODE);
  const [error, setError] = useState("");

  const { verifyCode, loading } = useRecovery();

  const isCodeComplete = code.every((digit) => digit !== "");

  const handleVerifyCode = async () => {
    if (loading) return;

    if (!isCodeComplete) {
      setError("Ingresa los 4 dígitos del código");
      return;
    }

    try {
      setError("");
      await verifyCode(email, code.join(""));

      navigation.navigate("NewPassword", { email });
    } catch (err) {
      setError(getErrorMessage(err, "Código incorrecto"));
    }
  };

  return (
    <AuthCard
      title="Ingresa el código"
      subtitle={`Te enviamos un código de 4 dígitos a ${email}.`}
      footer={
        <Pressable onPress={navigation.goBack} hitSlop={8} style={styles.back}>
          <Text style={styles.backText}>¿No lo recibiste? Reenviar</Text>
        </Pressable>
      }
    >
      <CodeInput code={code} onChangeCode={setCode} hasError={!!error} />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <PrimaryButton
        title="Verificar"
        onPress={handleVerifyCode}
        loading={loading}
        disabled={!isCodeComplete}
        icon={<KeyRound size={18} color={colors.textPrimary} />}
      />
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
