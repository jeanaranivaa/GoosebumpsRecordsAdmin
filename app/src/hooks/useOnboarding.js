import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "hasSeenOnboarding";

/** Recuerda si el usuario ya vio la presentación de bienvenida. */
export const useOnboarding = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [loadingOnboarding, setLoadingOnboarding] = useState(true);

  useEffect(() => {
    const readFlag = async () => {
      try {
        const stored = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(stored === "true");
      } catch (error) {
        console.log("No se pudo leer el estado del onboarding:", error);
      } finally {
        setLoadingOnboarding(false);
      }
    };

    readFlag();
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setHasSeenOnboarding(true);
  }, []);

  return { hasSeenOnboarding, loadingOnboarding, completeOnboarding };
};
