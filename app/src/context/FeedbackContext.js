import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2, XCircle, Info } from "lucide-react-native";
import { colors, fonts, fontSizes, radius, spacing } from "../theme";

const FeedbackContext = createContext(null);

const TOAST_DURATION = 2200;

const toastIcons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const toastColors = {
  success: colors.success,
  error: colors.danger,
  info: colors.purpleLight,
};

/**
 * Notificaciones flotantes de la aplicación. Reemplaza a SweetAlert2 del
 * frontend web conservando el mismo estilo visual (tarjeta oscura + acento).
 */
export function FeedbackProvider({ children }) {
  const [toast, setToast] = useState(null);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const hideTimer = useRef(null);

  const showToast = useCallback(
    ({ type = "success", title, message }) => {
      setToast({ type, title, message });

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();

      clearTimeout(hideTimer.current);

      hideTimer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -20,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => setToast(null));
      }, TOAST_DURATION);
    },
    [opacity, translateY]
  );

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const ToastIcon = toast ? toastIcons[toast.type] : null;

  return (
    <FeedbackContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              top: insets.top + spacing.sm,
              opacity,
              transform: [{ translateY }],
              borderColor: toastColors[toast.type],
            },
          ]}
        >
          <ToastIcon size={20} color={toastColors[toast.type]} />

          <View style={styles.toastText}>
            <Text style={styles.toastTitle}>{toast.title}</Text>

            {!!toast.message && (
              <Text style={styles.toastMessage}>{toast.message}</Text>
            )}
          </View>
        </Animated.View>
      )}
    </FeedbackContext.Provider>
  );
}

export const useFeedback = () => {
  const context = useContext(FeedbackContext);

  if (!context) {
    throw new Error("useFeedback debe usarse dentro de un FeedbackProvider");
  }

  return context;
};

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    zIndex: 9999,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  toastText: {
    flex: 1,
  },
  toastTitle: {
    color: colors.textPrimary,
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
  },
  toastMessage: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    marginTop: 2,
  },
});
