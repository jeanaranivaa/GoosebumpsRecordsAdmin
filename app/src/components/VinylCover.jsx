import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

/**
 * Portada de un vinilo con respaldo cuando la imagen no carga.
 * Se guarda la url que falló (no un booleano) para que el estado se
 * reinicie solo cuando el componente se reutiliza con otro vinilo.
 */
export default function VinylCover({ src, alt, style, placeholderSize = 42 }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (!src || failedSrc === src) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={[styles.placeholderIcon, { fontSize: placeholderSize }]}>
          ♪
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      accessibilityLabel={alt}
      style={[styles.image, style]}
      resizeMode="cover"
      onError={() => setFailedSrc(src)}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.surfaceAlt,
  },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt,
  },
  placeholderIcon: {
    color: "#3a3f66",
    fontFamily: fonts.bold,
  },
});
