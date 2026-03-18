import { Link } from "expo-router";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

const NoCameraDevice = () => {
  return (
    <ThemedView className="flex-1 items-center justify-center p-6 gap-3">
      <ThemedText type="subtitle">Sin dispositivo de cámara.</ThemedText>
      <Link href="/" dismissTo>
        <ThemedText type="link">Ir a la pantalla de inicio</ThemedText>
      </Link>
    </ThemedView>
  );
};

export default NoCameraDevice;
