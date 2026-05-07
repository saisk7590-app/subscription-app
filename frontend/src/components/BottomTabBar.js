import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../constants/theme';

const iconMap = {
  Dashboard: ({ color }) => <Feather name="home" size={24} color={color} />,
  Analytics: ({ color }) => <Feather name="bar-chart-2" size={24} color={color} />,
  Add: () => <Feather name="plus" size={24} color={theme.colors.white} />,
  History: ({ color }) => <MaterialIcons name="history" size={24} color={color} />,
  Reminders: ({ color }) => <Ionicons name="notifications-outline" size={24} color={color} />,
};

export default function BottomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const Icon = iconMap[route.name];

          if (route.name === 'Add') {
            return (
              <Pressable
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={styles.centerTab}
              >
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.centerButton}
                >
                  <Icon />
                </LinearGradient>
                <Text style={styles.centerLabel}>{label}</Text>
              </Pressable>
            );
          }

          const tint = focused ? theme.colors.primary : '#9CA3AF';

          return (
            <Pressable key={route.key} onPress={() => navigation.navigate(route.name)} style={styles.tab}>
              <Icon color={tint} />
              <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  tab: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  tabLabel: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
  },
  tabLabelFocused: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  centerTab: {
    alignItems: 'center',
    marginTop: -34,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.floating,
  },
  centerLabel: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
  },
});
