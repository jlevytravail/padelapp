import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, PanResponder, Dimensions } from 'react-native';
import Color from 'color';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from './Button';
import { Card } from './Card';
import { Typography } from './Typography';

interface ColorPickerContextValue {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  mode: 'hex' | 'rgb' | 'hsl';
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setAlpha: (alpha: number) => void;
  setMode: (mode: 'hex' | 'rgb' | 'hsl') => void;
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(undefined);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);
  if (!context) {
    throw new Error('useColorPicker must be used within a ColorPicker');
  }
  return context;
};

interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  children: React.ReactNode;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  defaultValue = '#000000',
  onChange,
  children,
}) => {
  const getColorValues = (colorString: string) => {
    try {
      const color = Color(colorString);
      const [h, s, l] = color.hsl().array();
      return {
        hue: h || 0,
        saturation: s || 0,
        lightness: l || 0,
        alpha: color.alpha() * 100,
      };
    } catch {
      const defaultColor = Color(defaultValue);
      const [h, s, l] = defaultColor.hsl().array();
      return {
        hue: h || 0,
        saturation: s || 0,
        lightness: l || 0,
        alpha: defaultColor.alpha() * 100,
      };
    }
  };

  const initialValues = getColorValues(value || defaultValue);
  const [hue, setHue] = useState(initialValues.hue);
  const [saturation, setSaturation] = useState(initialValues.saturation);
  const [lightness, setLightness] = useState(initialValues.lightness);
  const [alpha, setAlpha] = useState(initialValues.alpha);
  const [mode, setMode] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  useEffect(() => {
    if (value) {
      const values = getColorValues(value);
      setHue(values.hue);
      setSaturation(values.saturation);
      setLightness(values.lightness);
      setAlpha(values.alpha);
    }
  }, [value]);

  useEffect(() => {
    if (onChange) {
      try {
        const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
        onChange(color.hex());
      } catch (error) {
        console.warn('Invalid color values:', { hue, saturation, lightness, alpha });
      }
    }
  }, [hue, saturation, lightness, alpha, onChange]);

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setAlpha,
        setMode,
      }}
    >
      <View style={{ gap: 16 }}>
        {children}
      </View>
    </ColorPickerContext.Provider>
  );
};

export const ColorPickerSelection: React.FC = () => {
  const { hue, setSaturation, setLightness } = useColorPicker();
  const [indicatorPosition, setIndicatorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<View>(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      handleColorSelection(event.nativeEvent.locationX, event.nativeEvent.locationY);
    },
    onPanResponderMove: (event) => {
      handleColorSelection(event.nativeEvent.locationX, event.nativeEvent.locationY);
    },
  });

  const handleColorSelection = (x: number, y: number) => {
    const containerWidth = 250;
    const containerHeight = 200;
    
    const normalizedX = Math.max(0, Math.min(1, x / containerWidth));
    const normalizedY = Math.max(0, Math.min(1, y / containerHeight));
    
    setIndicatorPosition({ x: normalizedX * containerWidth, y: normalizedY * containerHeight });
    setSaturation(normalizedX * 100);
    setLightness((1 - normalizedY) * 100);
  };

  const baseColor = `hsl(${hue}, 100%, 50%)`;

  return (
    <Card style={{ width: 250, height: 200, overflow: 'hidden' }}>
      <View
        ref={containerRef}
        style={{
          flex: 1,
          position: 'relative',
        }}
        {...panResponder.panHandlers}
      >
        <LinearGradient
          colors={['#ffffff', baseColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <LinearGradient
          colors={['transparent', '#000000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: indicatorPosition.x - 8,
            top: indicatorPosition.y - 8,
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: 'white',
            backgroundColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        />
      </View>
    </Card>
  );
};

export const ColorPickerHue: React.FC = () => {
  const { hue, setHue } = useColorPicker();
  const [indicatorPosition, setIndicatorPosition] = useState(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      handleHueChange(event.nativeEvent.locationX);
    },
    onPanResponderMove: (event) => {
      handleHueChange(event.nativeEvent.locationX);
    },
  });

  const handleHueChange = (x: number) => {
    const sliderWidth = 250;
    const normalizedX = Math.max(0, Math.min(1, x / sliderWidth));
    const newHue = normalizedX * 360;
    
    setIndicatorPosition(x);
    setHue(newHue);
  };

  useEffect(() => {
    setIndicatorPosition((hue / 360) * 250);
  }, [hue]);

  return (
    <View style={{ height: 40, width: 250, borderRadius: 8, overflow: 'hidden' }}>
      <LinearGradient
        colors={[
          '#FF0000', '#FFFF00', '#00FF00', 
          '#00FFFF', '#0000FF', '#FF00FF', '#FF0000'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          flex: 1,
          position: 'relative',
        }}
        {...panResponder.panHandlers}
      >
        <View
          style={{
            position: 'absolute',
            left: indicatorPosition - 8,
            top: '50%',
            marginTop: -8,
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: 'white',
            backgroundColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
        />
      </LinearGradient>
    </View>
  );
};

export const ColorPickerPreview: React.FC = () => {
  const { hue, saturation, lightness, alpha } = useColorPicker();
  
  const currentColor = Color.hsl(hue, saturation, lightness).alpha(alpha / 100).hex();
  
  return (
    <View
      style={{
        width: 60,
        height: 40,
        borderRadius: 8,
        backgroundColor: currentColor,
        borderWidth: 1,
        borderColor: '#e0e0e0',
      }}
    />
  );
};

export const ColorPickerFormat: React.FC = () => {
  const { hue, saturation, lightness, alpha, mode, setMode } = useColorPicker();
  
  const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
  
  const getFormattedValue = () => {
    switch (mode) {
      case 'hex':
        return color.hex();
      case 'rgb':
        const [r, g, b] = color.rgb().array().map(v => Math.round(v));
        return `rgb(${r}, ${g}, ${b})`;
      case 'hsl':
        return `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%)`;
      default:
        return color.hex();
    }
  };

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {(['hex', 'rgb', 'hsl'] as const).map((format) => (
          <Button
            key={format}
            variant={mode === format ? 'primary' : 'secondary'}
            size="small"
            onPress={() => setMode(format)}
          >
            <Typography variant="button" style={{ textTransform: 'uppercase' }}>
              {format}
            </Typography>
          </Button>
        ))}
      </View>
      
      <Card style={{ padding: 12 }}>
        <Typography variant="body" style={{ fontFamily: 'monospace' }}>
          {getFormattedValue()}
        </Typography>
      </Card>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Typography variant="body">Preview:</Typography>
        <ColorPickerPreview />
      </View>
    </View>
  );
};