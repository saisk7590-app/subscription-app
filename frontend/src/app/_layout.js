import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import theme from '../constants/theme';

function AddTabButton({ accessibilityState, onPress, ...props }) {
  const focused = accessibilityState?.selected;

  return (
    <Pressable onPress={onPress} style={styles.addTabWrapper} {...props}>
      <View style={[styles.addButton, focused && styles.addButtonFocused]}>
        <Text style={styles.addButtonPlus}>+</Text>
      </View>
      <Text style={[styles.addTabLabel, focused && styles.focusedLabel]}>Add</Text>
    </Pressable>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.secondaryText,
          tabBarLabelStyle: styles.tabLabel,
          sceneStyle: styles.scene,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Dashboard',
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarLabel: 'Analytics',
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'Add',
            tabBarButton: (props) => <AddTabButton {...props} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarLabel: 'History',
          }}
        />
        <Tabs.Screen
          name="reminders"
          options={{
            title: 'Reminders',
            tabBarLabel: 'Reminders',
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: theme.colors.background,
  },
  tabBar: {
    height: theme.spacing.xl * 2 + theme.spacing.md + theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  tabLabel: {
    ...theme.typography.caption,
  },
  addTabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -theme.spacing.lg + theme.spacing.xs,
    minWidth: theme.spacing.xl * 2 + theme.spacing.sm,
  },
  addButton: {
    width: theme.spacing.xl + theme.spacing.lg + theme.spacing.xs,
    height: theme.spacing.xl + theme.spacing.lg + theme.spacing.xs,
    borderRadius: theme.spacing.xl,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: theme.shadows.floating.shadowOffset,
    shadowOpacity: theme.shadows.floating.shadowOpacity,
    shadowRadius: theme.shadows.floating.shadowRadius,
    elevation: theme.shadows.floating.elevation,
  },
  addButtonFocused: {
    transform: [{ scale: 1.04 }],
  },
  addButtonPlus: {
    ...theme.typography.title,
    color: theme.colors.surface,
  },
  addTabLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  focusedLabel: {
    color: theme.colors.primary,
  },
});
