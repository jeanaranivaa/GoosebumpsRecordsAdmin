import { useState } from "react";
import { StyleSheet } from "react-native";
import { Lock } from "lucide-react-native";
import AuthCard from "../../components/AuthCard";
import CustomTextInput from "../../components/CustomTextInput";
import PrimaryButton from "../../components/PrimaryButton";
import { useRecovery } from "../../hooks/useRecovery";
import { useFeedback } from "../../context/FeedbackContext";
import { isValidPassword } from "../../utils/validators";
import { getErrorMessage } from "../../utils/format";
import { colors, spacing } from "../../theme";

/** Último paso de la recuperación: se define la nueva contraseña. */
export default function NewPasswordScreen({ navigation, route }) {
  const { email } = route.params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { changePassword, loading } = useRecovery();
  const { showToast } = useFeedback();

  const handleChangePassword = async () => {
    if (loading) return;

    const validationErrors = {};

    if (!isValidPassword(password)) {
      validationErrors.password =
        "La contraseña debe tener al menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await changePassword(email, password);

      showToast({
        type: "success",
        title: "Contraseña actualizada",
        message: "Inicia sesión con tu nueva contraseña",
      });

      navigation.popToTop();
    } catch (err) {
      setErrors({
        password: getErrorMessage(err, "Error al actualizar la contraseña"),
      });
    }
  };

  return (
    <AuthCard
      title="Nueva contraseña"
      subtitle="Crea una contraseña nueva para tu cuenta."
    >
      <CustomTextInput
        label="Nueva contraseña"
        placeholder="Mínimo 6 caracteres"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
        autoCapitalize="none"
      />

      <CustomTextInput
        label="Confirmar contraseña"
        placeholder="Repite tu contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <PrimaryButton
        title="Actualizar"
        onPress={handleChangePassword}
        loading={loading}
        icon={<Lock size={18} color={colors.textPrimary} />}
        style={styles.submit}
      />
    </AuthCard>
  );
}

const styles = StyleSheet.create({
  submit: {
    marginTop: spacing.xs,
  },
});
