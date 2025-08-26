import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path, Circle, Line, Text, Rect } from 'react-native-svg';
import { Typography } from '../ui';
import { theme } from '../../themes';

export interface LineChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  width?: number;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  strokeWidth?: number;
  showDots?: boolean;
  showGrid?: boolean;
  interactive?: boolean;
  style?: ViewStyle;
  onPointPress?: (point: LineChartDataPoint, index: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = screenWidth - 32,
  height = 200,
  activeColor = theme.colors.primary[500],
  inactiveColor = theme.colors.neutral[300],
  strokeWidth = 2,
  showDots = true,
  showGrid = true,
  interactive = true,
  style,
  onPointPress,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const pathRef = useRef<any>(null);

  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculer les valeurs min/max pour l'échelle
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  // Animation d'entrée
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  // Générer les points du graphique
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((point.value - minValue) / range) * chartHeight;
    return { x: x + padding.left, y: y + padding.top, ...point };
  });

  // Générer le chemin SVG
  const generatePath = () => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Courbe de Bézier pour un tracé plus fluide
      const cpx1 = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.3;
      const cpy1 = prevPoint.y;
      const cpx2 = currentPoint.x - (currentPoint.x - prevPoint.x) * 0.3;
      const cpy2 = currentPoint.y;
      
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${currentPoint.x} ${currentPoint.y}`;
    }
    
    return path;
  };

  // Générer les lignes de grille
  const generateGridLines = () => {
    const gridLines = [];
    const numberOfLines = 5;
    
    // Lignes horizontales
    for (let i = 0; i <= numberOfLines; i++) {
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
    }
    
    return gridLines;
  };

  const handlePointPress = (point: LineChartDataPoint & { x: number; y: number }, index: number) => {
    setActiveIndex(index);
    if (onPointPress) {
      onPointPress(point, index);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.chartContainer}>
        <Svg width={width} height={height}>
          {/* Grille */}
          {showGrid && generateGridLines()}
          
          {/* Chemin principal */}
          <Animated.View>
            <Path
              ref={pathRef}
              d={generatePath()}
              stroke={activeColor}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Animated.View>
          
          {/* Points */}
          {showDots && points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={activeIndex === index ? 6 : 4}
              fill={activeIndex === index ? activeColor : theme.colors.background.card}
              stroke={activeColor}
              strokeWidth={2}
              onPress={() => interactive && handlePointPress(point, index)}
            />
          ))}
          
          {/* Labels des axes */}
          <Text
            x={padding.left - 10}
            y={padding.top}
            fill={theme.colors.text.secondary}
            fontSize="12"
            textAnchor="end"
          >
            {maxValue.toFixed(1)}
          </Text>
          
          <Text
            x={padding.left - 10}
            y={padding.top + chartHeight}
            fill={theme.colors.text.secondary}
            fontSize="12"
            textAnchor="end"
          >
            {minValue.toFixed(1)}
          </Text>
        </Svg>
      </View>
      
      {/* Légende interactive */}
      {interactive && (
        <View style={styles.legend}>
          <View style={styles.legendButtons}>
            {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.legendButton,
                  activeIndex === index && styles.activeLegendButton,
                ]}
                onPress={() => setActiveIndex(index)}
              >
                <View
                  style={[
                    styles.legendDot,
                    {
                      backgroundColor: activeIndex === index ? activeColor : inactiveColor,
                    },
                  ]}
                />
                <Typography
                  variant="caption"
                  style={[
                    styles.legendText,
                    { color: activeIndex === index ? activeColor : theme.colors.text.secondary },
                  ]}
                >
                  {item.label || new Date(item.date).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Affichage de la valeur active */}
          {activeIndex !== null && (
            <View style={styles.activeValueContainer}>
              <Typography variant="h3" style={styles.activeValue}>
                {data[activeIndex].value.toFixed(2)}
              </Typography>
              <Typography variant="caption" style={styles.activeDate}>
                {new Date(data[activeIndex].date).toLocaleDateString('fr-FR')}
              </Typography>
            </View>
          )}
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
  legend: {
    marginTop: theme.spacing.md,
  },
  legendButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  legendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.spacing.component.radius.sm,
    backgroundColor: 'transparent',
    gap: theme.spacing.xs,
  },
  activeLegendButton: {
    backgroundColor: theme.colors.primary[50],
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
  },
  activeValueContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
  },
  activeValue: {
    color: theme.colors.primary[500],
    fontWeight: '700',
  },
  activeDate: {
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
});