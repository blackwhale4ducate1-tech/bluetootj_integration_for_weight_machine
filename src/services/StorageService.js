import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

/**
 * Storage service for managing AsyncStorage operations
 */
class StorageService {
  // Authentication methods
  static async saveToken(token) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      return true;
    } catch (error) {
      console.error('Error saving token:', error);
      return false;
    }
  }

  static async getToken() {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  static async removeToken() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      return true;
    } catch (error) {
      console.error('Error removing token:', error);
      return false;
    }
  }

  // User data methods
  static async saveUser(userData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  static async getUser() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  static async removeUser() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return true;
    } catch (error) {
      console.error('Error removing user data:', error);
      return false;
    }
  }

  // Settings methods
  static async saveSettings(settings) {
    try {
      const currentSettings = await this.getSettings();
      const mergedSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mergedSettings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  static async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  static async removeSettings() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
      return true;
    } catch (error) {
      console.error('Error removing settings:', error);
      return false;
    }
  }

  // Cached measurements methods
  static async saveCachedMeasurements(measurements) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CACHED_MEASUREMENTS,
        JSON.stringify({
          data: measurements,
          timestamp: new Date().toISOString(),
        })
      );
      return true;
    } catch (error) {
      console.error('Error saving cached measurements:', error);
      return false;
    }
  }

  static async getCachedMeasurements() {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_MEASUREMENTS);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Return cached data if it's less than 1 hour old
        const cacheAge = Date.now() - new Date(timestamp).getTime();
        const oneHour = 60 * 60 * 1000;
        
        if (cacheAge < oneHour) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting cached measurements:', error);
      return null;
    }
  }

  static async removeCachedMeasurements() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CACHED_MEASUREMENTS);
      return true;
    } catch (error) {
      console.error('Error removing cached measurements:', error);
      return false;
    }
  }

  // Last sync methods
  static async saveLastSync(timestamp = new Date().toISOString()) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp);
      return true;
    } catch (error) {
      console.error('Error saving last sync:', error);
      return false;
    }
  }

  static async getLastSync() {
    try {
      const lastSync = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return lastSync ? new Date(lastSync) : null;
    } catch (error) {
      console.error('Error getting last sync:', error);
      return null;
    }
  }

  // Onboarding methods
  static async setOnboardingCompleted(completed = true) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(completed));
      return true;
    } catch (error) {
      console.error('Error setting onboarding status:', error);
      return false;
    }
  }

  static async isOnboardingCompleted() {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return completed ? JSON.parse(completed) : false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  // Generic methods
  static async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  static async getItem(key, defaultValue = null) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return defaultValue;
      
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return defaultValue;
    }
  }

  static async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  // Clear all app data
  static async clear() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.CACHED_MEASUREMENTS,
        STORAGE_KEYS.LAST_SYNC,
        STORAGE_KEYS.ONBOARDING_COMPLETED,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Clear only auth data (for logout)
  static async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.CACHED_MEASUREMENTS,
        STORAGE_KEYS.LAST_SYNC,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  }

  // Get all keys (for debugging)
  static async getAllKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter(key => key.startsWith('@'));
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  // Get storage info (for debugging)
  static async getStorageInfo() {
    try {
      const keys = await this.getAllKeys();
      const info = {};
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        info[key] = {
          size: value ? value.length : 0,
          type: typeof value,
        };
      }
      
      return info;
    } catch (error) {
      console.error('Error getting storage info:', error);
      return {};
    }
  }
}

export default StorageService;
