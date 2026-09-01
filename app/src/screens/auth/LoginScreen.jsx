import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LogIn } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import CustomTextInput from "../../components/CustomTextInput";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";
import { validateLoginForm } from "../../utils/validators";
import { getErrorMessage } from "../../utils/format";
import { colors, fonts, fontSizes, spacing } from "../../theme";
import vinylImage from "../../../assets/vinyl1.png";

/** Inicio de sesión de clientes registrados en la base de datos. */
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useFeedback();

  const handleLogin = async () => {
    if (loading) return;

    const validationErrors = validateLoginForm({ email, password });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);

      const data = await login(email, password);

      showToast({
        type: "success",
        title: "¡Bienvenido de nuevo!",
        message: data.user?.fullName,
      });

      navigation.getParent()?.goBack();
    } catch (error) {
      // Cuenta creada pero sin confirmar: se envía al flujo de verificación
      if (error.response?.data?.needsVerification) {
        navigation.navigate("VerifyAccount", {
          email: error.response.data.email,
        });
        return;
      }

      showToast({
        type: "error",
        title: "No se pudo iniciar sesión",
        message: getErrorMessage(error, "Revisa tus credenciales"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image source={vinylImage} style={styles.vinyl} resizeMode="contain" />

          <Text style={styles.title}>¡Bienvenido!</Text>
          <Text style={styles.subtitle}>
            Listo para el primer track del día.
          </Text>

          <View style={styles.form}>
            <CustomTextInput
              label="Correo"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <CustomTextInput
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry
              autoCapitalize="none"
            />

            <Pressable
              onPress={() => navigation.navigate("PasswordRecovery")}
              hitSlop={8}
              style={styles.forgotWrapper}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <PrimaryButton
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              icon={<LogIn size={18} color={colors.textPrimary} />}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>

            <Pressable onPress={() => navigation.navigate("SignUp")} hitSlop={8}>
              <Text style={styles.footerLink}>Registrarse</Text>
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
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  vinyl: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.xxl,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  forgotWrapper: {
    alignSelf: "flex-end",
    marginTop: -spacing.xs,
  },
  forgotText: {
    color: colors.purpleLight,
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
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
