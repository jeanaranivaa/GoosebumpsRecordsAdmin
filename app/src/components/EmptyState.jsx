import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "./PrimaryButton";
import { colors, fonts, fontSizes, spacing } from "../theme";

/** Mensaje para listas vacías, con una acción opcional. */
export default function EmptyState({
  icon = null,
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <View style={styles.container}>
      {icon}

      <Text style={styles.title}>{title}</Text>

      {!!message && <Text style={styles.message}>{message}</Text>}

      {!!actionLabel && (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.md,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  message: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    textAlign: "center",
    lineHeight: 21,
  },
  action: {
    marginTop: spacing.sm,
  },
});
