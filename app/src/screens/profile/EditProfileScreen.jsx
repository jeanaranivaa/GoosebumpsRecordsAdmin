import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { Save } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import CustomTextInput from "../../components/CustomTextInput";
import PrimaryButton from "../../components/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";
import { useProfile } from "../../hooks/users/useProfile";
import { validateProfileForm } from "../../utils/validators";
import { getErrorMessage } from "../../utils/format";
import { colors, fonts, fontSizes, spacing } from "../../theme";

/** Actualización de los datos del cliente (UPDATE en la tabla Users). */
export default function EditProfileScreen({ navigation }) {
  const { user } = useAuth();
  const { saveProfile, loading } = useProfile();
  const { showToast } = useFeedback();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [errors, setErrors] = useState({});

  const handleSaveProfile = async () => {
    if (loading) return;

    const validationErrors = validateProfileForm({ fullName, email, phone });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      await saveProfile({ fullName, email, phone });

      showToast({
        type: "success",
        title: "Datos actualizados",
        message: "Tu perfil se guardó correctamente",
      });

      navigation.goBack();
    } catch (error) {
      showToast({
        type: "error",
        title: "No se pudo actualizar",
        message: getErrorMessage(error),
      });
    }
  };

  return (
    <ScreenContainer edges={[]}>
      <AppHeader
        title="Editar mis datos"
        subtitle="Actualiza tu información de contacto"
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
            label="Teléfono"
            placeholder="Ej. 7777-8888"
            value={phone}
            onChangeText={setPhone}
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <PrimaryButton
            title="Guardar cambios"
            onPress={handleSaveProfile}
            loading={loading}
            icon={<Save size={18} color={colors.textPrimary} />}
            style={styles.submit}
          />

          <Text style={styles.note}>
            Tu contraseña se cambia desde la opción de recuperación en el inicio
            de sesión.
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
  submit: {
    marginTop: spacing.xs,
  },
  note: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    textAlign: "center",
  },
});
