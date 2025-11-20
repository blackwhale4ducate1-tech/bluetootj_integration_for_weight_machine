import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { lightColors } from '../../theme/colors';
import { textStyles } from '../../theme/fonts';
import { spacing } from '../../theme/spacing';
import Loading from '../../components/common/Loading';

const SplashScreen = ({ navigation }) => {
  const { isAuthenticated, isLoading, loadUserFromStorage } = useAuth();

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Navigate after loading is complete
      setTimeout(() => {
        if (isAuthenticated) {
          navigation.replace('MainNavigator');
        } else {
          navigation.replace('AuthNavigator');
        }
      }, 1000); // Show splash for at least 1 second
    }
  }, [isLoading, isAuthenticated, navigation]);

  const initializeApp = async () => {
    try {
      // Initialize any app-wide services here
      await loadUserFromStorage();
      
      // You can add other initialization tasks here:
      // - Check app version
      // - Initialize analytics
      // - Check for updates
      // - Initialize Bluetooth service
      
    } catch (error) {
      console.error('App initialization error:', error);
      // Even if initialization fails, continue to auth flow
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={lightColors.primary} barStyle="light-content" />
      
      <View style={styles.content}>
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>⚖️</Text>
          </View>
          
          <Text style={styles.appName}>Weight Scale</Text>
          <Text style={styles.tagline}>Track your health journey</Text>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <Loading 
            visible={true}
            size="large"
            color={lightColors.textInverse}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.primary,
  },
  
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.huge,
  },
  
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: lightColors.textInverse,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  logoText: {
    fontSize: 48,
  },
  
  appName: {
    ...textStyles.h1,
    color: lightColors.textInverse,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  
  tagline: {
    ...textStyles.body,
    color: lightColors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  
  loadingContainer: {
    marginTop: spacing.xl,
  },
  
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  
  version: {
    ...textStyles.caption,
    color: lightColors.textInverse,
    opacity: 0.7,
  },
});

export default SplashScreen;
