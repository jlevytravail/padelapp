import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/Ionicons';
import { Typography } from '../ui';
import { theme } from '../../themes';

const { width: screenWidth } = Dimensions.get('window');

export interface DockItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
  badge?: number;
  isActive?: boolean;
}

export interface DockProps {
  items: DockItem[];
  style?: ViewStyle;
  position?: 'bottom' | 'top';
  variant?: 'floating' | 'fixed' | 'minimal';
  showLabels?: boolean;
  maxWidth?: number;
}

export const Dock: React.FC<DockProps> = ({
  items,
  style,
  position = 'bottom',
  variant = 'floating',
  showLabels = false,
  maxWidth = screenWidth - 40,
}) => {
  const [pressedItem, setPressedItem] = useState<string | null>(null);
  const scaleValues = useRef(
    items.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  const handlePressIn = (itemId: string) => {
    setPressedItem(itemId);
    Animated.spring(scaleValues[itemId], {
      toValue: 1.2,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const handlePressOut = (itemId: string) => {
    setPressedItem(null);
    Animated.spring(scaleValues[itemId], {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 8,
    }).start();
  };

  const renderDockItem = (item: DockItem, index: number) => (
    <Animated.View
      key={item.id}
      style={[
        styles.dockItem,
        {
          transform: [{ scale: scaleValues[item.id] }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.dockButton,
          item.isActive && styles.activeDockButton,
          variant === 'minimal' && styles.minimalDockButton,
        ]}
        onPressIn={() => handlePressIn(item.id)}
        onPressOut={() => handlePressOut(item.id)}
        onPress={item.onPress}
        activeOpacity={0.9}
      >
        {/* Indicateur actif */}
        {item.isActive && variant === 'floating' && (
          <View style={styles.activeIndicator} />
        )}

        {/* Icône */}
        <View style={styles.iconContainer}>
          <Icon
            name={item.icon}
            size={24}
            color={
              item.isActive 
                ? theme.colors.primary[500] 
                : variant === 'floating' 
                ? theme.colors.text.inverse 
                : theme.colors.text.primary
            }
          />
          
          {/* Badge */}
          {item.badge && item.badge > 0 && (
            <View style={styles.badge}>
              <Typography
                variant="caption"
                style={styles.badgeText}
              >
                {item.badge > 99 ? '99+' : item.badge.toString()}
              </Typography>
            </View>
          )}
        </View>

        {/* Label (si activé) */}
        {showLabels && (
          <Typography
            variant="caption"
            style={[
              styles.dockLabel,
              {
                color: item.isActive 
                  ? theme.colors.primary[500] 
                  : variant === 'floating'
                  ? theme.colors.text.inverse
                  : theme.colors.text.secondary
              }
            ]}
          >
            {item.label}
          </Typography>
        )}

        {/* Tooltip au hover */}
        {pressedItem === item.id && !showLabels && (
          <Animated.View style={styles.tooltip}>
            <View style={styles.tooltipContent}>
              <Typography variant="caption" style={styles.tooltipText}>
                {item.label}
              </Typography>
            </View>
            <View style={styles.tooltipArrow} />
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const getDockStyle = () => {
    const baseStyle = [
      styles.dock,
      position === 'top' ? styles.topDock : styles.bottomDock,
    ];

    switch (variant) {
      case 'floating':
        return [...baseStyle, styles.floatingDock, { maxWidth }];
      case 'fixed':
        return [...baseStyle, styles.fixedDock, { width: screenWidth }];
      case 'minimal':
        return [...baseStyle, styles.minimalDock, { maxWidth }];
      default:
        return [...baseStyle, { maxWidth }];
    }
  };

  const renderDockContent = () => (
    <View style={[styles.dockContent, showLabels && styles.labelDockContent]}>
      {items.map(renderDockItem)}
    </View>
  );

  return (
    <View style={[getDockStyle(), style]}>
      {variant === 'floating' ? (
        <BlurView intensity={80} style={styles.blurContainer}>
          {renderDockContent()}
        </BlurView>
      ) : (
        renderDockContent()
      )}
    </View>
  );
};

// Composant Dock flottant avec effet magnétique
export const MagneticDock: React.FC<DockProps> = ({ items, style, ...props }) => {
  const panX = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
    },
    onPanResponderGrant: () => {
      setIsDragging(true);
    },
    onPanResponderMove: (_, gestureState) => {
      panX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      setIsDragging(false);
      
      // Snap vers la gauche ou la droite
      const screenWidth = Dimensions.get('window').width;
      const threshold = screenWidth / 4;
      
      if (Math.abs(gestureState.dx) > threshold) {
        const targetX = gestureState.dx > 0 ? screenWidth - 80 : 20;
        Animated.spring(panX, {
          toValue: targetX,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      } else {
        Animated.spring(panX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
  });

  return (
    <Animated.View
      style={[
        styles.magneticDock,
        {
          transform: [{ translateX: panX }],
        },
        style,
      ]}
      {...panResponder.panHandlers}
    >
      <Dock 
        items={items} 
        variant="floating" 
        showLabels={false}
        {...props}
      />
      
      {/* Indicateur de glissement */}
      {isDragging && (
        <View style={styles.dragIndicator}>
          <Icon name="move" size={16} color={theme.colors.neutral[400]} />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  bottomDock: {
    bottom: 20,
  },
  topDock: {
    top: 60,
  },
  floatingDock: {
    shadowColor: theme.colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  fixedDock: {
    backgroundColor: theme.colors.background.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    borderRadius: 0,
    left: 0,
    right: 0,
  },
  minimalDock: {
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  blurContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dockContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  labelDockContent: {
    paddingVertical: theme.spacing.sm,
  },
  dockItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDockButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  minimalDockButton: {
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary[500],
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.error[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background.card,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.text.inverse,
  },
  dockLabel: {
    marginTop: theme.spacing.xs,
    fontSize: 10,
    textAlign: 'center',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 8,
    alignItems: 'center',
  },
  tooltipContent: {
    backgroundColor: theme.colors.neutral[800],
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.component.radius.sm,
  },
  tooltipText: {
    color: theme.colors.text.inverse,
    fontSize: 12,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: theme.colors.neutral[800],
    marginTop: -1,
  },
  magneticDock: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  dragIndicator: {
    position: 'absolute',
    top: -20,
    alignSelf: 'center',
    width: 24,
    height: 4,
    backgroundColor: theme.colors.neutral[400],
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});