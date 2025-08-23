import React from 'react';
import { TouchableOpacity, ViewStyle, TextStyle, StyleProp, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../themes';
import { Typography } from './Typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  gradient?: string[];
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  gradient,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;

  const sizeStyles: Record<string, { padding: number; height: number; textVariant: keyof typeof theme.typography.styles }> = {
    small: {
      padding: theme.spacing.sm,
      height: 40,
      textVariant: 'buttonSmall',
    },
    medium: {
      padding: theme.spacing.md,
      height: theme.spacing.component.height.button,
      textVariant: 'button',
    },
    large: {
      padding: theme.spacing.lg,
      height: 56,
      textVariant: 'buttonLarge',
    },
  };

  const currentSize = sizeStyles[size];

  const baseStyle: ViewStyle = {
    height: currentSize.height,
    paddingHorizontal: currentSize.padding,
    borderRadius: theme.spacing.component.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    width: fullWidth ? '100%' : undefined,
    opacity: isDisabled ? theme.opacity.disabled : 1,
    ...theme.shadows.ios.sm,
    elevation: theme.shadows.android.sm,
  };

  const variantStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: {
        backgroundColor: theme.colors.primary[500],
      },
      text: {
        color: theme.colors.text.inverse,
      },
    },
    secondary: {
      container: {
        backgroundColor: theme.colors.secondary[500],
      },
      text: {
        color: theme.colors.text.inverse,
      },
    },
    outlined: {
      container: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary[500],
      },
      text: {
        color: theme.colors.primary[500],
      },
    },
    ghost: {
      container: {
        backgroundColor: 'transparent',
      },
      text: {
        color: theme.colors.primary[500],
      },
    },
    gradient: {
      container: {
        backgroundColor: 'transparent',
      },
      text: {
        color: theme.colors.text.inverse,
      },
    },
  };

  const currentVariant = variantStyles[variant];
  const buttonStyle = [baseStyle, currentVariant.container, style];
  const buttonTextStyle = [currentVariant.text, textStyle];

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outlined' || variant === 'ghost' ? theme.colors.primary[500] : theme.colors.text.inverse} 
        />
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {!loading && (
        <Typography variant={currentSize.textVariant} style={buttonTextStyle}>
          {title}
        </Typography>
      )}
      {!loading && icon && iconPosition === 'right' && icon}
    </>
  );

  if (variant === 'gradient' && gradient) {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.8}>
        <LinearGradient
          colors={gradient}
          style={buttonStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Floating Action Button spécialisé
interface FABProps {
  onPress: () => void;
  icon: React.ReactNode;
  gradient?: string[];
  style?: StyleProp<ViewStyle>;
}

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon,
  gradient = theme.colors.gradients.primary,
  style,
}) => {
  const fabStyle: ViewStyle = {
    width: theme.spacing.component.height.fab,
    height: theme.spacing.component.height.fab,
    borderRadius: theme.spacing.component.radius.full,
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.components.fab,
    elevation: theme.shadows.android.lg,
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={gradient}
        style={[fabStyle, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {icon}
      </LinearGradient>
    </TouchableOpacity>
  );
};