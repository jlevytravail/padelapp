import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle, TouchableOpacity, Animated } from 'react-native';
import Svg, { Rect, Text, Line } from 'react-native-svg';
import { Typography } from '../ui';
import { theme } from '../../themes';

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  width?: number;
  height?: number;
  barColor?: string;
  activeBarColor?: string;
  showGrid?: boolean;
  showValues?: boolean;
  interactive?: boolean;
  horizontal?: boolean;
  style?: ViewStyle;
  onBarPress?: (bar: BarChartDataPoint, index: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width = screenWidth - 32,
  height = 200,
  barColor = theme.colors.primary[500],
  activeBarColor = theme.colors.primary[600],
  showGrid = true,
  showValues = true,
  interactive = true,
  horizontal = false,
  style,
  onBarPress,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const animatedValues = useRef(
    data.map(() => new Animated.Value(0))
  ).current;

  const padding = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculer les valeurs min/max pour l'échelle
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

  // Animation d'entrée
  useEffect(() => {
    const animations = animatedValues.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 100,
        useNativeDriver: false,
      })
    );

    Animated.stagger(100, animations).start();
  }, []);

  // Générer les lignes de grille
  const generateGridLines = () => {
    const gridLines = [];
    const numberOfLines = 5;
    
    for (let i = 0; i <= numberOfLines; i++) {
      if (horizontal) {
        // Lignes verticales pour graphique horizontal
        const x = padding.left + (i / numberOfLines) * chartWidth;
        gridLines.push(
          <Line
            key={`v-${i}`}
            x1={x}
            y1={padding.top}
            x2={x}
            y2={padding.top + chartHeight}
            stroke={theme.colors.neutral[200]}
            strokeWidth={0.5}
            strokeDasharray="2,2"
          />
        );

        // Labels de l'axe X (valeurs)
        const value = (i / numberOfLines) * maxValue;
        gridLines.push(
          <Text
            key={`x-label-${i}`}
            x={x}
            y={padding.top + chartHeight + 15}
            fill={theme.colors.text.secondary}
            fontSize="10"
            textAnchor="middle"
          >
            {value.toFixed(0)}
          </Text>
        );
      } else {
        // Lignes horizontales pour graphique vertical
        const y = padding.top + (i / numberOfLines) * chartHeight;
        gridLines.push(
          <Line
            key={`h-${i}`}
            x1={padding.left}
            y1={y}
            x2={padding.left + chartWidth}
            y2={y}
            stroke={theme.colors.neutral[200]}
            strokeWidth={0.5}
            strokeDasharray="2,2"
          />
        );

        // Labels de l'axe Y (valeurs)
        const value = maxValue - (i / numberOfLines) * range;
        gridLines.push(
          <Text
            key={`y-label-${i}`}
            x={padding.left - 10}
            y={y + 3}
            fill={theme.colors.text.secondary}
            fontSize="10"
            textAnchor="end"
          >
            {value.toFixed(0)}
          </Text>
        );
      }
    }
    
    return gridLines;
  };

  const handleBarPress = (bar: BarChartDataPoint, index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    
    if (onBarPress) {
      onBarPress(bar, index);
    }
  };

  // Calculer les dimensions des barres
  const getBarDimensions = (value: number, index: number) => {
    const barSpacing = 8;
    
    if (horizontal) {
      const barHeight = (chartHeight - (data.length - 1) * barSpacing) / data.length;
      const barWidth = (value / maxValue) * chartWidth;
      const x = padding.left;
      const y = padding.top + index * (barHeight + barSpacing);
      
      return { x, y, width: barWidth, height: barHeight };
    } else {
      const barWidth = (chartWidth - (data.length - 1) * barSpacing) / data.length;
      const barHeight = ((value - minValue) / range) * chartHeight;
      const x = padding.left + index * (barWidth + barSpacing);
      const y = padding.top + chartHeight - barHeight;
      
      return { x, y, width: barWidth, height: barHeight };
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.chartContainer}>
        <Svg width={width} height={height}>
          {/* Grille */}
          {showGrid && generateGridLines()}
          
          {/* Barres */}
          {data.map((item, index) => {
            const barDimensions = getBarDimensions(item.value, index);
            const isActive = activeIndex === index;
            const barColorToUse = item.color || (isActive ? activeBarColor : barColor);
            
            return (
              <React.Fragment key={index}>
                <Animated.View>
                  <Rect
                    x={barDimensions.x}
                    y={barDimensions.y}
                    width={barDimensions.width}
                    height={barDimensions.height}
                    fill={barColorToUse}
                    rx={4}
                    ry={4}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                    onPress={() => interactive && handleBarPress(item, index)}
                  />
                </Animated.View>

                {/* Valeurs sur les barres */}
                {showValues && (
                  <Text
                    x={horizontal ? 
                      barDimensions.x + barDimensions.width + 5 : 
                      barDimensions.x + barDimensions.width / 2
                    }
                    y={horizontal ? 
                      barDimensions.y + barDimensions.height / 2 + 3 : 
                      barDimensions.y - 5
                    }
                    fill={theme.colors.text.primary}
                    fontSize="12"
                    textAnchor={horizontal ? "start" : "middle"}
                    fontWeight="500"
                  >
                    {item.value}
                  </Text>
                )}

                {/* Labels des barres */}
                <Text
                  x={horizontal ? 
                    padding.left - 10 : 
                    barDimensions.x + barDimensions.width / 2
                  }
                  y={horizontal ? 
                    barDimensions.y + barDimensions.height / 2 + 3 : 
                    padding.top + chartHeight + 15
                  }
                  fill={theme.colors.text.secondary}
                  fontSize="11"
                  textAnchor={horizontal ? "end" : "middle"}
                >
                  {item.label}
                </Text>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Détails de la barre active */}
      {interactive && activeIndex !== null && (
        <View style={styles.activeDetails}>
          <Typography variant="h4" style={styles.activeValue}>
            {data[activeIndex].value}
          </Typography>
          <Typography variant="caption" style={styles.activeLabel}>
            {data[activeIndex].label}
          </Typography>
        </View>
      )}

      {/* Boutons de contrôle */}
      {interactive && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              !horizontal && styles.activeControlButton,
            ]}
            onPress={() => {/* Toggle to vertical */}}
          >
            <Typography variant="caption">Vertical</Typography>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.controlButton,
              horizontal && styles.activeControlButton,
            ]}
            onPress={() => {/* Toggle to horizontal */}}
          >
            <Typography variant="caption">Horizontal</Typography>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.spacing.component.radius.lg,
    padding: theme.spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
  },
  activeDetails: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  activeValue: {
    color: theme.colors.primary[500],
    fontWeight: '700',
    fontSize: 24,
  },
  activeLabel: {
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  controlButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.component.radius.sm,
    backgroundColor: theme.colors.neutral[100],
  },
  activeControlButton: {
    backgroundColor: theme.colors.primary[100],
  },
});