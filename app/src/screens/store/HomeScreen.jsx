import { useMemo, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Disc3 } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import SearchBar from "../../components/SearchBar";
import HeroBanner from "../../components/HeroBanner";
import SectionHeader from "../../components/SectionHeader";
import VinylCard from "../../components/VinylCard";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import { useVinyls } from "../../hooks/vinyls/useVinyls";
import { usePopularVinyls } from "../../hooks/vinyls/usePopularVinyls";
import { useAuth } from "../../context/AuthContext";
import { colors, fonts, fontSizes, spacing } from "../../theme";

const POPULAR_LIMIT = 6;

/**
 * Pantalla de inicio: banner, buscador y vinilos más vendidos.
 * Al escribir en el buscador se filtra todo el catálogo.
 */
export default function HomeScreen({ navigation }) {
  const { vinyls, loading: loadingVinyls, refetch: refetchVinyls } = useVinyls();
  const {
    popular,
    loading: loadingPopular,
    refetch: refetchPopular,
  } = usePopularVinyls(POPULAR_LIMIT);

  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const listRef = useRef(null);

  const { user } = useAuth();

  const isSearching = search.trim().length > 0;

  const filteredVinyls = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return vinyls;

    return vinyls.filter(
      (vinyl) =>
        vinyl.title?.toLowerCase().includes(query) ||
        vinyl.artist?.toLowerCase().includes(query) ||
        vinyl.genre?.toLowerCase().includes(query)
    );
  }, [vinyls, search]);

  // Sin búsqueda se muestra el top de ventas; al buscar, todo el catálogo
  const displayedVinyls = isSearching ? filteredVinyls : popular;
  const isLoading = isSearching ? loadingVinyls : loadingPopular;

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchVinyls(), refetchPopular()]);
    setRefreshing(false);
  };

  const openVinylDetail = (vinyl) =>
    navigation.navigate("VinylDetail", { vinyl });

  // Lleva al listado de vinilos que está debajo del banner
  const scrollToVinyls = () =>
    listRef.current?.scrollToOffset({ offset: 340, animated: true });

  const renderHeader = () => (
    <View style={styles.header}>
      <HeroBanner
        onExplore={scrollToVinyls}
        onViewCategories={() => navigation.navigate("Categories")}
      />

      <SectionHeader
        title={isSearching ? "Resultados de" : "Vinilos"}
        highlight={isSearching ? "búsqueda" : "Más Populares"}
        actionLabel="Ver más"
        onAction={() => navigation.navigate("Categories")}
      />
    </View>
  );

  return (
    <ScreenContainer edges={[]}>
      <AppHeader
        title="Goosebumps Records"
        subtitle={
          user ? `Hola, ${user.fullName.split(" ")[0]}` : "Tienda de vinilos"
        }
      />

      <View style={styles.searchWrapper}>
        <SearchBar value={search} onChangeText={setSearch} />
      </View>

      <FlatList
        ref={listRef}
        data={displayedVinyls}
        keyExtractor={(vinyl) => vinyl._id}
        renderItem={({ item }) => (
          <VinylCard vinyl={item} onPress={openVinylDetail} style={styles.card} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <LoadingState message="Cargando vinilos..." />
          ) : (
            <EmptyState
              icon={<Disc3 size={48} color={colors.textMuted} />}
              title={isSearching ? "Sin resultados" : "Aún no hay populares"}
              message={
                isSearching
                  ? `No se encontraron vinilos para "${search}".`
                  : "Todavía no hay ventas para calcular los más vendidos."
              }
              actionLabel="Ver catálogo completo"
              onAction={() => navigation.navigate("Categories")}
            />
          )
        }
        ListFooterComponent={
          !isSearching && displayedVinyls.length > 0 ? (
            <Text style={styles.footerNote}>
              Calculado a partir de las ventas registradas en la tienda.
            </Text>
          ) : null
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  header: {
    paddingTop: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  column: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  card: {
    flex: 1,
  },
  footerNote: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
