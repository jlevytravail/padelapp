export const typography = {
  // Font Family
  fontFamily: {
    regular: 'System', // SF Pro on iOS, Roboto on Android
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Font Sizes - Scale harmonique basée sur 16px
  fontSize: {
    xs: 12,    // Captions, labels
    sm: 14,    // Small text, badges
    base: 16,  // Body text, buttons
    lg: 18,    // Large text, subtitles
    xl: 20,    // Card titles
    '2xl': 24, // Section headers
    '3xl': 28, // Page titles
    '4xl': 32, // Hero titles
    '5xl': 36, // Display headers
    '6xl': 48, // Large displays
  },

  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Line Heights - Relatifs aux tailles de police
  lineHeight: {
    xs: 16,    // 12px * 1.33
    sm: 20,    // 14px * 1.43
    base: 24,  // 16px * 1.5
    lg: 28,    // 18px * 1.56
    xl: 28,    // 20px * 1.4
    '2xl': 32, // 24px * 1.33
    '3xl': 36, // 28px * 1.29
    '4xl': 40, // 32px * 1.25
    '5xl': 44, // 36px * 1.22
    '6xl': 56, // 48px * 1.17
  },

  // Text Styles Prédéfinis
  styles: {
    // Headers
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },

    // Body Text
    bodyLarge: {
      fontSize: 18,
      fontWeight: '400' as const,
      lineHeight: 28,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },

    // Special Text
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 1,
      textTransform: 'uppercase' as const,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },

    // Button Text
    buttonLarge: {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 20,
      letterSpacing: 0.5,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
    },

    // Scores et Statistiques
    scoreLarge: {
      fontSize: 48,
      fontWeight: '800' as const,
      lineHeight: 56,
      letterSpacing: -1,
    },
    scoreMedium: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    scoreSmall: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: 0,
    },

    // Labels et Badges
    label: {
      fontSize: 12,
      fontWeight: '500' as const,
      lineHeight: 16,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
    badge: {
      fontSize: 10,
      fontWeight: '600' as const,
      lineHeight: 12,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as const,
    },
  },
};

export type Typography = typeof typography;