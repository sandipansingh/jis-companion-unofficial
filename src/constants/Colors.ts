const Colors = {
  light: {
    base: '#FAFAFA',
    surface: '#FFFFFF',
    elevated: '#F1F5FB',
    overlay: '#E8EDF7',

    // Text colors
    text: '#0F172A', // ink.950
    textSecondary: '#475569', // ink.700
    textTertiary: '#94A3B8', // ink.500
    textInverse: '#FFFFFF',

    // Border
    border: '#E2E8F0', // ink.300

    // Primary/Brand
    primary: '#2B5BDB', // cobalt.500
    primaryLight: '#EEF3FF', // cobalt.50

    // CTA (non-blue)
    cta: '#334155', // ink.800
    onCta: '#FFFFFF',
    ctaSoft: '#E2E8F0', // ink.300

    // Action alias (backward compatibility)
    action: '#334155',
    onAction: '#FFFFFF',

    // System
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    violet: '#8B5CF6',

    // Status semantic variants (for attendance & status badges)
    successBg: '#ECFDF5',
    successText: '#065F46',
    successStrong: '#059669',
    warningBg: '#FFFBEB',
    warningText: '#D97706',
    warningStrong: '#D97706',
    dangerBg: '#FEF2F2',
    dangerText: '#991B1B',
    dangerStrong: '#DC2626',

    cobalt: {
      50: '#EEF3FF',
      100: '#D8E5FF',
      200: '#B3CCFE',
      300: '#7DAAF9',
      400: '#4C7EF3',
      500: '#2B5BDB',
      600: '#1B4FD8',
      700: '#1240BE',
      800: '#0D3299',
      900: '#0A2672',
    },
    ink: {
      950: '#0F172A',
      900: '#1E2235',
      800: '#334155',
      700: '#475569',
      600: '#64748B',
      500: '#94A3B8',
      400: '#CBD5E1',
      300: '#E2E8F0',
      200: '#F1F5F9',
      100: '#F8FAFC',
    },
  },
  dark: {
    base: '#000000',
    surface: '#161B22', // canonical dark surface
    elevated: '#1C2128', // harmonious tonal step above surface
    overlay: '#22272E', // tonal step for modal / sheet layering

    // Text colors
    text: '#F8FAFC', // ink.100
    textSecondary: '#CBD5E1', // ink.400
    textTertiary: '#94A3B8', // ink.500
    textInverse: '#0F172A',

    // Border
    border: '#30363D', // subtle border, coherent with surface family

    // Primary/Brand
    primary: '#4C7EF3', // cobalt.400 (lighter for dark mode)
    primaryLight: '#0A2672', // cobalt.900 (darker background)

    // CTA (non-blue)
    cta: '#E2E8F0', // ink.300
    onCta: '#0F172A',
    ctaSoft: '#30363D', // dark border tone

    // Action alias (backward compatibility)
    action: '#E2E8F0',
    onAction: '#0F172A',

    // System
    success: '#34D399', // success.400
    warning: '#FBBF24', // warning.400
    danger: '#F87171', // danger.400
    info: '#60A5FA', // info.400
    violet: '#A78BFA', // violet.400

    // Status semantic variants (for attendance & status badges)
    successBg: '#064E3B',
    successText: '#A7F3D0',
    successStrong: '#059669',
    warningBg: '#451A03',
    warningText: '#FBBF24',
    warningStrong: '#D97706',
    dangerBg: '#500707',
    dangerText: '#FECACA',
    dangerStrong: '#991B1B',

    cobalt: {
      50: '#EEF3FF',
      100: '#D8E5FF',
      200: '#B3CCFE',
      300: '#7DAAF9',
      400: '#4C7EF3',
      500: '#2B5BDB',
      600: '#1B4FD8',
      700: '#1240BE',
      800: '#0D3299',
      900: '#0A2672',
    },
    ink: {
      950: '#0F172A',
      900: '#1E2235',
      800: '#334155',
      700: '#475569',
      600: '#64748B',
      500: '#94A3B8',
      400: '#CBD5E1',
      300: '#E2E8F0',
      200: '#F1F5F9',
      100: '#F8FAFC',
    },
  },
};

export default Colors;
