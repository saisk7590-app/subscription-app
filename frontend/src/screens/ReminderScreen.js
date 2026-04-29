import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';

import Theme from '../constants/theme';
import { subscriptions } from '../features/analytics/analyticsData';

function formatCurrency(value) {
  return `₹${value.toLocaleString()}`;
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function getDaysUntil(dateString) {
  const today = new Date();
  const dueDate = new Date(dateString);
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getDaysText(days) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `in ${days} days`;
}

export default function ReminderScreen({ onSelectService }) {
  const reminders = useMemo(() => {
    return subscriptions
      .filter(sub => sub.reminderEnabled)
      .map(sub => ({
        ...sub,
        daysUntil: getDaysUntil(sub.nextDueDate),
      }))
      .filter(sub => sub.daysUntil > 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, []);

  const urgentReminders = useMemo(() => reminders.filter(r => r.daysUntil <= 3), [reminders]);
  const upcomingReminders = useMemo(() => reminders.filter(r => r.daysUntil > 3), [reminders]);

  const flatData = useMemo(() => {
    const data = [];
    data.push({ type: 'summary' });
    if (urgentReminders.length > 0) {
      data.push({ type: 'section_header', value: 'URGENT', icon: 'alert-circle', color: '#ef4444' });
      urgentReminders.forEach(r => data.push({ type: 'reminder', value: r, isUrgent: true }));
    }
    if (upcomingReminders.length > 0) {
      data.push({ type: 'section_header', value: 'UPCOMING', color: '#64748b' });
      upcomingReminders.forEach(r => data.push({ type: 'reminder', value: r, isUrgent: false }));
    }
    if (reminders.length > 0) {
      data.push({ type: 'total_upcoming' });
    }
    return data;
  }, [reminders, urgentReminders, upcomingReminders]);

  const renderHeader = () => (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.header}>
      <Text style={styles.headerTitle}>Reminders</Text>
      <Text style={styles.headerSubtitle}>Upcoming bill payments</Text>
    </LinearGradient>
  );

  const renderItem = ({ item }) => {
    if (item.type === 'summary') {
      return (
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconBox}>
            <Ionicons name="notifications-outline" size={24} color="#2563eb" />
          </View>
          <View>
            <Text style={styles.summaryCount}>{reminders.length}</Text>
            <Text style={styles.summaryLabel}>Active reminders</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'section_header') {
      return (
        <View style={styles.sectionHeader}>
          {item.icon && <Feather name={item.icon} size={18} color={item.color} style={{ marginRight: 8 }} />}
          <Text style={[styles.sectionTitle, { color: item.color }]}>{item.value}</Text>
        </View>
      );
    }

    if (item.type === 'reminder') {
      const r = item.value;
      return (
        <Pressable 
          onPress={() => onSelectService(r.serviceName)}
          style={[styles.reminderCard, item.isUrgent ? styles.urgentCard : styles.upcomingCard]}
        >
          <View style={styles.reminderTop}>
            <View>
              <Text style={styles.reminderName}>{r.serviceName}</Text>
              <Text style={styles.reminderCategory}>{r.category}</Text>
            </View>
            <Text style={[styles.reminderPrice, { color: item.isUrgent ? '#dc2626' : '#0f172a' }]}>{formatCurrency(r.price)}</Text>
          </View>
          <View style={[styles.reminderFooter, { borderTopColor: item.isUrgent ? '#fecaca' : '#f1f5f9' }]}>
            <View style={styles.dueRow}>
              <View style={[styles.dueDot, { backgroundColor: item.isUrgent ? '#ef4444' : '#3b82f6' }]} />
              <Text style={[styles.dueText, { color: item.isUrgent ? '#b91c1c' : '#2563eb' }]}>
                Due {getDaysText(r.daysUntil)}
              </Text>
            </View>
            <Text style={styles.dueDateText}>{formatDate(r.nextDueDate)}</Text>
          </View>
        </Pressable>
      );
    }

    if (item.type === 'total_upcoming') {
      return (
        <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Upcoming Payments</Text>
          <Text style={styles.totalValue}>
            {formatCurrency(reminders.reduce((sum, r) => sum + r.price, 0))}
          </Text>
          <Text style={styles.totalMeta}>Next 30 days</Text>
        </LinearGradient>
      );
    }

    return null;
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={flatData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="notifications-off-outline" size={32} color="#94a3b8" />
            </View>
            <Text style={styles.emptyTitle}>No upcoming reminders</Text>
            <Text style={styles.emptyText}>All your bills are up to date or reminders are disabled</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#dbeafe',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCount: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '700',
  },
  summaryLabel: {
    color: '#64748b',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  reminderCard: {
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  urgentCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  upcomingCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reminderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reminderName: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
  },
  reminderCategory: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 2,
  },
  reminderPrice: {
    fontSize: 20,
    fontWeight: '700',
  },
  reminderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dueText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dueDateText: {
    color: '#64748b',
    fontSize: 14,
  },
  totalCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  totalLabel: {
    color: '#dbeafe',
    fontSize: 14,
    marginBottom: 8,
  },
  totalValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  totalMeta: {
    color: '#dbeafe',
    fontSize: 14,
    marginTop: 8,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
