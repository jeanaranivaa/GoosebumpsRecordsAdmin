import { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { LayoutGrid } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import CategoryCard from "../../components/CategoryCard";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import { useVinyls } from "../../hooks/vinyls/useVinyls";
import { colors, spacing } from "../../theme";

/** Géneros disponibles, agrupados dinámicamente desde el catálogo. */
export default function CategoriesScreen({ navigation }) {
  const { vinyls, loading } = useVinyls();

  const categories = useMemo(() => {
    const countByGenre = new Map();

    vinyls.forEach((vinyl) => {
      const genre = vinyl.genre?.trim() || "Otros";
      countByGenre.set(genre, (countByGenre.get(genre) || 0) + 1);
    });

    return Array.from(countByGenre, ([name, count]) => ({ name, count }));
  }, [vinyls]);

  const openCategory = (genre) =>
    navigation.navigate("CategoryVinyls", { genre });

  return (
    <ScreenContainer edges={[]}>
      <AppHeader
        title="Categorías"
        subtitle={`${categories.length} géneros disponibles`}
      />

      {loading ? (
        <LoadingState message="Cargando categorías..." />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(category) => category.name}
          renderItem={({ item, index }) => (
            <View style={styles.cardWrapper}>
              <CategoryCard
                name={item.name}
                count={item.count}
                index={index}
                onPress={openCategory}
              />
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<LayoutGrid size={48} color={colors.textMuted} />}
              title="Sin categorías"
              message="Aún no hay vinilos registrados en la tienda."
            />
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  column: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardWrapper: {
    flex: 1,
  },
});
