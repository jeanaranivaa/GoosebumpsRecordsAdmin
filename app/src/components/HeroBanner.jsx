import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Tag } from "lucide-react-native";
import PrimaryButton from "./PrimaryButton";
import GhostButton from "./GhostButton";
import { colors, fonts, fontSizes, gradients, radius, spacing } from "../theme";
import heroImage from "../../assets/hero.png";

/** Banner de bienvenida del inicio, con el mismo texto y acciones que la web. */
export default function HeroBanner({ onExplore, onViewCategories }) {
  return (
    <ImageBackground
      source={heroImage}
      style={styles.hero}
      imageStyle={styles.heroImage}
    >
      <LinearGradient
        colors={gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          Descubre el sonido{"\n"}auténtico del vinilo
        </Text>

        <Text style={styles.description}>
          Haz que tus discos favoritos suenen como deben, con la{" "}
          <Text style={styles.highlight}>calidez</Text> que sólo el{" "}
          <Text style={styles.highlight}>vinilo</Text> ofrece.
        </Text>

        <View style={styles.actions}>
          <PrimaryButton
            title="Explorar Vinilos"
            onPress={onExplore}
            icon={<ArrowRight size={18} color={colors.textPrimary} />}
            style={styles.action}
          />

          <GhostButton
            title="Ver Categorías"
            onPress={onViewCategories}
            icon={<Tag size={18} color={colors.textPrimary} />}
            style={styles.action}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.xl,
    overflow: "hidden",
    minHeight: 280,
    justifyContent: "center",
  },
  heroImage: {
    borderRadius: radius.xl,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.xxl,
    lineHeight: 40,
  },
  description: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  highlight: {
    color: colors.purpleSoft,
    fontFamily: fonts.bold,
  },
  actions: {
    gap: spacing.sm,
  },
  action: {
    alignSelf: "flex-start",
  },
});
