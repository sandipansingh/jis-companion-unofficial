const Colors = {
  light: {
    // Primary colors
    primary: "#007AFF",
    primaryLight: "#3395FF",
    primaryDark: "#0051D5",

    // Accent colors
    accent: "#5AC8FA",
    accentLight: "#7DD4FB",
    accentDark: "#32B5F8",

    // Success, Warning, Error
    success: "#34C759",
    warning: "#FF9500",
    error: "#FF0000",

    // Text colors
    text: "#1a1a1a",
    textSecondary: "#666666",
    textMuted: "#999999",

    // Background colors
    background: "#F5F5F5",
    backgroundSecondary: "#f5f5f5",
    backgroundTertiary: "#e8e8e8",

    // Surface colors (for cards, modals, etc.)
    surface: "#ffffff",
    surfaceElevated: "#fafafa",

    // Border colors
    border: "#e0e0e0",
    borderLight: "#eeeeee",

    // Tab colors
    tabIconDefault: "#999999",
    tabIconSelected: "#007AFF",
    tabBackground: "#ffffff",

    // Input colors
    inputBackground: "#ffffff",
    inputBorder: "#dddddd",
    inputPlaceholder: "#999999",

    // Button colors
    buttonText: "#ffffff",
    buttonDisabled: "#cccccc",
  },

  dark: {
    // Primary colors
    primary: "#0A84FF",
    primaryLight: "#409CFF",
    primaryDark: "#0066CC",

    // Accent colors
    accent: "#64D2FF",
    accentLight: "#8CDBFF",
    accentDark: "#3EC9FF",

    // Success, Warning, Error
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF0000",

    // Text colors
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    textMuted: "#808080",

    // Background colors
    background: "#000000",
    backgroundSecondary: "#1c1c1e",
    backgroundTertiary: "#2c2c2e",

    // Surface colors (for cards, modals, etc.)
    surface: "#1c1c1e",
    surfaceElevated: "#2c2c2e",

    // Border colors
    border: "#38383a",
    borderLight: "#2c2c2e",

    // Tab colors
    tabIconDefault: "#808080",
    tabIconSelected: "#0A84FF",
    tabBackground: "#1c1c1e",

    // Input colors
    inputBackground: "#1c1c1e",
    inputBorder: "#38383a",
    inputPlaceholder: "#808080",

    // Button colors
    buttonText: "#ffffff",
    buttonDisabled: "#3a3a3c",
  },
};

export default Colors;

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;
