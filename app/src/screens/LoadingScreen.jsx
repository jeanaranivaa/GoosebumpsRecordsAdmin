import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import SpinningVinyl from "../components/SpinningVinyl";
import { colors, fonts, fontSizes, gradients, radius, spacing } from "../theme";

const LOADING_MESSAGES = [
  "Calentando la aguja...",
  "Girando a 33 RPM...",
  "Ordenando la colección...",
];

const MESSAGE_INTERVAL = 1200;

/**
 * Pantalla de carga adicional al Splash Screen nativo. Se muestra mientras
 * se cargan las fuentes y se restaura la sesión guardada.
 */
export default function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((previous) => (previous + 1) % LOADING_MESSAGES.length);
    }, MESSAGE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0.15,
          duration: 900,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [progress]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["8%", "100%"],
  });

  return (
    <LinearGradient colors={gradients.splash} style={styles.container}>
      <StatusBar style="light" />

      <SpinningVinyl size={160} />

      <View style={styles.brand}>
        <Text style={styles.brandName}>GOOSEBUMPS</Text>
        <Text style={styles.brandTag}>RECORDS</Text>
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, { width: barWidth }]}>
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      <Text style={styles.message}>{LOADING_MESSAGES[messageIndex]}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  brand: {
    alignItems: "center",
  },
  brandName: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.xl,
    letterSpacing: 2,
  },
  brandTag: {
    color: colors.primary,
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
    letterSpacing: 8,
    marginTop: 2,
  },
  progressTrack: {
    width: "70%",
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  message: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
  },
});
