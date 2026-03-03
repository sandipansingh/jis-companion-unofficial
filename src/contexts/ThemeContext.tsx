import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { createContext, ReactNode, useContext, useEffect } from 'react';

import Colors from '../constants/Colors';
import { useSettingsStore } from '../features/settings/store/settingsStore';

type ColorScheme = 'light' | 'dark';

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

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const theme = useSettingsStore((state) => state.theme);
  const setStoredTheme = useSettingsStore((state) => state.setTheme);

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  const toggleTheme = () => {
    const isCurrentlyDark = theme === 'dark';
    const newScheme: ColorScheme = isCurrentlyDark ? 'light' : 'dark';

    setStoredTheme(newScheme);
  };

  const setTheme = (theme: ColorScheme) => {
    setStoredTheme(theme);
  };

  const activeColorScheme = colorScheme === 'dark' ? 'dark' : 'light';

  const value: ThemeContextType = {
    colorScheme: activeColorScheme,
    colors: Colors[activeColorScheme],
    isDark: activeColorScheme === 'dark',
    toggleTheme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
