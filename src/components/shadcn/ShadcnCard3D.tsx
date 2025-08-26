import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, PanResponder, Easing, ViewStyle } from 'react-native';
import { theme } from '../../themes';

interface MouseEnterContextValue {
  isMouseEntered: boolean;
  setIsMouseEntered: (value: boolean) => void;
}

const MouseEnterContext = createContext<MouseEnterContextValue | undefined>(undefined);

export interface CardContainerProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  enable3D?: boolean;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  style,
  containerStyle,
  enable3D = true,
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const rotateX = useRef(new Animated.Value(0)).current;
  const rotateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => enable3D,
    onPanResponderMove: (evt, gestureState) => {
      if (!enable3D) return;
      
      const { dx, dy } = gestureState;
      const rotationX = (dy / 300) * 15; // Reduced sensitivity for mobile
      const rotationY = (dx / 300) * 15;

      Animated.parallel([
        Animated.timing(rotateX, {
          toValue: rotationX,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotateY, {
          toValue: rotationY,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    },
    onPanResponderGrant: () => {
      if (!enable3D) return;
      setIsMouseEntered(true);
      Animated.timing(scale, {
        toValue: 1.02,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: () => {
      if (!enable3D) return;
      setIsMouseEntered(false);
      Animated.parallel([
        Animated.spring(rotateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.spring(rotateY, {
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
    },
  });

  const cardTransform = enable3D ? [
    {
      rotateX: rotateX.interpolate({
        inputRange: [-15, 15],
        outputRange: ['-15deg', '15deg'],
      }),
    },
    {
      rotateY: rotateY.interpolate({
        inputRange: [-15, 15],
        outputRange: ['-15deg', '15deg'],
      }),
    },
    { scale },
  ] : [];

  return (
    <MouseEnterContext.Provider value={{ isMouseEntered, setIsMouseEntered }}>
      <View style={[styles.container, containerStyle]}>
        <Animated.View
          style={[
            styles.card,
            style,
            enable3D && {
              transform: cardTransform,
            },
          ]}
          {...(enable3D && panResponder.panHandlers)}
        >
          {children}
        </Animated.View>
      </View>
    </MouseEnterContext.Provider>
  );
};

export interface CardBodyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, style }) => {
  return (
    <View style={[styles.cardBody, style]}>
      {children}
    </View>
  );
};

export interface CardItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
  translateX?: number;
  translateY?: number;
  rotateX?: number;
  rotateY?: number;
}

export const CardItem: React.FC<CardItemProps> = ({
  children,
  style,
  translateX = 0,
  translateY = 0,
  rotateX = 0,
  rotateY = 0,
}) => {
  const context = useContext(MouseEnterContext);
  const animatedValues = useRef({
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
    rotateX: new Animated.Value(0),
    rotateY: new Animated.Value(0),
  }).current;

  useEffect(() => {
    if (!context) return;

    const targetValues = context.isMouseEntered
      ? { translateX, translateY, rotateX, rotateY }
      : { translateX: 0, translateY: 0, rotateX: 0, rotateY: 0 };

    Animated.parallel([
      Animated.spring(animatedValues.translateX, {
        toValue: targetValues.translateX,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(animatedValues.translateY, {
        toValue: targetValues.translateY,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(animatedValues.rotateX, {
        toValue: targetValues.rotateX,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(animatedValues.rotateY, {
        toValue: targetValues.rotateY,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [context?.isMouseEntered, translateX, translateY, rotateX, rotateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [
            { translateX: animatedValues.translateX },
            { translateY: animatedValues.translateY },
            {
              rotateX: animatedValues.rotateX.interpolate({
                inputRange: [-360, 360],
                outputRange: ['-360deg', '360deg'],
              }),
            },
            {
              rotateY: animatedValues.rotateY.interpolate({
                inputRange: [-360, 360],
                outputRange: ['-360deg', '360deg'],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardBody: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.spacing.component.radius.lg,
    shadowColor: theme.colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
});