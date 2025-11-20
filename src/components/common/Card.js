import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { lightColors } from '../../theme/colors';
import { layout, borderRadius, shadows, spacing } from '../../theme/spacing';

const Card = ({
  children,
  style,
  onPress,
  disabled = false,
  variant = 'default',
  padding = 'default',
  shadow = true,
  ...props
}) => {
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    // Variant styles
    switch (variant) {
      case 'outlined':
        baseStyle.push(styles.cardOutlined);
        break;
      case 'elevated':
        baseStyle.push(styles.cardElevated);
        break;
      case 'flat':
        baseStyle.push(styles.cardFlat);
        break;
      default:
        baseStyle.push(styles.cardDefault);
    }
    
    // Padding styles
    switch (padding) {
      case 'none':
        // No padding
        break;
      case 'small':
        baseStyle.push(styles.cardPaddingSmall);
        break;
      case 'large':
        baseStyle.push(styles.cardPaddingLarge);
        break;
      default:
        baseStyle.push(styles.cardPaddingDefault);
    }
    
    // Shadow
    if (shadow && variant !== 'flat') {
      baseStyle.push(shadows.card);
    }
    
    // Disabled state
    if (disabled) {
      baseStyle.push(styles.cardDisabled);
    }
    
    // Custom style
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };
  
  if (onPress) {
    return (
      <TouchableOpacity
        style={getCardStyle()}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={getCardStyle()} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: layout.cardBorderRadius,
    marginVertical: layout.cardMargin,
  },
  
  // Variant styles
  cardDefault: {
    backgroundColor: lightColors.card,
  },
  cardOutlined: {
    backgroundColor: lightColors.card,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  cardElevated: {
    backgroundColor: lightColors.card,
    ...shadows.large,
  },
  cardFlat: {
    backgroundColor: lightColors.cardSecondary,
  },
  
  // Padding styles
  cardPaddingDefault: {
    padding: layout.cardPadding,
  },
  cardPaddingSmall: {
    padding: spacing.sm,
  },
  cardPaddingLarge: {
    padding: spacing.xl,
  },
  
  // State styles
  cardDisabled: {
    opacity: 0.6,
  },
});

export default Card;
