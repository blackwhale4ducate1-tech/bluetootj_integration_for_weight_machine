import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
} from 'react-native';
import { lightColors } from '../../theme/colors';
import { textStyles } from '../../theme/fonts';
import { spacing, borderRadius } from '../../theme/spacing';

const Loading = ({
  visible = true,
  text,
  size = 'large',
  color = lightColors.primary,
  overlay = false,
  style,
  textStyle,
  ...props
}) => {
  const renderContent = () => (
    <View style={[styles.container, overlay && styles.overlayContainer, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
      )}
    </View>
  );

  if (overlay) {
    return (
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        {...props}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {renderContent()}
          </View>
        </View>
      </Modal>
    );
  }

  if (!visible) {
    return null;
  }

  return renderContent();
};

// Skeleton loading component for list items
export const SkeletonLoader = ({ 
  width = '100%', 
  height = 20, 
  borderRadius: radius = 4,
  style 
}) => (
  <View
    style={[
      styles.skeleton,
      {
        width,
        height,
        borderRadius: radius,
      },
      style,
    ]}
  />
);

// Loading placeholder for cards
export const CardSkeleton = ({ style }) => (
  <View style={[styles.cardSkeleton, style]}>
    <SkeletonLoader height={24} width="60%" style={styles.skeletonTitle} />
    <SkeletonLoader height={16} width="80%" style={styles.skeletonLine} />
    <SkeletonLoader height={16} width="40%" style={styles.skeletonLine} />
  </View>
);

// Loading placeholder for weight display
export const WeightSkeleton = ({ style }) => (
  <View style={[styles.weightSkeleton, style]}>
    <SkeletonLoader height={60} width="50%" style={styles.skeletonWeight} />
    <SkeletonLoader height={20} width="30%" style={styles.skeletonBMI} />
  </View>
);

// Loading dots animation
export const LoadingDots = ({ 
  color = lightColors.primary,
  size = 8,
  style 
}) => (
  <View style={[styles.dotsContainer, style]}>
    <View style={[styles.dot, { backgroundColor: color, width: size, height: size }]} />
    <View style={[styles.dot, { backgroundColor: color, width: size, height: size }]} />
    <View style={[styles.dot, { backgroundColor: color, width: size, height: size }]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  
  overlayContainer: {
    flex: 1,
    backgroundColor: lightColors.overlay,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: lightColors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  modalContent: {
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 120,
  },
  
  text: {
    ...textStyles.body,
    color: lightColors.textSecondary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  
  // Skeleton styles
  skeleton: {
    backgroundColor: lightColors.backgroundTertiary,
    opacity: 0.7,
  },
  
  cardSkeleton: {
    backgroundColor: lightColors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
  },
  
  skeletonTitle: {
    marginBottom: spacing.sm,
  },
  
  skeletonLine: {
    marginBottom: spacing.xs,
  },
  
  weightSkeleton: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  
  skeletonWeight: {
    marginBottom: spacing.md,
  },
  
  skeletonBMI: {
    marginBottom: spacing.sm,
  },
  
  // Loading dots
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  
  dot: {
    borderRadius: 50,
    opacity: 0.7,
  },
});

export default Loading;
