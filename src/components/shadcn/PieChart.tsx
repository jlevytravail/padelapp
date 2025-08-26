import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path, Text, Circle } from 'react-native-svg';
import { Typography } from '../ui';
import { theme } from '../../themes';

export interface PieChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieChartDataPoint[];
  size?: number;
  innerRadius?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
  interactive?: boolean;
  style?: ViewStyle;
  onSlicePress?: (slice: PieChartDataPoint, index: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = Math.min(screenWidth - 64, 280),
  innerRadius = 0,
  showLabels = true,
  showPercentages = true,
  interactive = true,
  style,
  onSlicePress,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const animatedValues = useRef(
    data.map(() => new Animated.Value(0))
  ).current;
  const scaleValues = useRef(
    data.map(() => new Animated.Value(1))
  ).current;

  const radius = (size - 40) / 2;
  const center = size / 2;

  // Calculer le total pour les pourcentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Couleurs par défaut
  const defaultColors = [
    theme.colors.primary[500],
    theme.colors.success[500],
    theme.colors.warning[500],
    theme.colors.error[500],
    theme.colors.info[500],
    theme.colors.primary[300],
    theme.colors.success[300],
    theme.colors.warning[300],
  ];

  // Préparer les données avec couleurs et angles
  const slices = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length],
    percentage: (item.value / total) * 100,
    angle: (item.value / total) * 360,
  }));

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

  // Générer le chemin SVG pour chaque tranche
  const createPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number = 0) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const x1 = center + outerRadius * Math.cos(startAngleRad);
    const y1 = center + outerRadius * Math.sin(startAngleRad);
    const x2 = center + outerRadius * Math.cos(endAngleRad);
    const y2 = center + outerRadius * Math.sin(endAngleRad);

    if (innerRadius === 0) {
      // Camembert plein
      return `M ${center} ${center} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    } else {
      // Donut
      const x3 = center + innerRadius * Math.cos(endAngleRad);
      const y3 = center + innerRadius * Math.sin(endAngleRad);
      const x4 = center + innerRadius * Math.cos(startAngleRad);
      const y4 = center + innerRadius * Math.sin(startAngleRad);

      return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
    }
  };

  // Calculer la position des labels
  const getLabelPosition = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const midAngleRad = (midAngle - 90) * (Math.PI / 180);
    const labelRadius = radius + 30;
    
    return {
      x: center + labelRadius * Math.cos(midAngleRad),
      y: center + labelRadius * Math.sin(midAngleRad),
    };
  };

  const handleSlicePress = (slice: typeof slices[0], index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    
    // Animation de scale
    Animated.timing(scaleValues[index], {
      toValue: activeIndex === index ? 1 : 1.1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (onSlicePress) {
      onSlicePress(slice, index);
    }
  };

  let cumulativeAngle = 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          {slices.map((slice, index) => {
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + slice.angle;
            const path = createPath(startAngle, endAngle, radius, innerRadius);
            const labelPos = getLabelPosition(startAngle, endAngle);

            cumulativeAngle = endAngle;

            return (
              <React.Fragment key={index}>
                <Animated.View
                  style={{
                    transform: [{ scale: scaleValues[index] }],
                  }}
                >
                  <Path
                    d={path}
                    fill={slice.color}
                    stroke={theme.colors.background.card}
                    strokeWidth={2}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                    onPress={() => interactive && handleSlicePress(slice, index)}
                  />
                </Animated.View>

                {/* Labels */}
                {showLabels && slice.percentage > 5 && (
                  <Text
                    x={labelPos.x}
                    y={labelPos.y}
                    fill={theme.colors.text.primary}
                    fontSize="12"
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {showPercentages ? `${slice.percentage.toFixed(1)}%` : slice.label}
                  </Text>
                )}
              </React.Fragment>
            );
          })}

          {/* Centre du donut */}
          {innerRadius > 0 && activeIndex !== null && (
            <>
              <Circle
                cx={center}
                cy={center}
                r={innerRadius - 10}
                fill={theme.colors.background.secondary}
                opacity={0.9}
              />
              <Text
                x={center}
                y={center - 8}
                fill={theme.colors.text.primary}
                fontSize="16"
                textAnchor="middle"
                fontWeight="bold"
              >
                {slices[activeIndex].value}
              </Text>
              <Text
                x={center}
                y={center + 8}
                fill={theme.colors.text.secondary}
                fontSize="12"
                textAnchor="middle"
              >
                {slices[activeIndex].label}
              </Text>
            </>
          )}
        </Svg>
      </View>

      {/* Légende */}
      <View style={styles.legend}>
        {slices.map((slice, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.legendItem,
              activeIndex === index && styles.activeLegendItem,
            ]}
            onPress={() => interactive && handleSlicePress(slice, index)}
          >
            <View
              style={[
                styles.legendColor,
                { backgroundColor: slice.color },
              ]}
            />
            <View style={styles.legendText}>
              <Typography
                variant="body"
                style={[
                  styles.legendLabel,
                  { opacity: activeIndex === null || activeIndex === index ? 1 : 0.6 },
                ]}
              >
                {slice.label}
              </Typography>
              <Typography
                variant="caption"
                style={[
                  styles.legendValue,
                  { opacity: activeIndex === null || activeIndex === index ? 1 : 0.6 },
                ]}
              >
                {slice.value} ({slice.percentage.toFixed(1)}%)
              </Typography>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.spacing.component.radius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  legend: {
    width: '100%',
    gap: theme.spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.spacing.component.radius.sm,
    gap: theme.spacing.sm,
  },
  activeLegendItem: {
    backgroundColor: theme.colors.primary[50],
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontWeight: '500',
  },
  legendValue: {
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
});