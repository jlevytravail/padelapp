// Spacing system basé sur un grid de 4px (base unit)
export const spacing = {
  // Base units - Multiples de 4px
  0: 0,
  1: 4,     // 0.25rem
  2: 8,     // 0.5rem
  3: 12,    // 0.75rem
  4: 16,    // 1rem - Base standard
  5: 20,    // 1.25rem
  6: 24,    // 1.5rem
  7: 28,    // 1.75rem
  8: 32,    // 2rem
  9: 36,    // 2.25rem
  10: 40,   // 2.5rem
  11: 44,   // 2.75rem
  12: 48,   // 3rem
  14: 56,   // 3.5rem
  16: 64,   // 4rem
  20: 80,   // 5rem
  24: 96,   // 6rem
  28: 112,  // 7rem
  32: 128,  // 8rem
  36: 144,  // 9rem
  40: 160,  // 10rem
  44: 176,  // 11rem
  48: 192,  // 12rem
  52: 208,  // 13rem
  56: 224,  // 14rem
  60: 240,  // 15rem
  64: 256,  // 16rem
  72: 288,  // 18rem
  80: 320,  // 20rem
  96: 384,  // 24rem

  // Semantic Spacing - Noms sémantiques pour une meilleure lisibilité
  xs: 4,     // Extra small
  sm: 8,     // Small
  md: 16,    // Medium - Standard
  lg: 24,    // Large
  xl: 32,    // Extra large
  '2xl': 48, // 2x Extra large
  '3xl': 64, // 3x Extra large
  '4xl': 80, // 4x Extra large
  '5xl': 96, // 5x Extra large

  // Component Specific Spacing
  component: {
    // Padding internal des composants
    padding: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    
    // Margins entre composants
    margin: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },

    // Gaps dans les layouts flex/grid
    gap: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },

    // Border radius
    radius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      '3xl': 32,
      full: 9999,
    },

    // Heights communes
    height: {
      button: 48,
      input: 44,
      card: 80,
      header: 56,
      tabBar: 64,
      fab: 56,
    },
  },

  // Layout Spacing - Espacement des sections
  layout: {
    // Screen padding
    screen: {
      horizontal: 16,
      vertical: 20,
    },
    
    // Section spacing
    section: {
      small: 16,
      medium: 24,
      large: 32,
      xlarge: 40,
    },

    // Container spacing
    container: {
      padding: 16,
      margin: 16,
      gap: 16,
    },
  },

  // Safe Area - Gestion des zones sécurisées
  safeArea: {
    top: 44,     // Status bar height (iPhone)
    bottom: 34,  // Home indicator height (iPhone X+)
    sides: 0,    // Side safe areas
  },
};

export type Spacing = typeof spacing;