import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, fonts, fontSizes, spacing } from "../theme";

/** Indicador de carga usado mientras se consultan datos de la API. */
export default function LoadingState({ message = "Cargando..." }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  message: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
  },
});
