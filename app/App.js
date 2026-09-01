import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { FeedbackProvider } from "./src/context/FeedbackContext";
import AppNavigator from "./src/navigation/AppNavigator";

/** Punto de entrada: proveedores globales y navegación de la aplicación. */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <FeedbackProvider>
              <AppNavigator />
            </FeedbackProvider>
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
