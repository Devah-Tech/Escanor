import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Camera } from "lucide-react-native";
import { useCameraPermission } from "react-native-vision-camera";

export default function IndexScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { hasPermission, requestPermission } = useCameraPermission();

  const colorText = Colors[colorScheme ?? "light"].text;

  const handleOpenCamera = async () => {
    if (!hasPermission) {
      const permission = await requestPermission();

      if (!permission) {
        return;
      } else {
        router.push("/modal");
      }
    } else {
      router.push("/modal");
    }
  };

  return (
    <ThemedView className="flex-1 items-center justify-center p-6 gap-3">
      <ThemedView className="flex-row justify-center mb-6">
        <MaterialIcons name="ad-units" size={64} color={colorText} />
      </ThemedView>
      <ThemedView className="flex-row justify-center">
        <ThemedText type="subtitle">Escanear Billete</ThemedText>
      </ThemedView>
      <ThemedView className="gap-3 mb-6">
        <ThemedText>
          Use la cámara de su dispositivo para{" "}
          <ThemedText type="defaultSemiBold">detectar y verificar</ThemedText>{" "}
          la validez de{" "}
          <ThemedText type="defaultSemiBold">un billete</ThemedText>. No es
          necesario enfocar todo el billete sino solamente la parte donde se
          muestra el número de serie y el valor del billete.
        </ThemedText>
      </ThemedView>
      <Button
        className="bg-cyan-700 dark:bg-white data-[active=true]:bg-cyan-500 dark:data-[active=true]:bg-gray-200 mt-3"
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
