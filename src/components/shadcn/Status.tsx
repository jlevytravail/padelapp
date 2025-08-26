import React from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { Typography } from '../ui';
import { theme } from '../../themes';

export type StatusType = 'online' | 'offline' | 'playing' | 'available' | 'busy' | 'away';

export interface StatusProps {
  status: StatusType;
  label?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  style?: ViewStyle;
}

export interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  style?: ViewStyle;
}

export interface StatusLabelProps {
  status: StatusType;
  children?: React.ReactNode;
  style?: any;
}

const getStatusConfig = (status: StatusType) => {
  switch (status) {
    case 'online':
      return {
        color: theme.colors.success[500],
        label: 'En ligne',
        lightColor: theme.colors.success[100],
      };
    case 'offline':
      return {
        color: theme.colors.neutral[500],
        label: 'Hors ligne',
        lightColor: theme.colors.neutral[100],
      };
    case 'playing':
      return {
        color: theme.colors.primary[500],
        label: 'En jeu',
        lightColor: theme.colors.primary[100],
      };
    case 'available':
      return {
        color: theme.colors.success[500],
        label: 'Disponible',
        lightColor: theme.colors.success[100],
      };
    case 'busy':
      return {
        color: theme.colors.error[500],
        label: 'Occupé',
        lightColor: theme.colors.error[100],
      };
    case 'away':
      return {
        color: theme.colors.warning[500],
        label: 'Absent',
        lightColor: theme.colors.warning[100],
      };
    default:
      return {
        color: theme.colors.neutral[500],
        label: 'Inconnu',
        lightColor: theme.colors.neutral[100],
      };
  }
};

const getSizeConfig = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        indicatorSize: 8,
        pulseSize: 12,
        fontSize: 12,
      };
    case 'lg':
      return {
        indicatorSize: 12,
        pulseSize: 18,
        fontSize: 16,
      };
    default:
      return {
        indicatorSize: 10,
        pulseSize: 15,
        fontSize: 14,
      };
  }
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  animated = true,
  style,
}) => {
  const statusConfig = getStatusConfig(status);
  const sizeConfig = getSizeConfig(size);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (animated && (status === 'online' || status === 'playing' || status === 'available')) {
      const pulse = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);

      const loop = Animated.loop(pulse);
      loop.start();

      return () => loop.stop();
    }
  }, [animated, status, pulseAnim]);

  return (
    <View style={[styles.indicatorContainer, style]}>
      {animated && (status === 'online' || status === 'playing' || status === 'available') && (
        <Animated.View
          style={[
            styles.pulseIndicator,
            {
              width: sizeConfig.pulseSize,
              height: sizeConfig.pulseSize,
              borderRadius: sizeConfig.pulseSize / 2,
              backgroundColor: statusConfig.color,
              transform: [{ scale: pulseAnim }],
              opacity: 0.4,
            },
          ]}
        />
      )}
      <View
        style={[
          styles.indicator,
          {
            width: sizeConfig.indicatorSize,
            height: sizeConfig.indicatorSize,
            borderRadius: sizeConfig.indicatorSize / 2,
            backgroundColor: statusConfig.color,
          },
        ]}
      />
    </View>
  );
};

export const StatusLabel: React.FC<StatusLabelProps> = ({
  status,
  children,
  style,
}) => {
  const statusConfig = getStatusConfig(status);

  return (
    <Typography
      variant="caption"
      style={[
        { color: theme.colors.text.secondary },
        style,
      ]}
    >
      {children || statusConfig.label}
    </Typography>
  );
};

export const Status: React.FC<StatusProps> = ({
  status,
  label,
  showLabel = true,
  size = 'md',
  animated = true,
  style,
}) => {
  const statusConfig = getStatusConfig(status);
  const sizeConfig = getSizeConfig(size);

  return (
    <View style={[styles.container, style]}>
      <StatusIndicator
        status={status}
        size={size}
        animated={animated}
      />
      
      {showLabel && (
        <StatusLabel status={status} style={{ fontSize: sizeConfig.fontSize }}>
          {label}
        </StatusLabel>
      )}
    </View>
  );
};

// Badge de statut avec style shadcn
export interface StatusBadgeProps {
  status: StatusType;
  children?: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'outline';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  style,
  variant = 'default',
}) => {
  const statusConfig = getStatusConfig(status);

  const badgeStyle = variant === 'outline' 
    ? {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: statusConfig.color,
      }
    : {
        backgroundColor: statusConfig.lightColor,
      };

  return (
    <View style={[styles.badge, badgeStyle, style]}>
      <StatusIndicator 
        status={status} 
        size="sm" 
        animated={false}
        style={styles.badgeIndicator} 
      />
      <Typography 
        variant="caption" 
        style={[
          styles.badgeText,
          { color: statusConfig.color }
        ]}
      >
        {children || statusConfig.label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'relative',
    zIndex: 2,
  },
  pulseIndicator: {
    position: 'absolute',
    zIndex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.component.radius.md,
    gap: theme.spacing.xs,
  },
  badgeIndicator: {
    marginRight: 0,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});