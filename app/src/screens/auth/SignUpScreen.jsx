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
import { UserPlus } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import CustomTextInput from "../../components/CustomTextInput";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";
import { validateSignUpForm } from "../../utils/validators";
import { getErrorMessage } from "../../utils/format";
import { colors, fonts, fontSizes, spacing } from "../../theme";

/** Registro de clientes. La cuenta queda pendiente de confirmar por correo. */
export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useFeedback();

  const handleSignUp = async () => {
    if (loading) return;

    const validationErrors = validateSignUpForm({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      await register({ fullName, email, password, phone });

      showToast({
        type: "success",
        title: "Cuenta creada",
        message: "Revisa tu correo para confirmarla",
      });

      navigation.navigate("VerifyAccount", {
        email: email.trim().toLowerCase(),
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "No se pudo crear la cuenta",
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer edges={[]}>
      <AppHeader
        title="Regístrate"
        subtitle="Ingresa tu información para iniciar"
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
            label="Nombre completo"
            placeholder="Ingresa tu nombre"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
            autoCapitalize="words"
          />

          <CustomTextInput
            label="Correo"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomTextInput
            label="Teléfono (opcional)"
            placeholder="Ej. 7777-8888"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <CustomTextInput
            label="Contraseña"
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
            title="Crear Cuenta"
            onPress={handleSignUp}
            loading={loading}
            icon={<UserPlus size={18} color={colors.textPrimary} />}
            style={styles.submit}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>

            <Pressable onPress={navigation.goBack} hitSlop={8}>
              <Text style={styles.footerLink}>Iniciar sesión</Text>
            </Pressable>
          </View>
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  submit: {
    marginTop: spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
  },
  footerLink: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
  },
});
