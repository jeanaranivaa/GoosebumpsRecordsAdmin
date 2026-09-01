import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import MainTabNavigator from "./MainTabNavigator";
import AuthNavigator from "./AuthNavigator";
import { navigationTheme } from "./navigationTheme";
import LoadingScreen from "../screens/LoadingScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import VinylDetailScreen from "../screens/store/VinylDetailScreen";
import CategoryVinylsScreen from "../screens/store/CategoryVinylsScreen";
import CheckoutScreen from "../screens/store/CheckoutScreen";
import OrderDetailScreen from "../screens/orders/OrderDetailScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import { useAppFonts } from "../hooks/useAppFonts";
import { useOnboarding } from "../hooks/useOnboarding";
import { useAuth } from "../context/AuthContext";

const RootStack = createNativeStackNavigator();

// El splash nativo se mantiene visible hasta que la app está lista
SplashScreen.preventAutoHideAsync().catch(() => {});

/** Tiempo mínimo que se muestra la pantalla de carga personalizada. */
const MINIMUM_LOADING_MS = 2200;

/**
 * Navegación raíz de la aplicación. Decide entre la pantalla de carga,
 * la bienvenida (onboarding) y la tienda con su menú inferior.
 */
export default function AppNavigator() {
  const fontsLoaded = useAppFonts();
  const { loadingSession } = useAuth();
  const { hasSeenOnboarding, loadingOnboarding, completeOnboarding } =
    useOnboarding();

  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setMinimumTimeElapsed(true),
      MINIMUM_LOADING_MS
    );

    return () => clearTimeout(timer);
  }, []);

  // Se oculta el splash nativo apenas hay tipografías para pintar
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const isAppReady =
    minimumTimeElapsed && !loadingSession && !loadingOnboarding;

  if (!isAppReady) {
    return <LoadingScreen />;
  }

  if (!hasSeenOnboarding) {
    return <OnboardingScreen onFinish={completeOnboarding} />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
        <RootStack.Screen name="VinylDetail" component={VinylDetailScreen} />
        <RootStack.Screen
          name="CategoryVinyls"
          component={CategoryVinylsScreen}
        />
        <RootStack.Screen name="Checkout" component={CheckoutScreen} />
        <RootStack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
        <RootStack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ animation: "slide_from_bottom" }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
