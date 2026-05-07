import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import SearchField from '../components/SearchField';
import SelectField from '../components/SelectField';
import SurfaceCard from '../components/SurfaceCard';
import theme from '../constants/theme';
import { subscriptions, yearlySpendingData } from '../data/mockData';
import { formatCurrency, getYearlyPrice } from '../utils/formatters';

export default function StatsScreen({ navigation }) {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');

  const years = ['2024', '2025', '2026'];
  const currentYearData = yearlySpendingData.find((item) => item.year === selectedYear);
  const previousYearData = yearlySpendingData.find((item) => item.year === String(Number(selectedYear) - 1));

  let percentageChange = 0;
  if (currentYearData && previousYearData && previousYearData.amount > 0) {
    percentageChange = ((currentYearData.amount - previousYearData.amount) / previousYearData.amount) * 100;
  }

  const categoryTotals = useMemo(
    () =>
      subscriptions.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + getYearlyPrice(item);
        return acc;
      }, {}),
    []
  );

  const totalYearlySpending = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
  const categoriesWithPercentage = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalYearlySpending ? (amount / totalYearlySpending) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const serviceTotals = subscriptions
    .map((item) => ({ ...item, yearlyTotal: getYearlyPrice(item) }))
    .filter((item) => item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.yearlyTotal - a.yearlyTotal);

  const insights = [];
  if (categoriesWithPercentage[0]) {
    if (percentageChange > 0) {
      insights.push(`${categoriesWithPercentage[0].category} increased by ${Math.abs(Math.round(percentageChange))}% this year`);
    }
    insights.push(`${categoriesWithPercentage[0].category} is your highest spending category`);
  }
  insights.push(`You spent ${formatCurrency(subscriptions.filter((item) => item.category === 'OTT').reduce((sum, item) => sum + getYearlyPrice(item) * 3, 0))} on OTT in last 3 years`);

  return (
    <View style={styles.container}>
      <SearchField value={searchQuery} onChangeText={setSearchQuery} placeholder="Search subscriptions..." />
      <SelectField value={selectedYear} options={years} onSelect={setSelectedYear} label="Year" />

      <SurfaceCard style={styles.summaryCard}>
        <Text style={styles.mutedLabel}>Total Spending</Text>
        <Text style={styles.summaryValue}>{formatCurrency(currentYearData ? currentYearData.amount : totalYearlySpending)}</Text>
        {percentageChange !== 0 && (
          <View style={[styles.changePill, percentageChange > 0 ? styles.changePositive : styles.changeNegative]}>
            <Feather
              name={percentageChange > 0 ? 'trending-up' : 'trending-down'}
              size={16}
              color={percentageChange > 0 ? theme.colors.green : theme.colors.red}
            />
            <Text style={[styles.changeText, percentageChange > 0 ? styles.changeTextPositive : styles.changeTextNegative]}>
              {Math.abs(Math.round(percentageChange))}% vs {Number(selectedYear) - 1}
            </Text>
          </View>
        )}
      </SurfaceCard>

      <SurfaceCard>
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        <View style={styles.columnGap}>
          {categoriesWithPercentage.map((item) => (
            <View key={item.category} style={styles.breakdownRow}>
              <View>
                <Text style={styles.rowTitle}>{item.category}</Text>
                <Text style={styles.rowSubtitle}>{Math.round(item.percentage)}% of total</Text>
              </View>
              <Text style={styles.rowValue}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>
      </SurfaceCard>

      <View style={styles.insightCard}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.columnGap}>
          {insights.map((insight) => (
            <View key={insight} style={styles.insightRow}>
              <View style={styles.insightDot} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      </View>

      <SurfaceCard>
        <Text style={styles.sectionTitle}>All Services</Text>
        {serviceTotals.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No data available</Text>
            <Text style={styles.emptySubtitle}>Add subscription to get insights</Text>
          </View>
        ) : (
          <View style={styles.serviceList}>
            {serviceTotals.map((service) => (
              <Pressable
                key={service.id}
                style={styles.serviceRow}
                onPress={() => navigation.navigate('ServiceDetails', { serviceName: service.serviceName })}
              >
                <View>
                  <Text style={styles.rowTitle}>{service.serviceName}</Text>
                  <Text style={styles.rowSubtitle}>{service.billingType}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.rowValue}>{formatCurrency(service.yearlyTotal)}</Text>
                  <Text style={styles.yearlyLabel}>yearly</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </SurfaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  summaryCard: {
    padding: 28,
  },
  mutedLabel: {
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  summaryValue: {
    marginTop: 12,
    color: theme.colors.textPrimary,
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '700',
  },
  changePill: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  changePositive: {
    backgroundColor: theme.colors.greenSoft,
  },
  changeNegative: {
    backgroundColor: theme.colors.redSoft,
  },
  changeText: {
    ...theme.typography.captionStrong,
  },
  changeTextPositive: {
    color: theme.colors.green,
  },
  changeTextNegative: {
    color: theme.colors.red,
  },
  sectionTitle: {
    marginBottom: 16,
    color: theme.colors.textPrimary,
    ...theme.typography.h2,
  },
  columnGap: {
    gap: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    color: theme.colors.textPrimary,
    ...theme.typography.h3,
  },
  rowSubtitle: {
    marginTop: 2,
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  rowValue: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  insightCard: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    borderRadius: theme.radius.lg,
    padding: 24,
    ...theme.shadows.card,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    backgroundColor: theme.colors.primary,
  },
  insightText: {
    flex: 1,
    color: '#1E3A8A',
    ...theme.typography.body,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    color: theme.colors.textSecondary,
    ...theme.typography.bodyMedium,
  },
  emptySubtitle: {
    marginTop: 4,
    color: theme.colors.textMuted,
    ...theme.typography.body,
  },
  serviceList: {
    gap: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  yearlyLabel: {
    color: theme.colors.textMuted,
    ...theme.typography.caption,
  },
});
