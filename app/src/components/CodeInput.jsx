import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, fonts, radius, spacing } from "../theme";

const CODE_LENGTH = 4;

/**
 * Campo de código de 4 dígitos (confirmación de cuenta y recuperación).
 * El foco avanza y retrocede automáticamente al escribir o borrar.
 */
export default function CodeInput({ code, onChangeCode, hasError = false }) {
  const inputRefs = useRef([]);

  const handleChangeDigit = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const nextCode = [...code];
    nextCode[index] = value;
    onChangeCode(nextCode);

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, event) => {
    if (event.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={(element) => (inputRefs.current[index] = element)}
          style={[
            styles.digit,
            !!digit && styles.digitFilled,
            hasError && styles.digitError,
          ]}
          value={digit}
          onChangeText={(value) => handleChangeDigit(index, value)}
          onKeyPress={(event) => handleKeyPress(index, event)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          textAlign="center"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  digit: {
    width: 56,
    height: 62,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: 24,
  },
  digitFilled: {
    borderColor: colors.primary,
  },
  digitError: {
    borderColor: colors.danger,
  },
});
