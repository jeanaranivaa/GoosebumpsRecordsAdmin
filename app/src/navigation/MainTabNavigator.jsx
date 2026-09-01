import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Disc3, LayoutGrid, Package, ShoppingCart, User } from "lucide-react-native";
import HomeScreen from "../screens/store/HomeScreen";
import CategoriesScreen from "../screens/store/CategoriesScreen";
import CartScreen from "../screens/store/CartScreen";
import MyOrdersScreen from "../screens/orders/MyOrdersScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { useCart } from "../context/CartContext";
import { colors, fonts, fontSizes } from "../theme";

const MainTab = createBottomTabNavigator();

/** Menú inferior de la aplicación, con las mismas secciones del sidebar web. */
export default function MainTabNavigator() {
  const { totalCount } = useCart();

  return (
    <MainTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.sidebar,
          borderTopColor: "rgba(255, 255, 255, 0.06)",
          borderTopWidth: 1,
          height: 66,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.semiBold,
          fontSize: fontSizes.xs,
        },
        tabBarBadgeStyle: {
          backgroundColor: colors.primary,
          color: colors.textPrimary,
          fontFamily: fonts.bold,
          fontSize: 10,
        },
      }}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => <Disc3 size={size} color={color} />,
        }}
      />

      <MainTab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          title: "Categorías",
          tabBarIcon: ({ color, size }) => (
            <LayoutGrid size={size} color={color} />
          ),
        }}
      />

      <MainTab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Carrito",
          tabBarBadge: totalCount > 0 ? totalCount : undefined,
          tabBarIcon: ({ color, size }) => (
            <ShoppingCart size={size} color={color} />
          ),
        }}
      />

      <MainTab.Screen
        name="MyOrders"
        component={MyOrdersScreen}
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, size }) => <Package size={size} color={color} />,
        }}
      />

      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </MainTab.Navigator>
  );
}
