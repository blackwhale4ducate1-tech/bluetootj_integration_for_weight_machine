import { Platform } from 'react-native';

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

// Font weights
export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
};

// Font families (platform specific)
export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto-Medium',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto-Bold',
  }),
  light: Platform.select({
    ios: 'System',
    android: 'Roboto-Light',
  }),
};

// Text styles
export const textStyles = {
  // Headers
  h1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: fontSize.xxxl * 1.2,
  },
  h2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: fontSize.xxl * 1.2,
  },
  h3: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.xl * 1.2,
  },
  h4: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.lg * 1.2,
  },
  
  // Body text
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.md * 1.4,
  },
  bodyLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.lg * 1.4,
  },
  bodySmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.sm * 1.4,
  },
  
  // Labels
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.sm * 1.2,
  },
  labelLarge: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.md * 1.2,
  },
  
  // Captions
  caption: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.xs * 1.3,
  },
  captionBold: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.xs * 1.3,
  },
  
  // Buttons
  button: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.md * 1.2,
  },
  buttonLarge: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.lg * 1.2,
  },
  buttonSmall: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.sm * 1.2,
  },
  
  // Special text styles
  weight: {
    fontSize: fontSize.huge,
    fontWeight: fontWeight.light,
    fontFamily: fontFamily.light,
    lineHeight: fontSize.huge * 1.1,
  },
  weightLarge: {
    fontSize: fontSize.massive,
    fontWeight: fontWeight.light,
    fontFamily: fontFamily.light,
    lineHeight: fontSize.massive * 1.1,
  },
  bmi: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.xl * 1.2,
  },
  
  // Navigation
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.xs * 1.2,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.lg * 1.2,
  },
};

export default {
  fontSize,
  fontWeight,
  fontFamily,
  textStyles,
};
