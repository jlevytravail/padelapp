import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../themes';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  gradient?: string[];
  padding?: keyof typeof theme.spacing;
  borderRadius?: keyof typeof theme.spacing.component.radius;
  shadowLevel?: keyof typeof theme.shadows.ios;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  gradient,
  padding = 'md',
  borderRadius = 'lg',
  shadowLevel = 'sm',
}) => {
  const baseStyle: ViewStyle = {
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing[padding],
    borderRadius: theme.spacing.component.radius[borderRadius],
  };

  const shadowStyle = {
    ...theme.shadows.ios[shadowLevel],
    elevation: theme.shadows.android[shadowLevel],
  };

  const variantStyles: Record<string, ViewStyle> = {
    default: {
      ...baseStyle,
    },
    elevated: {
      ...baseStyle,
      ...shadowStyle,
    },
    outlined: {
      ...baseStyle,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
    },
    gradient: {
      ...baseStyle,
      backgroundColor: 'transparent',
    },
  };

  const cardStyle = [variantStyles[variant], style];

  if (variant === 'gradient' && gradient) {
    return (
      <LinearGradient
        colors={gradient}
        style={cardStyle}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

// Composants de cartes spécialisés
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  gradient?: string[];
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient,
}) => {
  const trendColor = trend === 'up' 
    ? theme.colors.success[500] 
    : trend === 'down' 
    ? theme.colors.error[500] 
    : theme.colors.neutral[500];

  return (
    <Card 
      variant={gradient ? 'gradient' : 'elevated'} 
      gradient={gradient}
      style={{ alignItems: 'center', minHeight: 100 }}
    >
      {icon && (
        <View style={{ marginBottom: theme.spacing.sm }}>
          {icon}
        </View>
      )}
      
      <Typography variant="caption" color={gradient ? theme.colors.text.inverse : theme.colors.text.secondary}>
        {title}
      </Typography>
      
      <Typography 
        variant="scoreMedium" 
        color={gradient ? theme.colors.text.inverse : theme.colors.primary[500]}
        style={{ marginVertical: theme.spacing.xs }}
      >
        {value}
      </Typography>
      
      {subtitle && (
        <Typography 
          variant="caption" 
          color={gradient ? theme.colors.text.inverse : trendColor}
        >
          {subtitle}
        </Typography>
      )}
    </Card>
  );
};

// Import Typography pour éviter l'erreur
import { Typography } from './Typography';