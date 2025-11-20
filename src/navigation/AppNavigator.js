import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Main app navigator (tabs)
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

// Simple root navigator: always load MainNavigator, no auth flow
const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={{
          animationEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
