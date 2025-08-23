import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../themes';
import { Typography } from './Typography';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: string;
  gradient?: string[];
  showLabel?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = theme.colors.neutral[200],
  gradient = theme.colors.gradients.primary,
  showLabel = false,
  label,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const containerStyle: ViewStyle = {
    height,
    backgroundColor,
    borderRadius: height / 2,
    overflow: 'hidden',
  };

  const fillStyle: ViewStyle = {
    height: '100%',
    width: `${clampedProgress}%`,
    borderRadius: height / 2,
  };

  return (
    <View style={style}>
      {showLabel && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
          <Typography variant="caption">{label}</Typography>
          <Typography variant="caption">{`${Math.round(clampedProgress)}%`}</Typography>
        </View>
      )}
      <View style={containerStyle}>
        <LinearGradient
          colors={gradient}
          style={fillStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </View>
  );
};

// Circular Progress Component
interface CircularProgressProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  backgroundColor?: string;
  gradient?: string[];
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  backgroundColor = theme.colors.neutral[200],
  gradient = theme.colors.gradients.primary,
  children,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  const centerStyle: ViewStyle = {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={[centerStyle, style]}>
      {/* SVG implementation would go here for true circular progress */}
      {/* For now, we'll create a simpler circular indicator */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <View
          style={{
            width: size - strokeWidth,
            height: size - strokeWidth,
            borderRadius: (size - strokeWidth) / 2,
            backgroundColor: theme.colors.background.card,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </View>
        
        {/* Progress indicator - simplified version */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: 'transparent',
            borderTopColor: gradient[0],
            transform: [{ rotate: `${(clampedProgress / 100) * 360}deg` }],
          }}
        />
      </View>
    </View>
  );
};