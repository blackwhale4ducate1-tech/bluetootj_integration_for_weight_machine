import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens (placeholder for now - will create these next)
import ConnectScaleScreen from '../screens/weight/ConnectScaleScreen';
import MeasureScreen from '../screens/weight/MeasureScreen';
import HistoryScreen from '../screens/weight/HistoryScreen';

// Theme
import { lightColors } from '../theme/colors';
import { textStyles } from '../theme/fonts';

const Stack = createStackNavigator();

const WeightNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ConnectScale"
      screenOptions={{
        headerStyle: {
          backgroundColor: lightColors.card,
          borderBottomWidth: 1,
          borderBottomColor: lightColors.borderLight,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          ...textStyles.headerTitle,
          color: lightColors.text,
        },
        headerTintColor: lightColors.primary,
        headerBackTitleVisible: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="ConnectScale"
        component={ConnectScaleScreen}
        options={{
          title: 'Connect Scale',
          headerLeft: null, // Remove back button for main screen
        }}
      />
      
      <Stack.Screen
        name="Measure"
        component={MeasureScreen}
        options={{
          title: 'Measuring',
          gestureEnabled: false, // Prevent going back during measurement
        }}
      />
      
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Weight History',
        }}
      />
    </Stack.Navigator>
  );
};

export default WeightNavigator;
