import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { lightColors } from '../../theme/colors';
import { textStyles } from '../../theme/fonts';
import { layout, borderRadius, shadows } from '../../theme/spacing';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.buttonSmall);
        break;
      case 'large':
        baseStyle.push(styles.buttonLarge);
        break;
      default:
        baseStyle.push(styles.buttonMedium);
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      case 'ghost':
        baseStyle.push(styles.buttonGhost);
        break;
      case 'danger':
        baseStyle.push(styles.buttonDanger);
        break;
      case 'success':
        baseStyle.push(styles.buttonSuccess);
        break;
      default:
        baseStyle.push(styles.buttonPrimary);
    }
    
    // State styles
    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    // Full width
    if (fullWidth) {
      baseStyle.push(styles.buttonFullWidth);
    }
    
    // Custom style
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle.push(textStyles.buttonSmall);
        break;
      case 'large':
        baseStyle.push(textStyles.buttonLarge);
        break;
      default:
        baseStyle.push(textStyles.button);
    }
    
    // Variant styles
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.buttonSecondaryText);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutlineText);
        break;
      case 'ghost':
        baseStyle.push(styles.buttonGhostText);
        break;
      case 'danger':
        baseStyle.push(styles.buttonDangerText);
        break;
      case 'success':
        baseStyle.push(styles.buttonSuccessText);
        break;
      default:
        baseStyle.push(styles.buttonPrimaryText);
    }
    
    // State styles
    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabledText);
    }
    
    // Custom text style
    if (textStyle) {
      baseStyle.push(textStyle);
    }
    
    return baseStyle;
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={variant === 'outline' || variant === 'ghost' ? lightColors.primary : lightColors.textInverse}
          />
          {title && <Text style={[getTextStyle(), styles.loadingText]}>{title}</Text>}
        </View>
      );
    }
    
    if (icon && title) {
      return (
        <View style={[styles.contentContainer, iconPosition === 'right' && styles.contentContainerReverse]}>
          {iconPosition === 'left' && icon}
          <Text style={getTextStyle()}>{title}</Text>
          {iconPosition === 'right' && icon}
        </View>
      );
    }
    
    if (icon) {
      return icon;
    }
    
    return <Text style={getTextStyle()}>{title}</Text>;
  };
  
  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: layout.screenPadding,
    ...shadows.small,
  },
  
  // Size styles
  buttonSmall: {
    height: layout.buttonHeightSmall,
    paddingHorizontal: 12,
  },
  buttonMedium: {
    height: layout.buttonHeight,
  },
  buttonLarge: {
    height: layout.buttonHeightLarge,
    paddingHorizontal: 24,
  },
  
  // Variant styles
  buttonPrimary: {
    backgroundColor: lightColors.primary,
  },
  buttonSecondary: {
    backgroundColor: lightColors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: lightColors.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDanger: {
    backgroundColor: lightColors.error,
  },
  buttonSuccess: {
    backgroundColor: lightColors.success,
  },
  
  // State styles
  buttonDisabled: {
    backgroundColor: lightColors.textTertiary,
    opacity: 0.6,
  },
  
  // Layout styles
  buttonFullWidth: {
    width: '100%',
  },
  
  // Text styles
  buttonText: {
    textAlign: 'center',
  },
  buttonPrimaryText: {
    color: lightColors.textInverse,
  },
  buttonSecondaryText: {
    color: lightColors.textInverse,
  },
  buttonOutlineText: {
    color: lightColors.primary,
  },
  buttonGhostText: {
    color: lightColors.primary,
  },
  buttonDangerText: {
    color: lightColors.textInverse,
  },
  buttonSuccessText: {
    color: lightColors.textInverse,
  },
  buttonDisabledText: {
    color: lightColors.textSecondary,
  },
  
  // Content layout
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentContainerReverse: {
    flexDirection: 'row-reverse',
  },
  
  // Loading styles
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    opacity: 0.8,
  },
});

export default Button;
