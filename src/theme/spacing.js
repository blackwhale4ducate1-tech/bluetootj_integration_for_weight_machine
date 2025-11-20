// Base spacing unit (8px)
const BASE_UNIT = 8;

// Spacing scale
export const spacing = {
  xs: BASE_UNIT * 0.5,    // 4px
  sm: BASE_UNIT,          // 8px
  md: BASE_UNIT * 2,      // 16px
  lg: BASE_UNIT * 3,      // 24px
  xl: BASE_UNIT * 4,      // 32px
  xxl: BASE_UNIT * 5,     // 40px
  xxxl: BASE_UNIT * 6,    // 48px
  huge: BASE_UNIT * 8,    // 64px
};

// Layout dimensions
export const layout = {
  // Screen padding
  screenPadding: spacing.md,
  screenPaddingHorizontal: spacing.md,
  screenPaddingVertical: spacing.lg,
  
  // Container dimensions
  containerMaxWidth: 400,
  cardMaxWidth: 350,
  
  // Component dimensions
  buttonHeight: 48,
  buttonHeightSmall: 36,
  buttonHeightLarge: 56,
  
  inputHeight: 48,
  inputHeightSmall: 36,
  inputHeightLarge: 56,
  
  // Icon sizes
  iconXS: 16,
  iconSM: 20,
  iconMD: 24,
  iconLG: 32,
  iconXL: 40,
  iconXXL: 48,
  
  // Avatar sizes
  avatarSmall: 32,
  avatarMedium: 48,
  avatarLarge: 64,
  avatarXLarge: 80,
  
  // Card dimensions
  cardPadding: spacing.md,
  cardMargin: spacing.sm,
  cardBorderRadius: 12,
  
  // List item dimensions
  listItemHeight: 60,
  listItemPadding: spacing.md,
  
  // Tab bar
  tabBarHeight: 60,
  tabBarPadding: spacing.sm,
  
  // Header
  headerHeight: 56,
  headerPadding: spacing.md,
  
  // Bottom sheet
  bottomSheetRadius: 20,
  bottomSheetPadding: spacing.lg,
};

// Border radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
  circle: 999,
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
  verySlow: 500,
};

// Z-index levels
export const zIndex = {
  background: -1,
  default: 0,
  overlay: 10,
  modal: 20,
  popover: 30,
  tooltip: 40,
  notification: 50,
};

export default {
  spacing,
  layout,
  borderRadius,
  shadows,
  animations,
  zIndex,
};