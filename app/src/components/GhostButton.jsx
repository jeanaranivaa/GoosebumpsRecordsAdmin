import { Pressable, StyleSheet, Text } from "react-native";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

/**
 * Botón secundario translúcido, equivalente al ".home-btn-ghost" del sitio web.
 */
export default function GhostButton({
  title,
  onPress,
  icon = null,
  disabled = false,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingVertical: 13,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
  },
});
