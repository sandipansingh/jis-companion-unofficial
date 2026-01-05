import Colors, { ColorScheme, ThemeColors } from "@/src/constants/Colors";
import React, { createContext, ReactNode, useContext } from "react";

interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Force light mode always
  const colorScheme: ColorScheme = "light";

  const value: ThemeContextType = {
    colorScheme,
    colors: Colors[colorScheme],
    isDark: false,
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
