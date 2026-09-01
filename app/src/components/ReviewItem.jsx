import { StyleSheet, Text, View } from "react-native";
import StarRating from "./StarRating";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

/** Reseña individual de un vinilo. */
export default function ReviewItem({ review }) {
  return (
    <View style={styles.item}>
      <View style={styles.header}>
        <Text style={styles.author} numberOfLines={1}>
          {review.userId?.fullName || "Cliente"}
        </Text>

        <StarRating value={review.rating} size={12} />
      </View>

      {!!review.comment && (
        <Text style={styles.comment}>{review.comment}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  author: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
  },
  comment: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
});
