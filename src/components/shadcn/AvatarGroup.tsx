import React, { Children } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { Avatar } from '../ui';
import { theme } from '../../themes';

export interface AvatarGroupProps {
  children: React.ReactElement[];
  variant?: 'motion' | 'css' | 'stack';
  invertOverlap?: boolean;
  animate?: boolean;
  size?: 'small' | 'medium' | 'large';
  maxCount?: number;
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  variant = 'stack',
  invertOverlap = false,
  animate = false,
  size = 'medium',
  maxCount,
  style,
}) => {
  const getAvatarSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 56;
      default: return 40;
    }
  };

  const getOverlapOffset = () => {
    switch (size) {
      case 'small': return -8;
      case 'large': return -12;
      default: return -10;
    }
  };

  const avatarSize = getAvatarSize();
  const overlapOffset = getOverlapOffset();

  // Limiter le nombre d'avatars si maxCount est défini
  const visibleChildren = maxCount 
    ? Children.toArray(children).slice(0, maxCount)
    : Children.toArray(children);

  const remainingCount = maxCount && children.length > maxCount 
    ? children.length - maxCount 
    : 0;

  const renderStackVariant = () => (
    <View style={[styles.stackContainer, style]}>
      {visibleChildren.map((child, index) => {
        const zIndex = invertOverlap ? children.length - index : index;
        const marginLeft = index > 0 ? overlapOffset : 0;

        return (
          <View
            key={index}
            style={[
              styles.stackItem,
              {
                zIndex,
                marginLeft,
              },
              animate && styles.animatedItem,
            ]}
          >
            {React.cloneElement(child as React.ReactElement, {
              size: avatarSize,
            })}
          </View>
        );
      })}
      
      {remainingCount > 0 && (
        <View
          style={[
            styles.stackItem,
            styles.remainingCount,
            {
              marginLeft: overlapOffset,
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: theme.colors.neutral[200],
            },
          ]}
        >
          <Avatar
            name={`+${remainingCount}`}
            size={avatarSize}
            style={styles.remainingAvatar}
          />
        </View>
      )}
    </View>
  );

  const renderMotionVariant = () => (
    <View style={[styles.motionContainer, style]}>
      {visibleChildren.map((child, index) => (
        <MotionAvatarItem key={index} index={index}>
          {React.cloneElement(child as React.ReactElement, {
            size: avatarSize,
          })}
        </MotionAvatarItem>
      ))}
    </View>
  );

  const renderCssVariant = () => (
    <View style={[styles.cssContainer, style]}>
      {visibleChildren.map((child, index) => (
        <CssAvatarItem key={index} index={index}>
          {React.cloneElement(child as React.ReactElement, {
            size: avatarSize,
          })}
        </CssAvatarItem>
      ))}
    </View>
  );

  switch (variant) {
    case 'motion':
      return renderMotionVariant();
    case 'css':
      return renderCssVariant();
    default:
      return renderStackVariant();
  }
};

// Composant pour les avatars avec animation motion
const MotionAvatarItem: React.FC<{ children: React.ReactNode; index: number }> = ({
  children,
  index,
}) => {
  const translateY = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: -8,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.motionItem,
        {
          zIndex: index,
          transform: [{ translateY }, { scale }],
        },
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {children}
    </Animated.View>
  );
};

// Composant pour les avatars avec animation CSS
const CssAvatarItem: React.FC<{ children: React.ReactNode; index: number }> = ({
  children,
  index,
}) => {
  return (
    <View
      style={[
        styles.cssItem,
        {
          zIndex: index,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  stackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackItem: {
    position: 'relative',
  },
  animatedItem: {
    // Styles pour l'animation peuvent être ajoutés ici
  },
  remainingCount: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background.primary,
  },
  remainingAvatar: {
    backgroundColor: theme.colors.neutral[300],
  },
  motionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -theme.spacing.xs,
  },
  motionItem: {
    position: 'relative',
  },
  cssContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -theme.spacing.xs,
  },
  cssItem: {
    position: 'relative',
  },
});