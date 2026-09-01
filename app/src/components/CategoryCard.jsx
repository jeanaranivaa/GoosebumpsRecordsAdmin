import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, fontSizes, gradients, radius, spacing } from "../theme";

/** Tarjeta de género musical con el mismo juego de degradados de la web. */
export default function CategoryCard({ name, count, index = 0, onPress }) {
  const gradient = gradients.categories[index % gradients.categories.length];

  return (
    <Pressable
      onPress={() => onPress?.(name)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>

          <Text style={styles.count}>
            {count} {count === 1 ? "vinilo" : "vinilos"}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  gradient: {
    height: 120,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 13, 21, 0.28)",
  },
  content: {
    padding: spacing.md,
  },
  name: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.md,
  },
  count: {
    color: "rgba(255, 255, 255, 0.82)",
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    marginTop: 4,
  },
});
