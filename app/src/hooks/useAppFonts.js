import { useFonts } from "expo-font";

// Se importa cada peso por separado para no empaquetar toda la familia
import { Poppins_400Regular } from "@expo-google-fonts/poppins/400Regular";
import { Poppins_500Medium } from "@expo-google-fonts/poppins/500Medium";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins/600SemiBold";
import { Poppins_700Bold } from "@expo-google-fonts/poppins/700Bold";
import { Poppins_900Black } from "@expo-google-fonts/poppins/900Black";

/**
 * Carga la tipografía Poppins, la misma que usa el sitio web.
 * Devuelve true cuando las fuentes ya están listas para pintarse.
 */
export const useAppFonts = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_900Black,
  });

  return fontsLoaded;
};
