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
    success: "#10B981", // Emerald-500
    successLight: "#34C759",
    successDark: "#059669",
    successDarker: "#065F46",
    warning: "#F59E0B", // Amber-500
    warningLight: "#FEF3C7", // Amber-100
    warningDark: "#D97706",
    error: "#DC2626", // Red-600
    errorLight: "#FEE2E2", // Red-100
    errorDark: "#DC2626",
    errorDarker: "#991B1B",

    // Info/Blue shades
    info: "#3B82F6", // Blue-500
    infoLight: "#DBEAFE", // Blue-100
    infoLighter: "#EBF5FF",
    infoDark: "#0284C7", // Sky-600
    infoDarker: "#0369A1",
    infoDarkest: "#0C4A6E",

    // Text colors
    text: "#1a1a1a",
    textSecondary: "#666666",
    textMuted: "#999999",

    // Gray shades
    gray50: "#F9FAFB",
    gray100: "#F3F4F6",
    gray200: "#E5E7EB",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray500: "#6B7280",
    gray600: "#4F46E5",
    gray700: "#374151",

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

    // Shadow
    shadow: "#000",
    white: "#ffffff",
    black: "#000000",

    // Additional semantic colors
    green: "#22C55E",
    greenLight: "#ECFDF5",
    greenDark: "#16a34a",
    orange: "#F97316",
    orangeLight: "#FEF3C7",
    red: "#F87171",
    redLight: "#FEF2F2",
    purple: "#8B5CF6",
    purpleLight: "#E0E7FF",
    indigo: "#4F46E5",
    indigoLight: "#C7D2FE",
    sky: "#0284C7",
    skyLight: "#F0F9FF",
    slate: "#64748b",
    slateLight: "#F1F5F9",
    slateDark: "#cbd5e1",
    emerald: "#10B981",
    emeraldLight: "#d1fae5",
    emeraldDark: "#6ee7b7",
    amber: "#FBBF24",
    amberLight: "#FEF3C7",
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
    success: "#10B981",
    successLight: "#30D158",
    successDark: "#059669",
    successDarker: "#065F46",
    warning: "#F59E0B",
    warningLight: "#FF9F0A",
    warningDark: "#D97706",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    errorDark: "#DC2626",
    errorDarker: "#991B1B",

    // Info/Blue shades
    info: "#3B82F6",
    infoLight: "#DBEAFE",
    infoLighter: "#EBF5FF",
    infoDark: "#0284C7",
    infoDarker: "#0369A1",
    infoDarkest: "#0C4A6E",

    // Text colors
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    textMuted: "#808080",

    // Gray shades
    gray50: "#F9FAFB",
    gray100: "#F3F4F6",
    gray200: "#E5E7EB",
    gray300: "#D1D5DB",
    gray400: "#9CA3AF",
    gray500: "#6B7280",
    gray600: "#4F46E5",
    gray700: "#374151",

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

    // Shadow
    shadow: "#000",
    white: "#ffffff",
    black: "#000000",

    // Additional semantic colors
    green: "#22C55E",
    greenLight: "#ECFDF5",
    greenDark: "#16a34a",
    orange: "#F97316",
    orangeLight: "#FEF3C7",
    red: "#F87171",
    redLight: "#FEF2F2",
    purple: "#8B5CF6",
    purpleLight: "#E0E7FF",
    indigo: "#4F46E5",
    indigoLight: "#C7D2FE",
    sky: "#0284C7",
    skyLight: "#F0F9FF",
    slate: "#64748b",
    slateLight: "#F1F5F9",
    slateDark: "#cbd5e1",
    emerald: "#10B981",
    emeraldLight: "#d1fae5",
    emeraldDark: "#6ee7b7",
    amber: "#FBBF24",
    amberLight: "#FEF3C7",
  },
};

export default Colors;

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;
