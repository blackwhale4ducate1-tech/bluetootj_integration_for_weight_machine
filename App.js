import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import 'react-native-gesture-handler';

// Context Providers
import { AuthProvider } from './src/context/AuthContext';
import { BluetoothProvider } from './src/context/BluetoothContext';
import { WeightProvider } from './src/context/WeightContext';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Theme
import { lightColors } from './src/theme/colors';

// Ignore specific warnings for development
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Remote debugger is in a background tab',
  'Require cycle:',
]);

const App = () => {
  return (
    <>
      <StatusBar 
        backgroundColor={lightColors.primary} 
        barStyle="light-content" 
      />
      
      <AuthProvider>
        <BluetoothProvider>
          <WeightProvider>
            <AppNavigator />
          </WeightProvider>
        </BluetoothProvider>
      </AuthProvider>
    </>
  );
};

export default App;
