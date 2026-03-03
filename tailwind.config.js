/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    /**
     * Explicit breakpoints — kept in sync with src/hooks/useBreakpoint.ts
     * so that NativeWind class prefixes (md:, lg:, xl:) align exactly
     * with the structural branching done in ResponsiveLayout.
     */
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px', // desktop layout switch point
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      /**
       * Layout tokens for the desktop shell.
       * Use these in className strings:
       *   w-sidebar      → 240px fixed sidebar width
       *   max-w-content  → 1280px default content constraint
       *   max-w-content-wide → 1440px for spacious dashboards
       */
      width: {
        sidebar: '240px',
      },
      maxWidth: {
        content: '1280px',
        'content-wide': '1440px',
        'content-narrow': '960px',
      },
      colors: {
        base: 'rgb(var(--color-base) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        elevated: 'rgb(var(--color-elevated) / <alpha-value>)',
        overlay: 'rgb(var(--color-overlay) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
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
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
          dark: '#2563EB',
        },
      },

      fontFamily: {
        // Display — heavier Inter weights for headings and section titles
        display: ['Inter_700Bold'],
        'display-bold': ['Inter_700Bold'],
        'display-md': ['Inter_600SemiBold'],
        'display-reg': ['Inter_400Regular'],

        // Body / UI — Inter across all weights
        sans: ['Inter_400Regular'],
        'sans-md': ['Inter_500Medium'],
        'sans-semi': ['Inter_600SemiBold'],
        'sans-bold': ['Inter_700Bold'],

        // Monospace — JetBrains Mono for code / fixed-width data
        mono: ['JetBrainsMono_400Regular'],
      },

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      boxShadow: {
        xs: '0 1px 2px rgba(15,23,42,0.04)',
        sm: '0 2px 6px rgba(15,23,42,0.06)',
        card: '0 4px 16px rgba(15,23,42,0.08)',
        float: '0 8px 32px rgba(15,23,42,0.12)',
        modal: '0 16px 48px rgba(15,23,42,0.18)',
        cobalt: '0 4px 18px rgba(27,79,216,0.28)',
      },

      spacing: {
        safe: 'env(safe-area-inset-bottom)',
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
};
