import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Disc3,
  LogOut,
  Package,
  ShoppingCart,
  UserCog,
} from "lucide-react-native";
import ScreenContainer from "../../components/ScreenContainer";
import AppHeader from "../../components/AppHeader";
import RequireAuth from "../../components/RequireAuth";
import ProfileOption from "../../components/ProfileOption";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useFeedback } from "../../context/FeedbackContext";
import { colors, fonts, fontSizes, radius, spacing } from "../../theme";
import userImage from "../../../assets/user.png";

/** Perfil del cliente: datos de la cuenta y accesos rápidos. */
export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const { showToast } = useFeedback();

  const handleLogout = async () => {
    await logout();

    showToast({
      type: "info",
      title: "Sesión cerrada",
      message: "Vuelve pronto por más vinilos",
    });

    navigation.navigate("Home");
  };

  return (
    <RequireAuth
      navigation={navigation}
      title="Mi Perfil"
      message="Inicia sesión para ver y editar los datos de tu cuenta."
    >
      <ScreenContainer edges={[]}>
        <AppHeader title="Mi Perfil" subtitle="Datos de tu cuenta" />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.identity}>
            <Image
              source={user?.imageURL ? { uri: user.imageURL } : userImage}
              style={styles.avatar}
            />

            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            {!!user?.phone && <Text style={styles.phone}>{user.phone}</Text>}
          </View>

          <View style={styles.options}>
            <ProfileOption
              icon={<UserCog size={20} color={colors.purpleLight} />}
              label="Editar mis datos"
              description="Nombre, correo y teléfono"
              onPress={() => navigation.navigate("EditProfile")}
            />

            <ProfileOption
              icon={<Package size={20} color={colors.purpleLight} />}
              label="Mis pedidos"
              description="Historial y estado de tus compras"
              onPress={() => navigation.navigate("MyOrders")}
            />

            <ProfileOption
              icon={<ShoppingCart size={20} color={colors.purpleLight} />}
              label="Mi carrito"
              description={`${totalCount} ${
                totalCount === 1 ? "artículo" : "artículos"
              } por comprar`}
              onPress={() => navigation.navigate("Cart")}
            />

            <ProfileOption
              icon={<Disc3 size={20} color={colors.purpleLight} />}
              label="Seguir explorando"
              description="Vuelve al catálogo de vinilos"
              onPress={() => navigation.navigate("Home")}
            />

            <ProfileOption
              icon={<LogOut size={20} color={colors.danger} />}
              label="Cerrar sesión"
              onPress={handleLogout}
              destructive
            />
          </View>

          <Text style={styles.version}>Goosebumps Records · versión 1.0.0</Text>
        </ScrollView>
      </ScreenContainer>
    </RequireAuth>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  identity: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: 4,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginBottom: spacing.xs,
  },
  name: {
    color: colors.textPrimary,
    fontFamily: fonts.black,
    fontSize: fontSizes.lg,
    textAlign: "center",
  },
  email: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
  },
  phone: {
    color: colors.purpleLight,
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
  },
  options: {
    gap: spacing.xs,
  },
  version: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    textAlign: "center",
  },
});
