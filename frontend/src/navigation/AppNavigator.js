import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';

import theme from '../constants/theme';
import DashboardScreen from '../screens/DashboardScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import AddSubscriptionScreen from '../screens/AddSubscriptionScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ReminderScreen from '../screens/ReminderScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Add"
      screenOptions={({ route }) => ({
        headerShown: false,
        lazy: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 62,
          paddingTop: 6,
          paddingBottom: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') {
            return <Feather name="home" size={size} color={color} />;
          }
          if (route.name === 'Analytics') {
            return <Feather name="bar-chart-2" size={size} color={color} />;
          }
          if (route.name === 'Add') {
            return <Feather name="plus-circle" size={size} color={color} />;
          }
          if (route.name === 'History') {
            return <MaterialIcons name="history" size={size} color={color} />;
          }
          return <Ionicons name="notifications-outline" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ tabBarLabel: 'Analytics' }} />
      <Tab.Screen name="Add" component={AddSubscriptionScreen} options={{ tabBarLabel: 'Add' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: 'History' }} />
      <Tab.Screen name="Reminders" component={ReminderScreen} options={{ tabBarLabel: 'Reminders' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
