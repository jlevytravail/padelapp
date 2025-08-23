import React from 'react';
import { View, Text, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../themes';

interface AvatarProps {
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  gradient?: string[];
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = '',
  size = 'medium',
  gradient,
  style,
  textColor = theme.colors.text.inverse,
}) => {
  const sizeMap = {
    small: 32,
    medium: 40,
    large: 56,
    xlarge: 80,
  };

  const textSizeMap = {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 28,
  };

  const avatarSize = sizeMap[size];
  const textSize = textSizeMap[size];

  // Générer les initiales
  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Générer un dégradé basé sur le nom
  const generateGradient = (name: string): string[] => {
    const colors = [
      ['#FF6B6B', '#FF8E8E'],
      ['#4ECDC4', '#44A08D'],
      ['#45B7D1', '#96C6EA'],
      ['#FFA07A', '#FF7F50'],
      ['#98D8C8', '#F7DC6F'],
      ['#BB8FCE', '#85C1E9'],
      ['#F8C471', '#F7DC6F'],
      ['#85C1E9', '#AED6F1'],
    ];

    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const avatarStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gradient ? 'transparent' : theme.colors.neutral[400],
  };

  const textStyle = {
    fontSize: textSize,
    fontWeight: '600' as const,
    color: textColor,
  };

  const initials = getInitials(name);
  const avatarGradient = gradient || generateGradient(name);

  if (gradient || name) {
    return (
      <LinearGradient
        colors={avatarGradient}
        style={[avatarStyle, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={textStyle}>{initials}</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={[avatarStyle, style]}>
      <Text style={textStyle}>{initials}</Text>
    </View>
  );
};

// Badge component pour les avatars
interface BadgeProps {
  count?: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium';
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  variant = 'primary',
  size = 'medium',
  style,
}) => {
  const sizeMap = {
    small: { width: 16, height: 16, fontSize: 10 },
    medium: { width: 20, height: 20, fontSize: 12 },
  };

  const colorMap = {
    primary: theme.colors.primary[500],
    success: theme.colors.success[500],
    warning: theme.colors.warning[500],
    error: theme.colors.error[500],
  };

  const currentSize = sizeMap[size];

  const badgeStyle: ViewStyle = {
    ...currentSize,
    borderRadius: currentSize.width / 2,
    backgroundColor: colorMap[variant],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -4,
    right: -4,
    zIndex: 1,
  };

  const textStyle = {
    fontSize: currentSize.fontSize,
    fontWeight: '600' as const,
    color: theme.colors.text.inverse,
  };

  if (!count || count === 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View style={[badgeStyle, style]}>
      <Text style={textStyle}>{displayCount}</Text>
    </View>
  );
};