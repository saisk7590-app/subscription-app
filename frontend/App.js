import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Theme from './src/constants/theme';
import DashboardScreen from './src/screens/DashboardScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AddSubscriptionScreen from './src/screens/AddSubscriptionScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import ReminderScreen from './src/screens/ReminderScreen';
import ServiceDetailsScreen from './src/screens/ServiceDetailsScreen';

const tabs = [
  { key: 'Dashboard', label: 'Dashboard', icon: 'home' },
  { key: 'Analytics', label: 'Analytics', icon: 'bar-chart-2' },
  { key: 'Add', label: 'Add', icon: 'plus', center: true },
  { key: 'History', label: 'History', icon: 'history' },
  { key: 'Reminders', label: 'Reminders', icon: 'notifications-none' },
];

function TabIcon({ tab, active }) {
  if (tab.center) {
    return (
      <LinearGradient
        colors={[Theme.colors.primaryLight, Theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.centerButton}
      >
        <Feather name="plus" size={Theme.typography.fontSize.xl} color={Theme.colors.white} />
      </LinearGradient>
    );
  }

  if (tab.key === 'Analytics') {
    return (
      <Feather
        name="bar-chart-2"
        size={Theme.typography.fontSize.xl}
        color={active ? Theme.colors.primary : Theme.colors.textMuted}
      />
    );
  }

  if (tab.key === 'History') {
    return (
      <MaterialIcons
        name="history"
        size={Theme.typography.fontSize.xl}
        color={active ? Theme.colors.primary : Theme.colors.textMuted}
      />
    );
  }

  if (tab.key === 'Reminders') {
    return (
      <Ionicons
        name="notifications-outline"
        size={Theme.typography.fontSize.xl}
        color={active ? Theme.colors.primary : Theme.colors.textMuted}
      />
    );
  }

  return (
    <Feather
      name="home"
      size={Theme.typography.fontSize.xl}
      color={active ? Theme.colors.primary : Theme.colors.textMuted}
    />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedServiceName, setSelectedServiceName] = useState(null);

  const handleSelectService = (name) => {
    setSelectedServiceName(name);
  };

  const handleBack = () => {
    setSelectedServiceName(null);
  };

  let screen;

  if (selectedServiceName) {
    screen = <ServiceDetailsScreen serviceName={selectedServiceName} onBack={handleBack} />;
  } else {
    if (activeTab === 'Dashboard') {
      screen = <DashboardScreen onSelectService={handleSelectService} />;
    } else if (activeTab === 'Analytics') {
      screen = <AnalyticsScreen onSelectService={handleSelectService} />;
    } else if (activeTab === 'Add') {
      screen = <AddSubscriptionScreen onBack={() => setActiveTab('Dashboard')} />;
    } else if (activeTab === 'History') {
      screen = <HistoryScreen onSelectService={handleSelectService} />;
    } else if (activeTab === 'Reminders') {
      screen = <ReminderScreen onSelectService={handleSelectService} />;
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" backgroundColor={Theme.colors.background} />
        <View style={styles.container}>
          <View style={styles.screen}>{screen}</View>
          {!selectedServiceName && (
            <View style={styles.bottomBar}>
              {tabs.map((tab) => {
                const active = activeTab === tab.key;

                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => {
                      setActiveTab(tab.key);
                      setSelectedServiceName(null);
                    }}
                    style={[styles.tabButton, tab.center && styles.centerTabButton]}
                  >
                    <TabIcon tab={tab} active={active} />
                    <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  screen: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.sm,
  },
  tabButton: {
    minWidth: Theme.spacing.xl + Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTabButton: {
    marginTop: -Theme.spacing.lg,
  },
  centerButton: {
    width: Theme.spacing.xl + Theme.spacing.xl - Theme.spacing.xs,
    height: Theme.spacing.xl + Theme.spacing.xl - Theme.spacing.xs,
    borderRadius: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: Theme.spacing.xs,
    color: Theme.colors.textSecondary,
    fontSize: Theme.typography.fontSize.xs,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  activeTabLabel: {
    color: Theme.colors.primary,
  },
});
