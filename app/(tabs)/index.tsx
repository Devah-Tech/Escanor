import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";

export default function IndexScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const colorText = Colors[colorScheme ?? "light"].text;

  const handleOpenCamera = () => {
    router.push("/modal");
  };

  return (
    <ThemedView className="flex-1 items-center justify-center p-6 gap-3">
      <ThemedView className="flex-row justify-center mb-6">
        <IconSymbol size={64} name="camera.fill" color={colorText} />
      </ThemedView>
      <ThemedView className="flex-row justify-center">
        <ThemedText type="subtitle">Escanear Billete</ThemedText>
      </ThemedView>
      <ThemedView className="gap-3 mb-6">
        <ThemedText>
          Use la cámara de su dispositivo para{" "}
          <ThemedText type="defaultSemiBold">capturar y verificar</ThemedText>{" "}
          la validez de{" "}
          <ThemedText type="defaultSemiBold">un billete</ThemedText>. Asegúrese
          de que el billete esté completamente visible dentro del marco para
          obtener mejores resultados.
        </ThemedText>
      </ThemedView>
      <Button
        className="bg-cyan-600 dark:bg-white data-[active=true]:bg-cyan-500 dark:data-[active=true]:bg-gray-200 mt-3"
        data-disabled={false}
        size="lg"
        onPress={handleOpenCamera}
      >
        <ButtonIcon as={Camera} className="mr-2" />
        <ButtonText>Abrir Cámara</ButtonText>
      </Button>
    </ThemedView>
  );
}
