import { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Disc3 } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import VinylCard from "../../components/VinylCard";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import { useVinyls } from "../../hooks/vinyls/useVinyls";
import { colors, spacing } from "../../theme";

/** Vinilos que pertenecen a un género seleccionado. */
export default function CategoryVinylsScreen({ navigation, route }) {
  const { genre } = route.params;

  const { vinyls, loading } = useVinyls();

  const vinylsInCategory = useMemo(
    () =>
      vinyls.filter((vinyl) => (vinyl.genre?.trim() || "Otros") === genre),
    [vinyls, genre]
  );

  const openVinylDetail = (vinyl) =>
    navigation.navigate("VinylDetail", { vinyl });

  return (
    <ScreenContainer edges={[]}>
      <AppHeader
        title={genre}
        subtitle={`${vinylsInCategory.length} ${
          vinylsInCategory.length === 1 ? "vinilo" : "vinilos"
        }`}
        onBack={navigation.goBack}
      />

      {loading ? (
        <LoadingState message="Cargando vinilos..." />
      ) : (
        <FlatList
          data={vinylsInCategory}
          keyExtractor={(vinyl) => vinyl._id}
          renderItem={({ item }) => (
            <VinylCard
              vinyl={item}
              onPress={openVinylDetail}
              style={styles.card}
            />
          )}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={<Disc3 size={48} color={colors.textMuted} />}
              title="Categoría vacía"
              message="No hay vinilos en esta categoría por el momento."
              actionLabel="Volver"
              onAction={navigation.goBack}
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
  card: {
    flex: 1,
  },
});
