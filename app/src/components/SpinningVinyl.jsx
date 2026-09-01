import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts, gradients } from "../theme";

const ROTATION_DURATION = 3600;

/** Disco de vinilo girando: identidad visual de las pantallas de carga. */
export default function SpinningVinyl({ size = 150 }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: ROTATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const grooveCount = 6;

  return (
    <Animated.View
      style={[
        styles.disc,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ rotate: spin }],
        },
      ]}
    >
      {Array.from({ length: grooveCount }).map((_, index) => {
        const grooveSize = size - (index + 1) * (size * 0.055);

        return (
          <View
            key={index}
            style={[
              styles.groove,
              {
                width: grooveSize,
                height: grooveSize,
                borderRadius: grooveSize / 2,
              },
            ]}
          />
        );
      })}

      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.label,
          {
            width: size * 0.36,
            height: size * 0.36,
            borderRadius: size * 0.18,
          },
        ]}
      >
        <Text style={[styles.labelText, { fontSize: size * 0.17 }]}>G</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  disc: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16182c",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  groove: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  label: {
    alignItems: "center",
    justifyContent: "center",
  },
  labelText: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
  },
});
