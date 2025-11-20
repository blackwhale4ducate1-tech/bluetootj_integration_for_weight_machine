import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import { lightColors } from '../../theme/colors';
import { textStyles } from '../../theme/fonts';
import { spacing } from '../../theme/spacing';
import { VALIDATION_RULES, HEIGHT_LIMITS } from '../../utils/constants';
import { convertHeight } from '../../utils/helpers';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import Card from '../../components/common/Card';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    dateOfBirth: new Date(2000, 0, 1),
    gender: 'male',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [heightUnit, setHeightUnit] = useState('cm');

  const validateForm = () => {
    const errors = {};
    
    // First name validation
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    } else if (!VALIDATION_RULES.NAME.PATTERN.test(formData.firstName)) {
      errors.firstName = 'First name contains invalid characters';
    }
    
    // Last name validation
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    } else if (!VALIDATION_RULES.NAME.PATTERN.test(formData.lastName)) {
      errors.lastName = 'Last name contains invalid characters';
    }
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!VALIDATION_RULES.EMAIL.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      errors.password = `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`;
    } else if (!VALIDATION_RULES.PASSWORD.PATTERN.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Height validation
    if (!formData.height) {
      errors.height = 'Height is required';
    } else {
      const height = parseFloat(formData.height);
      if (isNaN(height)) {
        errors.height = 'Please enter a valid height';
      } else {
        const heightCm = heightUnit === 'ft' ? convertHeight(height, 'ft', 'cm') : height;
        if (heightCm < HEIGHT_LIMITS.MIN_CM || heightCm > HEIGHT_LIMITS.MAX_CM) {
          errors.height = `Height must be between ${HEIGHT_LIMITS.MIN_CM}cm and ${HEIGHT_LIMITS.MAX_CM}cm`;
        }
      }
    }
    
    // Age validation
    const age = new Date().getFullYear() - formData.dateOfBirth.getFullYear();
    if (age < 13) {
      errors.dateOfBirth = 'You must be at least 13 years old';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('dateOfBirth', selectedDate);
    }
  };

  const handleHeightUnitChange = (unit) => {
    setHeightUnit(unit);
    
    // Convert existing height value
    if (formData.height) {
      const currentHeight = parseFloat(formData.height);
      if (!isNaN(currentHeight)) {
        const convertedHeight = convertHeight(currentHeight, heightUnit, unit);
        handleInputChange('height', convertedHeight.toString());
      }
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    // Convert height to meters for backend
    const heightCm = heightUnit === 'ft' ? convertHeight(parseFloat(formData.height), 'ft', 'cm') : parseFloat(formData.height);
    const heightM = heightCm / 100;
    
    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      height: heightM,
      dateOfBirth: formData.dateOfBirth.toISOString().split('T')[0],
      gender: formData.gender,
    };
    
    const result = await register(userData);
    
    if (result.success) {
      // Navigation will be handled by the auth context
      navigation.replace('MainNavigator');
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: lightColors.textTertiary };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    const strengthMap = {
      0: { label: 'Very Weak', color: lightColors.error },
      1: { label: 'Weak', color: lightColors.error },
      2: { label: 'Fair', color: lightColors.warning },
      3: { label: 'Good', color: lightColors.warning },
      4: { label: 'Strong', color: lightColors.success },
      5: { label: 'Very Strong', color: lightColors.success },
    };
    
    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={lightColors.background} barStyle="dark-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to start your health journey</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error && (
            <ErrorMessage
              message={error}
              variant="card"
              onDismiss={clearError}
              style={styles.errorMessage}
            />
          )}

          {/* Personal Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.row}>
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                error={formErrors.firstName}
                style={styles.halfInput}
              />
              
              <Input
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                error={formErrors.lastName}
                style={styles.halfInput}
              />
            </View>

            <Input
              label="Email Address"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              error={formErrors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Card>

          {/* Account Security */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Account Security</Text>
            
            <Input
              label="Password"
              placeholder="Enter a strong password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              error={formErrors.password}
              secureTextEntry={!showPassword}
              showPasswordToggle
            />
            
            {formData.password && (
              <View style={styles.passwordStrength}>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill, 
                      { 
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                        backgroundColor: passwordStrength.color 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </Text>
              </View>
            )}

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              error={formErrors.confirmPassword}
              secureTextEntry={!showConfirmPassword}
              showPasswordToggle
            />
          </Card>

          {/* Physical Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Physical Information</Text>
            
            <View style={styles.heightContainer}>
              <Input
                label="Height"
                placeholder={heightUnit === 'cm' ? '175' : '5.9'}
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                error={formErrors.height}
                keyboardType="numeric"
                style={styles.heightInput}
              />
              
              <View style={styles.unitSelector}>
                <TouchableOpacity
                  style={[styles.unitButton, heightUnit === 'cm' && styles.unitButtonActive]}
                  onPress={() => handleHeightUnitChange('cm')}
                >
                  <Text style={[styles.unitText, heightUnit === 'cm' && styles.unitTextActive]}>cm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.unitButton, heightUnit === 'ft' && styles.unitButtonActive]}
                  onPress={() => handleHeightUnitChange('ft')}
                >
                  <Text style={[styles.unitText, heightUnit === 'ft' && styles.unitTextActive]}>ft</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateLabel}>Date of Birth</Text>
              <Text style={styles.dateValue}>
                {formData.dateOfBirth.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {formErrors.dateOfBirth && (
              <Text style={styles.errorText}>{formErrors.dateOfBirth}</Text>
            )}

            <View style={styles.genderContainer}>
              <Text style={styles.genderLabel}>Gender</Text>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                style={styles.genderPicker}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </Card>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            style={styles.registerButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.dateOfBirth}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  
  title: {
    ...textStyles.h1,
    color: lightColors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  subtitle: {
    ...textStyles.body,
    color: lightColors.textSecondary,
    textAlign: 'center',
  },
  
  form: {
    flex: 1,
  },
  
  errorMessage: {
    marginBottom: spacing.md,
  },
  
  section: {
    marginBottom: spacing.lg,
  },
  
  sectionTitle: {
    ...textStyles.h4,
    color: lightColors.text,
    marginBottom: spacing.md,
  },
  
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  
  halfInput: {
    flex: 1,
  },
  
  passwordStrength: {
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  
  strengthBar: {
    height: 4,
    backgroundColor: lightColors.borderLight,
    borderRadius: 2,
    marginBottom: spacing.xs,
  },
  
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  
  strengthLabel: {
    ...textStyles.caption,
    textAlign: 'right',
  },
  
  heightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  
  heightInput: {
    flex: 1,
  },
  
  unitSelector: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: lightColors.backgroundTertiary,
    padding: 2,
    marginBottom: spacing.md,
  },
  
  unitButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 6,
  },
  
  unitButtonActive: {
    backgroundColor: lightColors.primary,
  },
  
  unitText: {
    ...textStyles.body,
    color: lightColors.textSecondary,
  },
  
  unitTextActive: {
    color: lightColors.textInverse,
  },
  
  dateInput: {
    borderWidth: 1,
    borderColor: lightColors.inputBorder,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  
  dateLabel: {
    ...textStyles.label,
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  
  dateValue: {
    ...textStyles.body,
    color: lightColors.text,
  },
  
  genderContainer: {
    marginBottom: spacing.md,
  },
  
  genderLabel: {
    ...textStyles.label,
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  
  genderPicker: {
    borderWidth: 1,
    borderColor: lightColors.inputBorder,
    borderRadius: 12,
  },
  
  errorText: {
    ...textStyles.caption,
    color: lightColors.error,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  
  registerButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xl,
  },
  
  footerText: {
    ...textStyles.body,
    color: lightColors.textSecondary,
  },
  
  footerLink: {
    ...textStyles.body,
    color: lightColors.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
