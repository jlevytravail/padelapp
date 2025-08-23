import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { theme } from '../../themes';

interface TypographyProps {
  variant?: keyof typeof theme.typography.styles;
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = theme.colors.text.primary,
  style,
  children,
  ...props
}) => {
  const variantStyle = theme.typography.styles[variant];
  
  return (
    <Text
      style={[
        variantStyle,
        { color },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Composants de typography spécialisés
export const Title: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Subtitle: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" color={theme.colors.text.secondary} {...props} />
);

export const Score: React.FC<Omit<TypographyProps, 'variant'> & { size?: 'small' | 'medium' | 'large' }> = ({
  size = 'medium',
  ...props
}) => {
  const variant = size === 'small' ? 'scoreSmall' : size === 'large' ? 'scoreLarge' : 'scoreMedium';
  return <Typography variant={variant} color={theme.colors.primary[500]} {...props} />;
};