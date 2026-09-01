import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenContainer from "./ScreenContainer";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

/**
 * Tarjeta centrada con resplandor morado, el mismo tratamiento visual de
 * las pantallas de verificación y recuperación del sitio web.
 */
export default function AuthCard({ title, subtitle, children, footer }) {
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
          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>

            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

            {children}
          </View>

          {footer}
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
  card: {
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.purple,
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.xl,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    textAlign: "center",
    lineHeight: 21,
    marginTop: -spacing.xs,
  },
});
