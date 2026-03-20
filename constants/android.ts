import { Platform } from "react-native";

// Verificar si es Android con API < 28 (Android < 9)
export const isLowAndroidVersion = (version: number): boolean =>
  version > 0 && version < 28;

// Obtener la versión de Android
export const getAndroidVersion = (): number =>
  Platform.OS === "android" ? Platform.Version : 0;

export const isLowAndroid = isLowAndroidVersion(getAndroidVersion());
