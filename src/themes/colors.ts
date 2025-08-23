export const colors = {
  // Primary Colors - Dégradé bleu-vert sportif
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#4758D6', // Primary
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // Secondary Colors - Orange énergique
  secondary: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF6B35', // Secondary
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  // Success - Vert victoire
  success: {
    50: '#E8F5E8',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Success
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },

  // Warning - Amber alerte
  warning: {
    50: '#FFFDE7',
    100: '#FFF9C4',
    200: '#FFF59D',
    300: '#FFF176',
    400: '#FFEE58',
    500: '#FFC107', // Warning
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },

  // Error - Rouge erreur
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336', // Error
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },

  // Neutral Colors - Gris moderne
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Gradients
  gradients: {
    primary: ['#4758D6', '#00BCD4'],
    secondary: ['#FF6B35', '#FFA726'],
    success: ['#4CAF50', '#81C784'],
    sunset: ['#FF6B35', '#F44336'],
    ocean: ['#00BCD4', '#4758D6'],
    forest: ['#4CAF50', '#2E7D32'],
  },

  // Semantic Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F2F2F7',
    card: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    blur: 'rgba(255, 255, 255, 0.8)',
  },

  text: {
    primary: '#1C1C1E',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    inverse: '#FFFFFF',
    disabled: '#C7C7CC',
  },

  border: {
    primary: '#E5E5EA',
    secondary: '#D1D1D6',
    focus: '#4758D6',
    error: '#F44336',
  },

  // Status Colors
  status: {
    online: '#4CAF50',
    offline: '#9E9E9E',
    away: '#FFC107',
    busy: '#F44336',
  },

  // Sport specific colors
  sport: {
    victory: '#4CAF50',
    defeat: '#F44336',
    draw: '#FFC107',
    court: '#8BC34A',
    ball: '#FFC107',
    racket: '#795548',
  },
};

export type Colors = typeof colors;