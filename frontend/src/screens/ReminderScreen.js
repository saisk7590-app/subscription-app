import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import GradientHeader from '../components/GradientHeader';
import Screen from '../components/Screen';
import SurfaceCard from '../components/SurfaceCard';
import theme from '../constants/theme';
import { subscriptions } from '../data/mockData';
import { formatCurrency, formatDate, getDaysText, getDaysUntil } from '../utils/formatters';

export default function ReminderScreen() {
  const reminders = subscriptions
    .filter((item) => item.reminderEnabled)
    .map((item) => ({ ...item, daysUntil: getDaysUntil(item.nextDueDate) }))
    .filter((item) => item.daysUntil > 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const urgentReminders = reminders.filter((item) => item.daysUntil <= 3);
  const upcomingReminders = reminders.filter((item) => item.daysUntil > 3);

  return (
    <Screen>
      <GradientHeader title="Reminders" subtitle="Upcoming bill payments" />

      <View style={styles.content}>
        <SurfaceCard>
          <View style={styles.summaryRow}>
            <View style={styles.summaryIcon}>
              <Feather name="bell" size={24} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.summaryCount}>{reminders.length}</Text>
              <Text style={styles.summaryText}>Active reminders</Text>
            </View>
          </View>
        </SurfaceCard>

        {!!urgentReminders.length && (
          <View style={styles.section}>
            <View style={styles.sectionBadgeRow}>
              <View style={[styles.sectionBadgeIcon, { backgroundColor: '#FEE2E2' }]}>
                <Feather name="alert-circle" size={18} color={theme.colors.red} />
              </View>
              <Text style={[styles.sectionBadgeText, { color: theme.colors.red }]}>URGENT</Text>
            </View>
            <View style={styles.sectionList}>
              {urgentReminders.map((item) => (
                <View key={item.id} style={styles.urgentCard}>
                  <View style={styles.cardTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{item.serviceName}</Text>
                      <Text style={styles.cardMeta}>{item.category}</Text>
                    </View>
                    <Text style={[styles.cardAmount, { color: theme.colors.redDark }]}>{formatCurrency(item.price)}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <View style={styles.dueRow}>
                      <View style={styles.pulseDot} />
                      <Text style={styles.urgentDueText}>Due {getDaysText(item.daysUntil)}</Text>
                    </View>
                    <Text style={styles.footerDate}>{formatDate(item.nextDueDate)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {!!upcomingReminders.length && (
          <View style={styles.section}>
            <Text style={styles.upcomingTitle}>UPCOMING</Text>
            <View style={styles.sectionList}>
              {upcomingReminders.map((item) => (
                <SurfaceCard key={item.id}>
                  <View style={styles.cardTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>{item.serviceName}</Text>
                      <Text style={styles.cardMetaMuted}>{item.category}</Text>
                    </View>
                    <Text style={styles.cardAmount}>{formatCurrency(item.price)}</Text>
                  </View>
                  <View style={[styles.cardFooter, styles.normalFooter]}>
                    <View style={styles.dueRow}>
                      <View style={styles.normalDot} />
                      <Text style={styles.normalDueText}>Due {getDaysText(item.daysUntil)}</Text>
                    </View>
                    <Text style={styles.footerDate}>{formatDate(item.nextDueDate)}</Text>
                  </View>
                </SurfaceCard>
              ))}
            </View>
          </View>
        )}

        {!reminders.length && (
          <SurfaceCard style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Feather name="bell" size={28} color={theme.colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No upcoming reminders</Text>
            <Text style={styles.emptySubtitle}>All your bills are up to date or reminders are disabled</Text>
          </SurfaceCard>
        )}

        {!!reminders.length && (
          <LinearGradient colors={[theme.colors.primary, theme.colors.purple]} style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total Upcoming Payments</Text>
            <Text style={styles.totalValue}>{formatCurrency(reminders.reduce((sum, item) => sum + item.price, 0))}</Text>
            <Text style={styles.totalMeta}>Next 30 days</Text>
          </LinearGradient>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCount: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  summaryText: {
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  section: {
    gap: 16,
  },
  sectionBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  sectionBadgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBadgeText: {
    ...theme.typography.captionStrong,
  },
  sectionList: {
    gap: 16,
  },
  urgentCard: {
    backgroundColor: theme.colors.redSoft,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.red,
    borderRadius: theme.radius.lg,
    padding: 20,
    ...theme.shadows.floating,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  cardMeta: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  cardMetaMuted: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  cardAmount: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  cardFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  normalFooter: {
    borderTopColor: theme.colors.border,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.red,
  },
  normalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  urgentDueText: {
    color: theme.colors.redDark,
    ...theme.typography.bodyMedium,
  },
  normalDueText: {
    color: theme.colors.primary,
    ...theme.typography.bodyMedium,
  },
  footerDate: {
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  upcomingTitle: {
    paddingHorizontal: 4,
    color: theme.colors.textSecondary,
    ...theme.typography.captionStrong,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    ...theme.typography.h3,
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  totalCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    ...theme.shadows.floating,
  },
  totalLabel: {
    color: theme.colors.blueTextSoft,
    ...theme.typography.body,
  },
  totalValue: {
    marginTop: 8,
    color: theme.colors.white,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  totalMeta: {
    marginTop: 8,
    color: theme.colors.blueTextSoft,
    ...theme.typography.body,
  },
});
