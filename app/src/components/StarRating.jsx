import { Pressable, StyleSheet, View } from "react-native";
import { Star } from "lucide-react-native";
import { colors } from "../theme";

/**
 * Estrellas de valoración. Si recibe onSelect se vuelve interactiva
 * para que el cliente califique un vinilo.
 */
export default function StarRating({ value = 0, size = 14, onSelect }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= value;

        const icon = (
          <Star
            size={size}
            color={isFilled ? colors.warning : colors.textMuted}
            fill={isFilled ? colors.warning : "transparent"}
          />
        );

        if (!onSelect) {
          return <View key={star}>{icon}</View>;
        }

        return (
          <Pressable
            key={star}
            onPress={() => onSelect(star)}
            hitSlop={6}
            accessibilityLabel={`Calificar con ${star} estrellas`}
          >
            {icon}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
});
