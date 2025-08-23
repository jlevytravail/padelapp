import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';

// Thème principal qui combine tous les tokens de design
export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  
  // Breakpoints pour le responsive design
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },

  // Z-index scale pour la superposition des éléments
  zIndex: {
    base: 1,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },

  // Timing et easing pour les animations
  animations: {
    timing: {
      fast: 150,
      normal: 250,
      slow: 400,
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },

  // Opacités communes
  opacity: {
    disabled: 0.38,
    inactive: 0.54,
    secondary: 0.74,
    primary: 0.87,
    active: 1,
  },
};

// Types pour TypeScript
export type Theme = typeof theme;
export type ColorTokens = typeof colors;
export type TypographyTokens = typeof typography;
export type SpacingTokens = typeof spacing;
export type ShadowTokens = typeof shadows;

// Export individual tokens
export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { shadows } from './shadows';