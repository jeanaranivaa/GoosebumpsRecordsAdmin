import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ShoppingCart, Star } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import VinylCover from "../../components/VinylCover";
import QuantitySelector from "../../components/QuantitySelector";
import PrimaryButton from "../../components/PrimaryButton";
import CustomTextInput from "../../components/CustomTextInput";
import StarRating from "../../components/StarRating";
import ReviewItem from "../../components/ReviewItem";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useFeedback } from "../../context/FeedbackContext";
import { useReviews } from "../../hooks/reviews/useReviews";
import { formatPrice, getErrorMessage } from "../../utils/format";
import { colors, fonts, fontSizes, radius, spacing } from "../../theme";

/** Detalle de un vinilo: informacion, compra y valoraciones. */
export default function VinylDetailScreen({ navigation, route }) {
  const { vinyl } = route.params;

  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useFeedback();
  const { reviews, average, total, saveReview } = useReviews(vinyl._id);

  const [quantity, setQuantity] = useState(1);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  const isSoldOut = vinyl.status === "Agotado" || vinyl.stock === 0;
  const maxQuantity = vinyl.stock || 99;

  const handleAddToCart = () => {
    if (isSoldOut) return;

    addItem(vinyl, quantity);

    showToast({
      type: "success",
      title: "Agregado al carrito",
      message: `${quantity} x ${vinyl.title}`,
    });

    navigation.goBack();
  };

  const handleSaveReview = async () => {
    if (savingReview) return;

    if (myRating === 0) {
      setReviewError("Selecciona una calificación de 1 a 5 estrellas");
      return;
    }

    try {
      setSavingReview(true);
      setReviewError("");

      await saveReview({
        userId: user.id,
        rating: myRating,
        comment: myComment,
      });

      setMyRating(0);
      setMyComment("");

      showToast({
        type: "success",
        title: "¡Gracias por tu reseña!",
      });
    } catch (error) {
      setReviewError(getErrorMessage(error, "No se pudo guardar la reseña"));
    } finally {
      setSavingReview(false);
    }
  };

  return (
    <ScreenContainer edges={[]}>
      <AppHeader
        title={vinyl.title}
        subtitle={vinyl.artist}
        onBack={navigation.goBack}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cover}>
          <VinylCover
            src={vinyl.coverUrl}
            alt={vinyl.title}
            placeholderSize={64}
          />
        </View>

        <View style={styles.genreBadge}>
          <Text style={styles.genreText}>{vinyl.genre}</Text>
        </View>

        <Text style={styles.title}>{vinyl.title}</Text>
        <Text style={styles.artist}>{vinyl.artist}</Text>

        <View style={styles.ratingRow}>
          <StarRating value={Math.round(average)} size={16} />

          <Text style={styles.ratingText}>
            {total > 0
              ? `${average} · ${total} ${total === 1 ? "reseña" : "reseñas"}`
              : "Sin reseñas aún"}
          </Text>
        </View>

        <Text style={styles.description}>{vinyl.description}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.price}>{formatPrice(vinyl.price)}</Text>

          <Text style={[styles.stock, isSoldOut && styles.stockOut]}>
            {isSoldOut ? "Agotado" : `${vinyl.stock} en stock`}
          </Text>
        </View>

        {!isSoldOut && (
          <QuantitySelector
            quantity={quantity}
            max={maxQuantity}
            onDecrease={() => setQuantity((value) => Math.max(1, value - 1))}
            onIncrease={() =>
              setQuantity((value) => Math.min(maxQuantity, value + 1))
            }
          />
        )}

        <PrimaryButton
          title={isSoldOut ? "No disponible" : "Agregar al carrito"}
          onPress={handleAddToCart}
          disabled={isSoldOut}
          icon={<ShoppingCart size={18} color={colors.textPrimary} />}
        />

        {/* Valoraciones del vinilo */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Valoraciones</Text>

          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>
              Este vinilo todavía no tiene reseñas.
            </Text>
          ) : (
            <View style={styles.reviewsList}>
              {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
              ))}
            </View>
          )}

          {isAuthenticated ? (
            <View style={styles.reviewForm}>
              <View style={styles.reviewFormHead}>
                <Text style={styles.reviewFormLabel}>Tu calificación</Text>
                <StarRating value={myRating} size={22} onSelect={setMyRating} />
              </View>

              <CustomTextInput
                placeholder="Cuéntanos qué te pareció (opcional)"
                value={myComment}
                onChangeText={setMyComment}
                maxLength={500}
                multiline
              />

              {!!reviewError && (
                <Text style={styles.reviewError}>{reviewError}</Text>
              )}

              <PrimaryButton
                title="Enviar reseña"
                onPress={handleSaveReview}
                loading={savingReview}
                disabled={myRating === 0}
                icon={<Star size={18} color={colors.textPrimary} />}
              />

              <Text style={styles.reviewNote}>
                Solo puedes valorar vinilos que ya hayas comprado.
              </Text>
            </View>
          ) : (
            <Text style={styles.noReviews}>
              Inicia sesión y compra este vinilo para valorarlo.
            </Text>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  cover: {
    aspectRatio: 1,
    borderRadius: radius.xl,
    overflow: "hidden",
    backgroundColor: colors.surfaceAlt,
    marginBottom: spacing.xs,
  },
  genreBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(139, 92, 246, 0.18)",
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  genreText: {
    color: colors.purpleLight,
    fontFamily: fonts.bold,
    fontSize: fontSizes.xs,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.xl,
  },
  artist: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    marginTop: -spacing.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  ratingText: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
  },
  description: {
    color: colors.textSecondary,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  price: {
    color: colors.primary,
    fontFamily: fonts.black,
    fontSize: fontSizes.xl,
  },
  stock: {
    color: colors.success,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
  },
  stockOut: {
    color: colors.danger,
  },
  reviewsSection: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.md,
  },
  noReviews: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
  },
  reviewsList: {
    gap: spacing.xs,
  },
  reviewForm: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  reviewFormHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  reviewFormLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
  },
  reviewError: {
    color: colors.danger,
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
  },
  reviewNote: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    textAlign: "center",
  },
});
