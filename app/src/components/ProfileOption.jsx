import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

/** Fila de opción del perfil (editar datos, pedidos, cerrar sesión...). */
export default function ProfileOption({
  icon,
  label,
  description,
  onPress,
  destructive = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.option, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.iconWrapper,
          destructive && styles.iconWrapperDestructive,
        ]}
      >
        {icon}
      </View>

      <View style={styles.texts}>
        <Text style={[styles.label, destructive && styles.labelDestructive]}>
          {label}
        </Text>

        {!!description && (
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>
        )}
      </View>

      <ChevronRight
        size={18}
        color={destructive ? colors.danger : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  pressed: {
    backgroundColor: "rgba(236, 72, 153, 0.08)",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: "rgba(139, 92, 246, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapperDestructive: {
    backgroundColor: "rgba(248, 113, 113, 0.16)",
  },
  texts: {
    flex: 1,
  },
  label: {
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
  },
  labelDestructive: {
    color: colors.danger,
  },
  description: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
});
