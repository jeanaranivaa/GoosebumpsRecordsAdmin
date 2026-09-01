import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

/**
 * Campo de texto reutilizable con etiqueta, mensaje de error y
 * botón para mostrar u ocultar contraseñas.
 */
export default function CustomTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  multiline = false,
  editable = true,
  ...inputProps
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible((previous) => !previous);

  return (
    <View style={styles.field}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
          !editable && styles.inputWrapperDisabled,
          multiline && styles.inputWrapperMultiline,
        ]}
      >
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...inputProps}
        />

        {secureTextEntry && (
          <Pressable
            onPress={togglePasswordVisibility}
            hitSlop={10}
            accessibilityLabel={
              isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {isPasswordVisible ? (
              <Eye size={20} color={colors.textMuted} />
            ) : (
              <EyeOff size={20} color={colors.textMuted} />
            )}
          </Pressable>
        )}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: "100%",
  },
  label: {
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
  },
  inputWrapperError: {
    borderColor: colors.danger,
  },
  inputWrapperDisabled: {
    opacity: 0.6,
  },
  inputWrapperMultiline: {
    alignItems: "flex-start",
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    paddingVertical: 13,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: "top",
    paddingVertical: 4,
  },
  error: {
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    marginTop: 6,
  },
});
