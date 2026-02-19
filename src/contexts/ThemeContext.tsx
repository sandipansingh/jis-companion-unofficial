import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import Colors from "../constants/Colors";

type ColorScheme = "light" | "dark";

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: typeof Colors.light;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "user-theme-preference";

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const systemColorScheme = useRNColorScheme();
  const [isReady, setIsReady] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme === "dark" || savedTheme === "light") {
          setColorScheme(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, [setColorScheme]);

  const toggleTheme = () => {
    const isEffectivelyDark = colorScheme === "dark" || (!colorScheme && systemColorScheme === "dark");
    const newScheme = isEffectivelyDark ? "light" : "dark";
    
    setColorScheme(newScheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, newScheme).catch((error) => {
      console.error("Failed to save theme preference:", error);
    });
  };

  const setTheme = (theme: ColorScheme) => {
    setColorScheme(theme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, theme).catch((error) => {
      console.error("Failed to save theme preference:", error);
    });
  };

  const activeColorScheme = (colorScheme === "dark" || (!colorScheme && systemColorScheme === "dark")) ? "dark" : "light";
  
  const value: ThemeContextType = {
    colorScheme: activeColorScheme,
    colors: Colors[activeColorScheme],
    isDark: activeColorScheme === "dark",
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
