"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemeMode = "light" | "dark";

interface ThemeModeContextType {
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextType | undefined>(
  undefined,
);

export const ThemeModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const colorScheme = useColorScheme();

  const [themeMode, setThemeMode] = useState<ThemeMode>(
    colorScheme === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    (async () => {
      const savedTheme = (await AsyncStorage.getItem("theme")) as
        | ThemeMode
        | "light";
      if (savedTheme) {
        setThemeMode(savedTheme);
        AsyncStorage.setItem("theme", savedTheme);
      }
    })();
  }, []);

  const toggleThemeMode = () => {
    const newThemeMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newThemeMode);
    AsyncStorage.setItem("theme", newThemeMode);
  };

  return (
    <ThemeModeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
};
