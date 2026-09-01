import { DarkTheme } from "@react-navigation/native";
import { colors } from "../theme";

/** Tema de React Navigation con la paleta oscura de Goosebumps Records. */
export const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.sidebar,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.primary,
  },
};
