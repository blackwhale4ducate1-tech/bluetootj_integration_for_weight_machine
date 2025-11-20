import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { lightColors } from '../../theme/colors';
import { textStyles } from '../../theme/fonts';
import { spacing, layout, borderRadius } from '../../theme/spacing';
import { useBluetooth } from '../../context/BluetoothContext';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage, { BluetoothError } from '../../components/common/ErrorMessage';

const ConnectScaleScreen = () => {
  const {
    isScanning,
    devices,
    connectedDevice,
    isConnecting,
    error,
    startScan,
    stopScan,
    connectToDevice,
    checkBluetoothStatus,
    clearError,
  } = useBluetooth();

  useEffect(() => {
    // Check Bluetooth status on mount (no prompt if already granted)
    checkBluetoothStatus();
  }, [checkBluetoothStatus]);

  const handleScan = async () => {
    clearError();
    await startScan();
  };

  const handleRefresh = async () => {
    if (isScanning) {
      stopScan();
    }
    await handleScan();
  };

  const handleConnect = async (deviceId) => {
    clearError();
    await connectToDevice(deviceId);
  };

  const renderDeviceItem = ({ item }) => {
    const isConnected = connectedDevice && connectedDevice.id === item.id;

    return (
      <TouchableOpacity
        style={styles.deviceCard}
        activeOpacity={0.8}
        onPress={() => handleConnect(item.id)}
        disabled={isConnecting}
      >
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
          <Text style={styles.deviceId}>{item.id}</Text>
        </View>

        <View style={styles.deviceMeta}>
          {item.rssi != null && (
            <Text style={styles.deviceRssi}>RSSI: {item.rssi}</Text>
          )}
          <Text
            style={[
              styles.deviceStatus,
              isConnected && styles.deviceStatusConnected,
            ]}
          >
            {isConnected ? 'Connected' : 'Tap to connect'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Connect Your Scale</Text>
      <Text style={styles.subtitle}>
        Make sure your Bluetooth scale is powered on and nearby.
      </Text>
    </View>
  );

  const renderError = () => {
    if (!error) return null;

    return (
      <BluetoothError
        error={error}
        onRetry={handleScan}
        style={styles.error}
      />
    );
  };

  const renderContent = () => {
    if (isConnecting) {
      return (
        <View style={styles.centerContent}>
          <Loading text="Connecting to scale..." />
        </View>
      );
    }

    if (!devices.length && !isScanning) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>
            No scales found yet.
          </Text>
          <Text style={styles.emptySubText}>
            Tap the scan button below to search for nearby scales.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDeviceItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isScanning}
            onRefresh={handleRefresh}
            colors={[lightColors.primary]}
            tintColor={lightColors.primary}
          />
        }
        ListFooterComponent={
          isScanning ? (
            <View style={styles.scanningFooter}>
              <Loading text="Scanning for scales..." />
            </View>
          ) : null
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderError()}
      {renderContent()}

      <View style={styles.footer}>
        <Button
          title={isScanning ? 'Stop Scanning' : 'Scan for Scales'}
          onPress={isScanning ? stopScan : handleScan}
          variant="primary"
          fullWidth
          icon={<Text style={styles.buttonIcon}>📡</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
    paddingHorizontal: layout.screenPadding,
    paddingTop: layout.screenPaddingVertical,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...textStyles.h2,
    color: lightColors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...textStyles.body,
    color: lightColors.textSecondary,
  },
  error: {
    marginBottom: spacing.md,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...textStyles.h4,
    color: lightColors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubText: {
    ...textStyles.body,
    color: lightColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  listContent: {
    paddingBottom: layout.tabBarHeight + spacing.lg,
  },
  deviceCard: {
    backgroundColor: lightColors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: lightColors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  deviceName: {
    ...textStyles.bodyLarge,
    color: lightColors.text,
    marginBottom: spacing.xs,
  },
  deviceId: {
    ...textStyles.caption,
    color: lightColors.textSecondary,
  },
  deviceMeta: {
    alignItems: 'flex-end',
  },
  deviceRssi: {
    ...textStyles.caption,
    color: lightColors.textSecondary,
    marginBottom: spacing.xs,
  },
  deviceStatus: {
    ...textStyles.captionBold,
    color: lightColors.primary,
  },
  deviceStatusConnected: {
    color: lightColors.success,
  },
  scanningFooter: {
    paddingVertical: spacing.md,
  },
  footer: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    bottom: layout.tabBarHeight,
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 4,
  },
});

export default ConnectScaleScreen;
