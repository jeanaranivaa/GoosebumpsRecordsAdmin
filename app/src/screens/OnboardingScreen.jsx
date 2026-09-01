import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Disc3, ShoppingBag, Truck } from "lucide-react-native";
import PrimaryButton from "../components/PrimaryButton";
import { colors, fonts, fontSizes, gradients, radius, spacing } from "../theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ONBOARDING_SLIDES = [
  {
    key: "catalogo",
    icon: Disc3,
    title: "Vinilos originales",
    description:
      "Explora un catálogo curado de discos por género, artista y novedades.",
  },
  {
    key: "carrito",
    icon: ShoppingBag,
    title: "Compra en segundos",
    description:
      "Agrega al carrito, aplica tu cupón y confirma tu pedido desde el teléfono.",
  },
  {
    key: "pedidos",
    icon: Truck,
    title: "Sigue tus pedidos",
    description:
      "Consulta el estado de cada compra y valora los vinilos que ya escuchaste.",
  },
];

/**
 * Presentación de bienvenida que se muestra la primera vez que se abre
 * la aplicación, después del Splash Screen.
 */
export default function OnboardingScreen({ onFinish }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const isLastSlide = activeIndex === ONBOARDING_SLIDES.length - 1;

  const handleScroll = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );

    setActiveIndex(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      onFinish();
      return;
    }

    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
  };

  const renderSlide = ({ item }) => {
    const Icon = item.icon;

    return (
      <View style={styles.slide}>
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}
        >
          <Icon size={46} color={colors.textPrimary} />
        </LinearGradient>

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={gradients.splash} style={styles.container}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={onFinish} style={styles.skip} hitSlop={10}>
          <Text style={styles.skipText}>Saltar</Text>
        </Pressable>

        <FlatList
          ref={listRef}
          data={ONBOARDING_SLIDES}
          keyExtractor={(item) => item.key}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
        />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {ONBOARDING_SLIDES.map((slide, index) => (
              <View
                key={slide.key}
                style={[styles.dot, index === activeIndex && styles.dotActive]}
              />
            ))}
          </View>

          <PrimaryButton
            title={isLastSlide ? "Comenzar" : "Siguiente"}
            onPress={handleNext}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skip: {
    alignSelf: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  skipText: {
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  iconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.xl,
    textAlign: "center",
  },
  description: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    lineHeight: 24,
    textAlign: "center",
  },
  footer: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
});
