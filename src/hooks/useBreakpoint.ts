import { Platform, useWindowDimensions } from 'react-native';

/**
 * Tailwind-aligned breakpoints (matches tailwind.config.js `screens`).
 * Used for layout decisions that cannot be expressed with NativeWind classes alone,
 * e.g. deciding which structural shell to render.
 *
 * Prefer NativeWind `md:` / `lg:` classes inside component JSX.
 * Use this hook only for structural branching (e.g. show sidebar vs tab bar).
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export interface BreakpointInfo {
  /** Raw window width in logical pixels */
  width: number;
  /** Raw window height in logical pixels */
  height: number;
  /** Current largest matching breakpoint */
  current: Breakpoint | 'xs';
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  /**
   * True when running on web AND width >= md (768px).
   * Use this to decide between the mobile tab-bar layout and the
   * desktop sidebar layout. Covers both tablet and desktop.
   */
  isDesktopWeb: boolean;
}

/**
 * Returns reactive breakpoint information.
 *
 * @example
 * const { isDesktopWeb } = useBreakpoint();
 * if (isDesktopWeb) return <DesktopShell />;
 */
export function useBreakpoint(): BreakpointInfo {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const isSm = width >= BREAKPOINTS.sm;
  const isMd = width >= BREAKPOINTS.md;
  const isLg = width >= BREAKPOINTS.lg;
  const isXl = width >= BREAKPOINTS.xl;
  const is2xl = width >= BREAKPOINTS['2xl'];

  let current: Breakpoint | 'xs' = 'xs';
  if (is2xl) current = '2xl';
  else if (isXl) current = 'xl';
  else if (isLg) current = 'lg';
  else if (isMd) current = 'md';
  else if (isSm) current = 'sm';

  return {
    width,
    height,
    current,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    isDesktopWeb: isWeb && isMd,
  };
}
