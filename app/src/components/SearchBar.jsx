import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Search, X } from "lucide-react-native";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

/** Buscador con forma de píldora, igual al de la barra superior de la web. */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar vinilos, artistas o géneros",
}) {
  return (
    <View style={styles.container}>
      <Search size={18} color={colors.textSoft} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        autoCorrect={false}
        returnKeyType="search"
      />

      {!!value && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={10}
          accessibilityLabel="Limpiar búsqueda"
        >
          <X size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    paddingVertical: 2,
  },
});
