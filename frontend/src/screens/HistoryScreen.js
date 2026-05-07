import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import GradientHeader from '../components/GradientHeader';
import Screen from '../components/Screen';
import SearchField from '../components/SearchField';
import SelectField from '../components/SelectField';
import SurfaceCard from '../components/SurfaceCard';
import theme from '../constants/theme';
import { categories, payments, subscriptions } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function HistoryScreen() {
  const [yearFilter, setYearFilter] = useState('2026');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const years = ['2024', '2025', '2026'];

  const filteredPayments = payments.filter((payment) => {
    const matchesYear = payment.date.startsWith(yearFilter);
    const matchesCategory = categoryFilter === 'All' || payment.category === categoryFilter;
    const matchesSearch = payment.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesCategory && matchesSearch;
  });

  const groupedByMonth = useMemo(() => {
    const sortedPayments = [...filteredPayments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sortedPayments.reduce((acc, payment) => {
      const month = new Date(payment.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      acc[month] = acc[month] || [];
      acc[month].push(payment);
      return acc;
    }, {});
  }, [filteredPayments]);

  const getSubscriptionStatus = (serviceName) => subscriptions.find((item) => item.serviceName === serviceName)?.status || 'Active';
  const getSubscriptionDates = (serviceName) => subscriptions.find((item) => item.serviceName === serviceName) || {};

  return (
    <Screen>
      <GradientHeader title="Payment History" subtitle="Track all your payments" />

      <View style={styles.content}>
        <SearchField value={searchQuery} onChangeText={setSearchQuery} placeholder="Search subscriptions..." />

        <View style={styles.filtersRow}>
          <SelectField value={yearFilter} options={years} onSelect={setYearFilter} label="Year" />
          <SelectField value={categoryFilter} options={['All', ...categories]} onSelect={setCategoryFilter} label="Category" />
        </View>

        <View style={styles.groupWrap}>
          {Object.keys(groupedByMonth).length === 0 ? (
            <SurfaceCard>
              <Text style={styles.emptyText}>No payments found</Text>
            </SurfaceCard>
          ) : (
            Object.entries(groupedByMonth).map(([month, monthPayments]) => (
              <View key={month} style={styles.monthSection}>
                <Text style={styles.monthTitle}>{month}</Text>
                <SurfaceCard style={styles.monthCard}>
                  {monthPayments.map((payment, index) => {
                    const status = getSubscriptionStatus(payment.serviceName);
                    const subscription = getSubscriptionDates(payment.serviceName);
                    const datesText = subscription.endDate === 'Present' || !subscription.endDate
                      ? `${formatDate(subscription.startDate)} - Present`
                      : `${formatDate(subscription.startDate)} - ${formatDate(subscription.endDate)}`;

                    return (
                      <View key={payment.id} style={[styles.paymentRow, index !== monthPayments.length - 1 && styles.paymentBorder]}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.paymentName}>{payment.serviceName}</Text>
                          <View style={styles.paymentMetaRow}>
                            <Text style={styles.paymentMeta}>{formatDate(payment.date)}</Text>
                            <Text style={styles.paymentDivider}>•</Text>
                            <View style={styles.categoryChip}>
                              <Text style={styles.categoryChipText}>{payment.category}</Text>
                            </View>
                          </View>
                          <View style={styles.paymentMetaRow}>
                            <Text style={styles.paymentMeta}>{datesText}</Text>
                            <View style={[styles.statusChip, status === 'Active' ? styles.activeStatus : styles.pausedStatus]}>
                              <Text style={[styles.statusText, status === 'Active' ? styles.activeStatusText : styles.pausedStatusText]}>{status}</Text>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.amountText}>{formatCurrency(payment.amount)}</Text>
                      </View>
                    );
                  })}
                </SurfaceCard>
              </View>
            ))
          )}
        </View>

        {!!filteredPayments.length && (
          <LinearGradient colors={[theme.colors.primary, theme.colors.purple]} style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Spent ({yearFilter})</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(filteredPayments.reduce((sum, item) => sum + item.amount, 0))}</Text>
            <Text style={styles.summaryMeta}>
              {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
            </Text>
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
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  groupWrap: {
    gap: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  monthSection: {
    gap: 12,
  },
  monthTitle: {
    paddingHorizontal: 4,
    color: theme.colors.textSecondary,
    ...theme.typography.captionStrong,
  },
  monthCard: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  paymentBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentName: {
    color: theme.colors.textPrimary,
    ...theme.typography.h3,
  },
  paymentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  paymentMeta: {
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
  },
  paymentDivider: {
    color: theme.colors.textMuted,
  },
  categoryChip: {
    borderRadius: theme.radius.pill,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryChipText: {
    color: theme.colors.primary,
    ...theme.typography.captionStrong,
  },
  statusChip: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeStatus: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  pausedStatus: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  statusText: {
    ...theme.typography.captionStrong,
  },
  activeStatusText: {
    color: theme.colors.green,
  },
  pausedStatusText: {
    color: '#EA580C',
  },
  amountText: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  summaryCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    ...theme.shadows.floating,
  },
  summaryLabel: {
    color: theme.colors.blueTextSoft,
    ...theme.typography.body,
  },
  summaryAmount: {
    marginTop: 8,
    color: theme.colors.white,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
  summaryMeta: {
    marginTop: 8,
    color: theme.colors.blueTextSoft,
    ...theme.typography.body,
  },
});
