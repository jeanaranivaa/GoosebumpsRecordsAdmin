import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Package } from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import RequireAuth from "../../components/RequireAuth";
import OrderCard from "../../components/OrderCard";
import EmptyState from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import { useMyOrders } from "../../hooks/orders/useMyOrders";
import { colors, spacing } from "../../theme";

/** Historial de pedidos del cliente autenticado. */
export default function MyOrdersScreen({ navigation }) {
  const { orders, loading, error, refetch } = useMyOrders();
  const [refreshing, setRefreshing] = useState(false);

  // Se recargan al volver a la pestaña para reflejar compras recientes
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const openOrderDetail = (order) =>
    navigation.navigate("OrderDetail", { order });

  const renderEmpty = () => {
    if (loading) {
      return <LoadingState message="Cargando pedidos..." />;
    }

    if (error) {
      return (
        <EmptyState
          icon={<Package size={48} color={colors.danger} />}
          title="No se pudieron cargar tus pedidos"
          message="Revisa tu conexión e inténtalo de nuevo."
          actionLabel="Reintentar"
          onAction={refetch}
        />
      );
    }

    return (
      <EmptyState
        icon={<Package size={48} color={colors.textMuted} />}
        title="Aún no tienes pedidos"
        message="Cuando compres un vinilo aparecerá aquí con su estado."
        actionLabel="Explorar vinilos"
        onAction={() => navigation.navigate("Home")}
      />
    );
  };

  return (
    <RequireAuth
      navigation={navigation}
      title="Mis Pedidos"
      message="Inicia sesión para ver el historial y el estado de tus compras."
    >
      <ScreenContainer edges={[]}>
        <AppHeader
          title="Mis Pedidos"
          subtitle={`${orders.length} ${
            orders.length === 1 ? "pedido" : "pedidos"
          }`}
        />

        <FlatList
          data={orders}
          keyExtractor={(order) => order._id}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={openOrderDetail} />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      </ScreenContainer>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
});
