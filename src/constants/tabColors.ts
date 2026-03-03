export const TAB_COLORS = {
  focused: {
    dark: '#E2E8F0',
    light: '#1E2235',
  },
  unfocused: {
    dark: '#94A3B8',
    light: '#64748B',
  },
} as const;

type TabVariant = 'segmented' | 'bottom';

interface TabVisualConfigParams {
  isDark: boolean;
  isAndroid: boolean;
  isIOS?: boolean;
  variant: TabVariant;
}

interface TabVisualConfig {
  blurIntensity: number;
  tint: 'light' | 'dark';
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  shadowOpacity: number;
  elevation: number;
}

export function getTabColors(isDark: boolean) {
  return {
    focusedColor: isDark ? TAB_COLORS.focused.dark : TAB_COLORS.focused.light,
    unfocusedColor: isDark ? TAB_COLORS.unfocused.dark : TAB_COLORS.unfocused.light,
  };
}

export function getTabLabelColor(isDark: boolean, isFocused: boolean) {
  const { focusedColor, unfocusedColor } = getTabColors(isDark);
  return isFocused ? focusedColor : unfocusedColor;
}

export function getTabIndicatorColor(isDark: boolean) {
  return isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(148, 163, 184, 0.30)';
}

export function getTabVisualConfig({
  isDark,
  isAndroid,
  isIOS = false,
  variant,
}: TabVisualConfigParams): TabVisualConfig {
  const tint: TabVisualConfig['tint'] = isDark ? 'dark' : 'light';
  const borderColor = isDark ? 'rgba(48, 54, 61, 0.90)' : 'rgba(148, 163, 184, 0.22)';

  if (variant === 'segmented') {
    return {
      blurIntensity: isAndroid ? 28 : 95,
      tint,
      backgroundColor: isAndroid
        ? isDark
          ? 'rgba(28, 33, 40, 0.98)'
          : 'rgba(255, 255, 255, 0.96)'
        : isDark
          ? 'rgba(28, 33, 40, 0.90)'
          : 'rgba(255, 255, 255, 0.55)',
      borderWidth: isIOS ? 0 : 1,
      borderColor,
      shadowOpacity: isAndroid ? 0 : 0.1,
      elevation: isAndroid ? 0 : 4,
    };
  }

  return {
    blurIntensity: isAndroid ? 20 : 100,
    tint,
    backgroundColor: isAndroid
      ? isDark
        ? 'rgba(28, 33, 40, 0.98)'
        : 'rgba(255, 255, 255, 0.82)'
      : isDark
        ? 'rgba(28, 33, 40, 0.90)'
        : 'rgba(255, 255, 255, 0.60)',
    borderWidth: isIOS ? 0 : 1,
    borderColor,
    shadowOpacity: 0.1,
    elevation: 8,
  };
}
