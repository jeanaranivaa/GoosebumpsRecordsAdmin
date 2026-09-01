import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { colors } from "../theme";

/**
 * Contenedor base de todas las pantallas: fondo oscuro de la marca
 * y respeto por las áreas seguras del dispositivo.
 */
export default function ScreenContainer({ children, edges = ["top"], style }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <StatusBar style="light" />
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
