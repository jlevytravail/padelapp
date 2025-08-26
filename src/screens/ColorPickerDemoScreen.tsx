import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  ColorPicker, 
  ColorPickerSelection, 
  ColorPickerHue, 
  ColorPickerFormat,
  Typography,
  Card
} from '../components/ui';

export const ColorPickerDemoScreen: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#3498db');
  const [favoriteColor, setFavoriteColor] = useState('#e74c3c');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Typography variant="title" style={styles.title}>
        Color Picker Demo
      </Typography>

      {/* Main Color Picker */}
      <Card style={styles.section}>
        <Typography variant="subtitle" style={styles.sectionTitle}>
          Primary Color Selection
        </Typography>
        
        <ColorPicker
          value={selectedColor}
          onChange={setSelectedColor}
        >
          <ColorPickerSelection />
          <ColorPickerHue />
          <ColorPickerFormat />
        </ColorPicker>
      </Card>

      {/* Secondary Color Picker */}
      <Card style={styles.section}>
        <Typography variant="subtitle" style={styles.sectionTitle}>
          Secondary Color Selection
        </Typography>
        
        <ColorPicker
          value={favoriteColor}
          onChange={setFavoriteColor}
        >
          <ColorPickerSelection />
          <ColorPickerHue />
          <ColorPickerFormat />
        </ColorPicker>
      </Card>

      {/* Color Usage Examples */}
      <Card style={styles.section}>
        <Typography variant="subtitle" style={styles.sectionTitle}>
          Selected Colors in Use
        </Typography>
        
        <View style={styles.colorExamples}>
          {/* Primary Color Example */}
          <View style={[styles.colorBox, { backgroundColor: selectedColor }]}>
            <Typography 
              variant="body" 
              style={[
                styles.colorLabel,
                { color: isLightColor(selectedColor) ? '#000' : '#fff' }
              ]}
            >
              Primary Color
            </Typography>
          </View>

          {/* Secondary Color Example */}
          <View style={[styles.colorBox, { backgroundColor: favoriteColor }]}>
            <Typography 
              variant="body" 
              style={[
                styles.colorLabel,
                { color: isLightColor(favoriteColor) ? '#000' : '#fff' }
              ]}
            >
              Secondary Color
            </Typography>
          </View>

          {/* Gradient Example */}
          <View style={styles.gradientContainer}>
            <Typography variant="body" style={styles.gradientLabel}>
              Gradient Preview
            </Typography>
            <View 
              style={[
                styles.gradientBox,
                {
                  backgroundColor: selectedColor,
                  opacity: 0.8,
                }
              ]}
            />
            <View 
              style={[
                styles.gradientBox,
                {
                  backgroundColor: favoriteColor,
                  opacity: 0.6,
                  marginTop: -30,
                }
              ]}
            />
          </View>
        </View>

        <View style={styles.colorInfo}>
          <Typography variant="caption" style={styles.colorInfoText}>
            Primary: {selectedColor}
          </Typography>
          <Typography variant="caption" style={styles.colorInfoText}>
            Secondary: {favoriteColor}
          </Typography>
        </View>
      </Card>

      {/* Usage Instructions */}
      <Card style={styles.section}>
        <Typography variant="subtitle" style={styles.sectionTitle}>
          How to Use
        </Typography>
        
        <View style={styles.instructions}>
          <Typography variant="body" style={styles.instructionText}>
            • Tap and drag on the color square to select saturation and lightness
          </Typography>
          <Typography variant="body" style={styles.instructionText}>
            • Use the hue bar below to change the base color
          </Typography>
          <Typography variant="body" style={styles.instructionText}>
            • Toggle between HEX, RGB, and HSL formats
          </Typography>
          <Typography variant="body" style={styles.instructionText}>
            • Colors update in real-time as you interact
          </Typography>
        </View>
      </Card>
    </ScrollView>
  );
};

// Helper function to determine if a color is light or dark
const isLightColor = (color: string): boolean => {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#2c3e50',
  },
  section: {
    marginBottom: 24,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#34495e',
  },
  colorExamples: {
    gap: 16,
    marginBottom: 16,
  },
  colorBox: {
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  colorLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  gradientContainer: {
    height: 80,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientLabel: {
    position: 'absolute',
    zIndex: 10,
    color: '#fff',
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gradientBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    borderRadius: 12,
  },
  colorInfo: {
    marginTop: 16,
    gap: 4,
  },
  colorInfoText: {
    color: '#7f8c8d',
    fontFamily: 'monospace',
  },
  instructions: {
    gap: 12,
  },
  instructionText: {
    color: '#5d6d7e',
    lineHeight: 20,
  },
});