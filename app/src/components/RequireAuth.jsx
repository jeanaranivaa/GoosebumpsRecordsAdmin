import { Lock } from "lucide-react-native";
import ScreenContainer from "./ScreenContainer";
import AppHeader from "./AppHeader";
import EmptyState from "./EmptyState";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

/**
 * Equivalente móvil del ProtectedRoute de la web: si no hay sesión activa
 * muestra un aviso con acceso directo al inicio de sesión.
 */
export default function RequireAuth({ navigation, title, message, children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return children;
  }

  return (
    <ScreenContainer edges={[]}>
      <AppHeader title={title} />

      <EmptyState
        icon={<Lock size={48} color={colors.textMuted} />}
        title="Inicia sesión para continuar"
        message={message}
        actionLabel="Iniciar sesión"
        onAction={() => navigation.navigate("Auth")}
      />
    </ScreenContainer>
  );
}
