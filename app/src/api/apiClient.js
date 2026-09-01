import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_PORT = 4000;

/**
 * En un dispositivo físico "localhost" apunta al teléfono, no a la
 * computadora que corre el backend. Se toma la IP del servidor de Expo
 * (hostUri) para construir la URL correcta de forma automática.
 */
const resolveBaseUrl = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    "";

  const host = hostUri.split(":")[0];

  if (host) {
    return `http://${host}:${API_PORT}/api`;
  }

  return `http://localhost:${API_PORT}/api`;
};

export const API_BASE_URL = resolveBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
