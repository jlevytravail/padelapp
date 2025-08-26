import React, { useRef, useCallback, useState } from 'react';
import { 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  Animated, 
  ViewStyle, 
  GestureResponderEvent,
  LayoutChangeEvent 
} from 'react-native';
import { Typography } from '../ui';
import { theme } from '../../themes';

interface Ripple {
  id: number;
  x: number;
  y: number;
  scale: Animated.Value;
  opacity: Animated.Value;
}

export interface RippleButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  rippleColor?: string;
  rippleScale?: number;
  rippleDuration?: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

const getButtonStyle = (variant: string, disabled?: boolean) => {
  const baseStyle = {
    ...styles.button,
    opacity: disabled ? 0.5 : 1,
  };

  switch (variant) {
    case 'default':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.primary[500],
      };
    case 'destructive':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.error[500],
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border.primary,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.neutral[200],
      };
    case 'ghost':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    default:
      return baseStyle;
  }
};

const getSizeStyle = (size: string) => {
  switch (size) {
    case 'sm':
      return {
        height: 36,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.spacing.component.radius.sm,
      };
    case 'lg':
      return {
        height: 48,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.spacing.component.radius.lg,
      };
    case 'icon':
      return {
        width: 40,
        height: 40,
        paddingHorizontal: 0,
        borderRadius: theme.spacing.component.radius.md,
      };
    default:
      return {
        height: 40,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.spacing.component.radius.md,
      };
  }
};

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onPress,
  style,
  rippleColor = theme.colors.text.inverse,
  rippleScale = 10,
  rippleDuration = 600,
  variant = 'default',
  size = 'default',
  disabled = false,
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const buttonRef = useRef<View>(null);
  const scale = useRef(new Animated.Value(1)).current;

  const createRipple = useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return;

      const { locationX, locationY } = event.nativeEvent;
      const rippleScale = Math.max(dimensions.width, dimensions.height) * 0.8;

      const newRipple: Ripple = {
        id: Date.now(),
        x: locationX,
        y: locationY,
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0.5),
      };

      setRipples((prev) => [...prev, newRipple]);

      // Animate ripple
      Animated.parallel([
        Animated.timing(newRipple.scale, {
          toValue: rippleScale,
          duration: rippleDuration,
          useNativeDriver: true,
        }),
        Animated.timing(newRipple.opacity, {
          toValue: 0,
          duration: rippleDuration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      });
    },
    [dimensions, rippleDuration, disabled]
  );

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePress = (event: GestureResponderEvent) => {
    createRipple(event);
    if (onPress) {
      onPress(event);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const buttonStyle = getButtonStyle(variant, disabled);
  const sizeStyle = getSizeStyle(size);

  return (
    <Animated.View
      style={[
        { transform: [{ scale }] },
        style,
      ]}
    >
      <TouchableOpacity
        ref={buttonRef}
        style={[buttonStyle, sizeStyle]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        onLayout={handleLayout}
        disabled={disabled}
        activeOpacity={1}
      >
        {children}
        
        {/* Ripple effects */}
        <View style={StyleSheet.absoluteFillObject}>
          {ripples.map((ripple) => (
            <Animated.View
              key={ripple.id}
              style={[
                styles.ripple,
                {
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  backgroundColor: rippleColor,
                  transform: [{ scale: ripple.scale }],
                  opacity: ripple.opacity,
                },
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});