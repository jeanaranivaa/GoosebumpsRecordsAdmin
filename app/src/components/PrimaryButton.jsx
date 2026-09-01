import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, fontSizes, gradients, radius, spacing } from "../theme";

/**
 * Botón principal de la marca (degradado rosa), equivalente al
 * ".home-btn-primary" del sitio web.
 */
export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon = null,
  style,
}) {
  const isBlocked = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isBlocked}
      style={({ pressed }) => [
        styles.pressable,
        pressed && !isBlocked && styles.pressed,
        style,
      ]}
    >
      <LinearGradient
        colors={isBlocked ? [colors.disabled, colors.disabled] : gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={colors.textPrimary} size="small" />
        ) : (
          <>
            {icon}
            <Text style={styles.title}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.base,
  },
});
