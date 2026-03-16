import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

import {
  ThemeModeProvider,
  useThemeMode,
} from "@/components/ui/theme-mode-provider";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutContent() {
  const { themeMode } = useThemeMode();

  return (
    <GluestackUIProvider mode={themeMode}>
      <ThemeProvider value={themeMode === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ headerShown: false, presentation: "modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <RootLayoutContent />
    </ThemeModeProvider>
  );
}
