import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { colors, fonts, fontSizes, spacing } from "../theme";

/**
 * Título de sección con la segunda mitad resaltada en rosa, como en la web
 * ("Vinilos <span>Más Populares</span>").
 */
export default function SectionHeader({
  title,
  highlight,
  actionLabel,
  onAction,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
        {!!highlight && <Text style={styles.highlight}> {highlight}</Text>}
      </Text>

      {!!actionLabel && (
        <Pressable
          onPress={onAction}
          hitSlop={8}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
          <ArrowRight size={16} color={colors.textSoft} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.lg,
  },
  highlight: {
    color: colors.primary,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pressed: {
    opacity: 0.6,
  },
  actionLabel: {
    color: colors.textSoft,
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
  },
});
