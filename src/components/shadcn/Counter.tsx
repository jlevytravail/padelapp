import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Animated, TouchableOpacity } from 'react-native';
import { Typography } from '../ui';
import { theme } from '../../themes';
import Icon from 'react-native-vector-icons/Ionicons';

export interface CounterProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'minimal' | 'outlined';
  style?: ViewStyle;
  disabled?: boolean;
  showButtons?: boolean;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 999,
  step = 1,
  size = 'default',
  variant = 'default',
  style,
  disabled = false,
  showButtons = true,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const slideValue = useRef(new Animated.Value(0)).current;
  const previousValue = useRef(value);

  // Animation quand la valeur change
  useEffect(() => {
    if (previousValue.current !== value) {
      const direction = value > previousValue.current ? 1 : -1;
      
      Animated.sequence([
        Animated.parallel([
          Animated.timing(slideValue, {
            toValue: -direction * 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1.1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(slideValue, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
        ]),
      ]).start();
      
      previousValue.current = value;
    }
  }, [value, slideValue, scaleValue]);

  const increment = () => {
    if (disabled || value >= max) return;
    onValueChange(Math.min(max, value + step));
  };

  const decrement = () => {
    if (disabled || value <= min) return;
    onValueChange(Math.max(min, value - step));
  };

  const getContainerStyle = () => {
    const baseStyle = styles.container;
    
    switch (variant) {
      case 'minimal':
        return [baseStyle, styles.minimal];
      case 'outlined':
        return [baseStyle, styles.outlined];
      default:
        return [baseStyle, styles.default];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.smallContainer,
          button: styles.smallButton,
          text: { fontSize: 16 },
        };
      case 'lg':
        return {
          container: styles.largeContainer,
          button: styles.largeButton,
          text: { fontSize: 24 },
        };
      default:
        return {
          container: styles.defaultContainer,
          button: styles.defaultButton,
          text: { fontSize: 20 },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  return (
    <View style={[getContainerStyle(), sizeStyles.container, style]}>
      {showButtons && (
        <TouchableOpacity
          style={[
            styles.button,
            sizeStyles.button,
            !canDecrement && styles.disabledButton,
          ]}
          onPress={decrement}
          disabled={!canDecrement}
        >
          <Icon 
            name="remove" 
            size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} 
            color={canDecrement ? theme.colors.text.primary : theme.colors.text.disabled} 
          />
        </TouchableOpacity>
      )}

      <Animated.View
        style={[
          styles.valueContainer,
          {
            transform: [
              { translateY: slideValue },
              { scale: scaleValue },
            ],
          },
        ]}
      >
        <Typography
          variant="h3"
          style={[
            styles.valueText,
            sizeStyles.text,
            disabled && styles.disabledText,
          ]}
        >
          {value}
        </Typography>
      </Animated.View>

      {showButtons && (
        <TouchableOpacity
          style={[
            styles.button,
            sizeStyles.button,
            !canIncrement && styles.disabledButton,
          ]}
          onPress={increment}
          disabled={!canIncrement}
        >
          <Icon 
            name="add" 
            size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} 
            color={canIncrement ? theme.colors.text.primary : theme.colors.text.disabled} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Composant SlidingNumber pour affichage animé des nombres
export interface SlidingNumberProps {
  value: number;
  style?: ViewStyle;
  textStyle?: any;
}

export const SlidingNumber: React.FC<SlidingNumberProps> = ({ 
  value, 
  style, 
  textStyle 
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value) {
      const direction = value > previousValue.current ? 1 : -1;
      
      Animated.sequence([
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: direction * 20,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }),
        ]),
      ]).start();

      previousValue.current = value;
    }
  }, [value, slideAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <Typography variant="h2" style={textStyle}>
        {value}
      </Typography>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.spacing.component.radius.lg,
  },
  default: {
    backgroundColor: theme.colors.neutral[100],
    padding: theme.spacing.xs,
  },
  minimal: {
    backgroundColor: 'transparent',
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.xs,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.spacing.component.radius.md,
    shadowColor: theme.colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral[100],
    opacity: 0.5,
  },
  valueContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
    minWidth: 40,
  },
  disabledText: {
    color: theme.colors.text.disabled,
  },
  smallContainer: {
    gap: theme.spacing.xs,
  },
  defaultContainer: {
    gap: theme.spacing.sm,
  },
  largeContainer: {
    gap: theme.spacing.md,
  },
  smallButton: {
    width: 28,
    height: 28,
  },
  defaultButton: {
    width: 36,
    height: 36,
  },
  largeButton: {
    width: 44,
    height: 44,
  },
});