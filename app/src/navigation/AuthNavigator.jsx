import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import VerifyAccountScreen from "../screens/auth/VerifyAccountScreen";
import PasswordRecoveryScreen from "../screens/auth/PasswordRecoveryScreen";
import VerifyCodeScreen from "../screens/auth/VerifyCodeScreen";
import NewPasswordScreen from "../screens/auth/NewPasswordScreen";

const AuthStack = createNativeStackNavigator();

/**
 * Flujo de autenticación: inicio de sesión, registro, confirmación de
 * cuenta y recuperación de contraseña.
 */
export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
      <AuthStack.Screen
        name="PasswordRecovery"
        component={PasswordRecoveryScreen}
      />
      <AuthStack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <AuthStack.Screen name="NewPassword" component={NewPasswordScreen} />
    </AuthStack.Navigator>
  );
}
