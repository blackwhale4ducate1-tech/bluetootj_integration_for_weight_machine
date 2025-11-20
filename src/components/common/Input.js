import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { lightColors } from '../../theme/colors';
import { textStyles } from '../../theme/fonts';
import { layout, borderRadius, spacing } from '../../theme/spacing';

const Input = forwardRef(({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  showPasswordToggle = false,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  editable = true,
  style,
  inputStyle,
  containerStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (containerStyle) {
      baseStyle.push(containerStyle);
    }
    
    return baseStyle;
  };

  const getInputContainerStyle = () => {
    const baseStyle = [styles.inputContainer];
    
    if (error) {
      baseStyle.push(styles.inputContainerError);
    } else if (isFocused) {
      baseStyle.push(styles.inputContainerFocused);
    }
    
    if (!editable) {
      baseStyle.push(styles.inputContainerDisabled);
    }
    
    if (multiline) {
      baseStyle.push(styles.inputContainerMultiline);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input, textStyles.body];
    
    if (multiline) {
      baseStyle.push(styles.inputMultiline);
    }
    
    if (!editable) {
      baseStyle.push(styles.inputDisabled);
    }
    
    if (inputStyle) {
      baseStyle.push(inputStyle);
    }
    
    return baseStyle;
  };

  const getLabelStyle = () => {
    const baseStyle = [styles.label, textStyles.label];
    
    if (error) {
      baseStyle.push(styles.labelError);
    } else if (isFocused) {
      baseStyle.push(styles.labelFocused);
    }
    
    if (labelStyle) {
      baseStyle.push(labelStyle);
    }
    
    return baseStyle;
  };

  const getErrorStyle = () => {
    const baseStyle = [styles.errorText, textStyles.caption];
    
    if (errorStyle) {
      baseStyle.push(errorStyle);
    }
    
    return baseStyle;
  };

  const getHelperStyle = () => {
    const baseStyle = [styles.helperText, textStyles.caption];
    
    if (helperStyle) {
      baseStyle.push(helperStyle);
    }
    
    return baseStyle;
  };

  const renderPasswordToggle = () => {
    if (!showPasswordToggle) return null;
    
    return (
      <TouchableOpacity
        style={styles.passwordToggle}
        onPress={togglePasswordVisibility}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.passwordToggleText}>
          {isPasswordVisible ? '🙈' : '👁️'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={getContainerStyle()}>
      {label && (
        <Text style={getLabelStyle()}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={lightColors.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {showPasswordToggle && renderPasswordToggle()}
        
        {rightIcon && !showPasswordToggle && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <Text style={getErrorStyle()}>
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text style={getHelperStyle()}>
          {helperText}
        </Text>
      )}
      
      {maxLength && (
        <Text style={styles.characterCount}>
          {value?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  
  label: {
    marginBottom: spacing.xs,
    color: lightColors.text,
  },
  labelFocused: {
    color: lightColors.primary,
  },
  labelError: {
    color: lightColors.error,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: lightColors.inputBackground,
    borderWidth: 1,
    borderColor: lightColors.inputBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: layout.inputHeight,
  },
  inputContainerFocused: {
    borderColor: lightColors.inputFocus,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: lightColors.error,
    borderWidth: 2,
  },
  inputContainerDisabled: {
    backgroundColor: lightColors.backgroundTertiary,
    opacity: 0.6,
  },
  inputContainerMultiline: {
    minHeight: layout.inputHeight * 2,
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  
  input: {
    flex: 1,
    color: lightColors.text,
    paddingVertical: 0, // Remove default padding
  },
  inputMultiline: {
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: lightColors.textSecondary,
  },
  
  leftIconContainer: {
    marginRight: spacing.sm,
  },
  rightIconContainer: {
    marginLeft: spacing.sm,
  },
  
  passwordToggle: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  passwordToggleText: {
    fontSize: 16,
  },
  
  errorText: {
    color: lightColors.error,
    marginTop: spacing.xs,
  },
  helperText: {
    color: lightColors.textSecondary,
    marginTop: spacing.xs,
  },
  characterCount: {
    ...textStyles.caption,
    color: lightColors.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
});

Input.displayName = 'Input';

export default Input;
