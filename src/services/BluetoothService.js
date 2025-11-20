import { BleManager, Device } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import { Buffer } from 'buffer';
import { BLUETOOTH_CONFIG, ERROR_MESSAGES } from '../utils/constants';

class BluetoothService {
  constructor() {
    this.manager = new BleManager();
    this.connectedDevice = null;
    this.isScanning = false;
    this.scanSubscription = null;
    this.connectionSubscription = null;
    this.characteristicSubscription = null;
    this.listeners = new Set();
  }

  // Initialize Bluetooth service
  async initialize() {
    try {
      // Request permissions first (especially important on Android)
      await this.requestPermissions();

      const state = await this.manager.state();
      console.log('Bluetooth state:', state);
      
      if (state !== 'PoweredOn') {
        throw new Error(ERROR_MESSAGES.BLUETOOTH.NOT_ENABLED);
      }
      
      return true;
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
      throw error;
    }
  }

  // Request necessary permissions
  async requestPermissions() {
    if (Platform.OS === 'android') {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ];

      // For Android 12+ (API level 31+)
      if (Platform.Version >= 31) {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        );
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      const allGranted = Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        throw new Error(ERROR_MESSAGES.BLUETOOTH.PERMISSION_DENIED);
      }
    }
  }

  // Check if Bluetooth is enabled
  async isBluetoothEnabled() {
    try {
      const state = await this.manager.state();
      return state === 'PoweredOn';
    } catch (error) {
      console.error('Error checking Bluetooth state:', error);
      return false;
    }
  }

  // Add event listener
  addListener(listener) {
    this.listeners.add(listener);
  }

  // Remove event listener
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  // Emit event to all listeners
  emit(event, data) {
    this.listeners.forEach(listener => {
      if (typeof listener[event] === 'function') {
        listener[event](data);
      }
    });
  }

  // Start scanning for devices
  async startScan() {
    try {
      if (this.isScanning) {
        return;
      }

      await this.initialize();
      
      this.isScanning = true;
      this.emit('scanStarted');

      const devices = new Map();

      // Start scanning with callback
      this.manager.startDeviceScan(
        null, // Service UUIDs (null = all devices)
        { allowDuplicates: false },
        (error, device) => {
          if (error) {
            console.error('Device scan error:', error);
            this.emit('scanError', error);
            this.stopScan();
            return;
          }

          if (device) {
            // De-duplicate devices by id
            if (!devices.has(device.id)) {
              devices.set(device.id, device);
              this.emit('deviceFound', device);
            }
          }
        }
      );

      // Stop scanning after timeout
      setTimeout(() => {
        this.stopScan();
      }, BLUETOOTH_CONFIG.SCAN_TIMEOUT);

    } catch (error) {
      this.isScanning = false;
      this.emit('scanError', error);
      throw error;
    }
  }

  // Stop scanning
  stopScan() {
    if (this.isScanning) {
      this.manager.stopDeviceScan();
      this.isScanning = false;
      this.emit('scanStopped');
    }
  }

  // Check if device is likely a weight scale
  isWeightScale(device) {
    if (!device.name) return false;
    
    const name = device.name.toLowerCase();
    return BLUETOOTH_CONFIG.DEVICE_NAME_PATTERNS.some(pattern => 
      name.includes(pattern)
    );
  }

  // Connect to device
  async connectToDevice(deviceId) {
    try {
      this.stopScan();

      this.emit('connectionStarted', deviceId);

      // Connect to device
      const device = await this.manager.connectToDevice(deviceId, {
        timeout: BLUETOOTH_CONFIG.CONNECTION_TIMEOUT,
      });

      this.connectedDevice = device;

      // Discover services and characteristics
      await device.discoverAllServicesAndCharacteristics();

      // Set up connection monitoring
      this.connectionSubscription = device.onDisconnected((error, disconnectedDevice) => {
        console.log('Device disconnected:', disconnectedDevice.id);
        this.handleDisconnection(error);
      });

      // Set up weight measurement monitoring
      await this.setupWeightMonitoring(device);

      this.emit('deviceConnected', device);
      
      return device;
    } catch (error) {
      console.error('Connection error:', error);
      this.emit('connectionError', error);
      throw new Error(ERROR_MESSAGES.BLUETOOTH.CONNECTION_FAILED);
    }
  }

  // Set up weight measurement monitoring
  async setupWeightMonitoring(device) {
    try {
      // Try to find weight measurement characteristic
      const services = await device.services();
      
      for (const service of services) {
        const characteristics = await service.characteristics();
        
        for (const characteristic of characteristics) {
          // Check if this is a weight measurement characteristic
          if (this.isWeightCharacteristic(characteristic)) {
            // Subscribe to notifications
            this.characteristicSubscription = characteristic.monitor((error, char) => {
              if (error) {
                console.error('Characteristic monitoring error:', error);
                return;
              }

              if (char && char.value) {
                const weightData = this.parseWeightData(char.value);
                if (weightData) {
                  this.emit('weightMeasurement', weightData);
                }
              }
            });
            
            console.log('Weight monitoring set up successfully');
            return;
          }
        }
      }
      
      console.log('No weight measurement characteristic found');
    } catch (error) {
      console.error('Error setting up weight monitoring:', error);
    }
  }

  // Check if characteristic is for weight measurement
  isWeightCharacteristic(characteristic) {
    const uuid = characteristic.uuid.toLowerCase();
    
    // Check for standard weight measurement UUID
    if (uuid === BLUETOOTH_CONFIG.WEIGHT_MEASUREMENT_UUID.toLowerCase()) {
      return true;
    }

    // Check for notify/indicate properties (weight scales usually notify)
    return characteristic.isNotifiable || characteristic.isIndicatable;
  }

  // Parse weight data from Bluetooth characteristic
  parseWeightData(base64Value) {
    try {
      // Decode base64 to buffer
      const buffer = Buffer.from(base64Value, 'base64');
      
      // This is a simplified parser - actual implementation depends on your scale's protocol
      // Most weight scales follow the Bluetooth SIG Weight Scale Profile
      
      if (buffer.length < 2) return null;

      // Parse flags (first byte)
      const flags = buffer.readUInt8(0);
      
      // Check if weight is in kg or lbs
      const isImperial = (flags & 0x01) !== 0;
      const hasTimestamp = (flags & 0x02) !== 0;
      const hasUserID = (flags & 0x04) !== 0;
      const hasBMI = (flags & 0x08) !== 0;
      
      let offset = 1;
      
      // Read weight (2 bytes, little endian)
      if (buffer.length < offset + 2) return null;
      const rawWeight = buffer.readUInt16LE(offset);
      offset += 2;
      
      // Convert weight based on unit
      let weight;
      let unit;
      
      if (isImperial) {
        weight = rawWeight * 0.01; // Weight in lbs with 0.01 resolution
        unit = 'lbs';
      } else {
        weight = rawWeight * 0.005; // Weight in kg with 0.005 resolution
        unit = 'kg';
      }
      
      const result = {
        weight: Math.round(weight * 100) / 100, // Round to 2 decimal places
        unit,
        timestamp: new Date().toISOString(),
      };
      
      // Parse additional data if available
      if (hasBMI && buffer.length >= offset + 2) {
        const rawBMI = buffer.readUInt16LE(offset);
        result.bmi = Math.round((rawBMI * 0.1) * 10) / 10; // BMI with 0.1 resolution
        offset += 2;
      }
      
      // You can extend this to parse body fat, muscle mass, etc.
      // depending on your scale's capabilities
      
      return result;
    } catch (error) {
      console.error('Error parsing weight data:', error);
      return null;
    }
  }

  // Handle device disconnection
  handleDisconnection(error) {
    if (this.characteristicSubscription) {
      this.characteristicSubscription.remove();
      this.characteristicSubscription = null;
    }

    if (this.connectionSubscription) {
      this.connectionSubscription.remove();
      this.connectionSubscription = null;
    }

    this.connectedDevice = null;
    this.emit('deviceDisconnected', error);
  }

  // Disconnect from current device
  async disconnect() {
    try {
      if (this.connectedDevice) {
        await this.connectedDevice.cancelConnection();
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      this.handleDisconnection();
    }
  }

  // Get connected device
  getConnectedDevice() {
    return this.connectedDevice;
  }

  // Check if device is connected
  isConnected() {
    return this.connectedDevice !== null;
  }

  // Cleanup
  destroy() {
    this.stopScan();
    this.disconnect();
    this.listeners.clear();
    
    if (this.manager) {
      this.manager.destroy();
    }
  }
}

// Export singleton instance
export default new BluetoothService();
