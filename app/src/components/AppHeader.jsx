import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { colors, fonts, fontSizes, gradients, spacing } from "../theme";

/**
 * Cabecera con el degradado del topbar del sitio web. Muestra un botón
 * de regreso cuando la pantalla no forma parte del menú principal.
 */
export default function AppHeader({
  title,
  subtitle,
  onBack,
  rightSlot = null,
}) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={gradients.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
    >
      <View style={styles.row}>
        {!!onBack && (
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.backButton}
            accessibilityLabel="Volver"
          >
            <ArrowLeft size={22} color={colors.textPrimary} />
          </Pressable>
        )}

        <View style={styles.titles}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          {!!subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightSlot}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 44,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  titles: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.lg,
  },
  subtitle: {
    color: colors.textSoft,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    marginTop: 2,
  },
});
