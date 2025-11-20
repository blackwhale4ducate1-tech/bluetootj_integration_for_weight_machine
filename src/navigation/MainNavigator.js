import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

// Navigators
import WeightNavigator from './WeightNavigator';

// Screens (placeholder for now)
import HomeScreen from '../screens/weight/HomeScreen';
import StatsScreen from '../screens/weight/StatsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Theme
import { lightColors } from '../theme/colors';
import { textStyles } from '../theme/fonts';
import { layout } from '../theme/spacing';

const Tab = createBottomTabNavigator();

// Tab bar icon component
const TabIcon = ({ icon, focused, label }) => (
  <View style={styles.tabIcon}>
    <Text style={[styles.tabIconText, focused && styles.tabIconFocused]}>
      {icon}
    </Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
      {label}
    </Text>
  </View>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      // Start the app directly on the Weight (Bluetooth) tab
      initialRouteName="WeightNavigator"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarActiveTintColor: lightColors.primary,
        tabBarInactiveTintColor: lightColors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" focused={focused} label="Home" />
          ),
        }}
      />
      
      <Tab.Screen
        name="WeightNavigator"
        component={WeightNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⚖️" focused={focused} label="Scale" />
          ),
          title: 'Scale',
        }}
      />
      
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📊" focused={focused} label="Stats" />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" focused={focused} label="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: lightColors.card,
    borderTopWidth: 1,
    borderTopColor: lightColors.borderLight,
    height: layout.tabBarHeight,
    paddingBottom: layout.tabBarPadding,
    paddingTop: layout.tabBarPadding,
  },
  
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  
  tabIconText: {
    fontSize: 20,
    marginBottom: 2,
  },
  
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  
  tabLabel: {
    ...textStyles.tabLabel,
    color: lightColors.textSecondary,
  },
  
  tabLabelFocused: {
    color: lightColors.primary,
    fontWeight: '600',
  },
});

export default MainNavigator;
