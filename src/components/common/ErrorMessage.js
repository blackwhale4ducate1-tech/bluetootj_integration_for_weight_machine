import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { lightColors } from '../../theme/colors';
import { textStyles } from '../../theme/fonts';
import { spacing, borderRadius } from '../../theme/spacing';
import Button from './Button';

const ErrorMessage = ({
  message,
  title = 'Oops!',
  onRetry,
  retryText = 'Try Again',
  onDismiss,
  dismissText = 'Dismiss',
  variant = 'default',
  style,
  showIcon = true,
  icon,
  ...props
}) => {
  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    switch (variant) {
      case 'inline':
        baseStyle.push(styles.containerInline);
        break;
      case 'card':
        baseStyle.push(styles.containerCard);
        break;
      case 'banner':
        baseStyle.push(styles.containerBanner);
        break;
      default:
        baseStyle.push(styles.containerDefault);
    }
    
    if (style) {
      baseStyle.push(style);
    }
    
    return baseStyle;
  };

  const renderIcon = () => {
    if (!showIcon) return null;
    
    if (icon) {
      return <View style={styles.iconContainer}>{icon}</View>;
    }
    
    return (
      <View style={styles.iconContainer}>
        <Text style={styles.defaultIcon}>⚠️</Text>
      </View>
    );
  };

  const renderActions = () => {
    if (!onRetry && !onDismiss) return null;
    
    return (
      <View style={styles.actionsContainer}>
        {onRetry && (
          <Button
            title={retryText}
            onPress={onRetry}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
        )}
        {onDismiss && (
          <Button
            title={dismissText}
            onPress={onDismiss}
            variant="ghost"
            size="small"
            style={styles.actionButton}
          />
        )}
      </View>
    );
  };

  if (!message) return null;

  return (
    <View style={getContainerStyle()} {...props}>
      <View style={styles.contentContainer}>
        {renderIcon()}
        
        <View style={styles.textContainer}>
          {title && variant !== 'inline' && (
            <Text style={styles.title}>{title}</Text>
          )}
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
      
      {renderActions()}
    </View>
  );
};

// Network error component
export const NetworkError = ({ onRetry, style }) => (
  <ErrorMessage
    title="No Internet Connection"
    message="Please check your network connection and try again."
    onRetry={onRetry}
    retryText="Retry"
    variant="card"
    icon={<Text style={styles.networkIcon}>📡</Text>}
    style={style}
  />
);

// Empty state component
export const EmptyState = ({ 
  title = "Nothing here yet",
  message,
  onAction,
  actionText,
  icon,
  style 
}) => (
  <View style={[styles.emptyState, style]}>
    {icon && <View style={styles.emptyIcon}>{icon}</View>}
    <Text style={styles.emptyTitle}>{title}</Text>
    {message && <Text style={styles.emptyMessage}>{message}</Text>}
    {onAction && (
      <Button
        title={actionText}
        onPress={onAction}
        variant="outline"
        style={styles.emptyAction}
      />
    )}
  </View>
);

// Bluetooth error component
export const BluetoothError = ({ error, onRetry, onSettings, style }) => {
  let title = "Bluetooth Error";
  let message = error;
  let actions = [];

  if (error?.includes('not enabled')) {
    title = "Bluetooth Disabled";
    message = "Please enable Bluetooth to connect to your scale.";
    actions.push({ text: "Open Settings", onPress: onSettings });
  } else if (error?.includes('permission')) {
    title = "Permission Required";
    message = "Bluetooth permission is required to connect to your scale.";
    actions.push({ text: "Grant Permission", onPress: onSettings });
  } else if (error?.includes('not found')) {
    title = "Scale Not Found";
    message = "Make sure your scale is powered on and nearby.";
    actions.push({ text: "Scan Again", onPress: onRetry });
  }

  return (
    <View style={[styles.bluetoothError, style]}>
      <Text style={styles.bluetoothIcon}>📱</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <Button
            key={index}
            title={action.text}
            onPress={action.onPress}
            variant="outline"
            size="small"
            style={styles.actionButton}
          />
        ))}
        {onRetry && !actions.some(a => a.onPress === onRetry) && (
          <Button
            title="Try Again"
            onPress={onRetry}
            variant="ghost"
            size="small"
            style={styles.actionButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  
  containerDefault: {
    backgroundColor: lightColors.error + '10',
    borderLeftWidth: 4,
    borderLeftColor: lightColors.error,
  },
  
  containerInline: {
    backgroundColor: 'transparent',
    padding: spacing.sm,
  },
  
  containerCard: {
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: lightColors.error + '30',
  },
  
  containerBanner: {
    backgroundColor: lightColors.error + '15',
    borderRadius: 0,
    paddingVertical: spacing.sm,
  },
  
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  iconContainer: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  
  defaultIcon: {
    fontSize: 20,
  },
  
  networkIcon: {
    fontSize: 24,
  },
  
  bluetoothIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  textContainer: {
    flex: 1,
  },
  
  title: {
    ...textStyles.labelLarge,
    color: lightColors.error,
    marginBottom: spacing.xs,
  },
  
  message: {
    ...textStyles.body,
    color: lightColors.text,
    lineHeight: 20,
  },
  
  actionsContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  
  actionButton: {
    flex: 1,
  },
  
  // Empty state styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  
  emptyTitle: {
    ...textStyles.h3,
    color: lightColors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  emptyMessage: {
    ...textStyles.body,
    color: lightColors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  
  emptyAction: {
    minWidth: 120,
  },
  
  // Bluetooth error styles
  bluetoothError: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.md,
    margin: spacing.md,
  },
});

export default ErrorMessage;
