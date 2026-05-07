import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import GradientHeader from '../components/GradientHeader';
import Screen from '../components/Screen';
import SelectField from '../components/SelectField';
import SurfaceCard from '../components/SurfaceCard';
import InteractiveBarChart from '../components/charts/InteractiveBarChart';
import InteractiveHorizontalBarChart from '../components/charts/InteractiveHorizontalBarChart';
import InteractiveLineChart from '../components/charts/InteractiveLineChart';
import SimpleDonutChart from '../components/charts/SimpleDonutChart';
import theme from '../constants/theme';
import { ottSpendingData, priceHistory, subscriptions, yearlySpendingData } from '../data/mockData';
import { formatCurrency, getMonthlyPrice } from '../utils/formatters';
import StatsScreen from './StatsScreen';

const chartColors = [theme.colors.primary, theme.colors.purple, theme.colors.cyan, theme.colors.green, theme.colors.amber];

export default function AnalyticsScreen({ navigation, route }) {
  const [activeTab, setActiveTab] = useState(route.params?.initialTab === 'stats' ? 'stats' : 'analytics');
  const [selectedService, setSelectedService] = useState('Netflix');
  const serviceNames = Array.from(new Set(subscriptions.map((item) => item.serviceName)));

  useEffect(() => {
    setActiveTab(route.params?.initialTab === 'stats' ? 'stats' : 'analytics');
  }, [route.params?.initialTab]);

  const categoryData = useMemo(
    () =>
      subscriptions.reduce((acc, item) => {
        const existing = acc.find((entry) => entry.name === item.category);
        const monthlyPrice = getMonthlyPrice(item);

        if (existing) {
          existing.value += monthlyPrice;
          return acc;
        }

        acc.push({ name: item.category, value: monthlyPrice });
        return acc;
      }, []),
    []
  );

  const topServicesData = [...subscriptions]
    .map((item) => ({ label: item.serviceName, value: Math.round(getMonthlyPrice(item)) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const priceData = (priceHistory[selectedService] || []).map((item) => ({
    title: selectedService,
    value: item.price,
    label: `${item.month} 2026`,
  }));

  return (
    <Screen>
      <GradientHeader title="Analytics" subtitle="Subscription insights">
        <View style={styles.segmentWrap}>
          {['analytics', 'stats'].map((item) => {
            const selected = activeTab === item;
            return (
              <Pressable key={item} onPress={() => setActiveTab(item)} style={[styles.segmentButton, selected && styles.segmentButtonActive]}>
                <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>
                  {item === 'analytics' ? 'Analytics' : 'Stats'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GradientHeader>

      <View style={styles.content}>
        {activeTab === 'analytics' ? (
          <>
            <SurfaceCard>
              <Text style={styles.sectionTitle}>Category Distribution</Text>
              <View style={styles.chartCenter}>
                <SimpleDonutChart
                  data={categoryData.map((item, index) => ({
                    label: item.name,
                    value: Math.round(item.value),
                    color: chartColors[index % chartColors.length],
                  }))}
                  size={190}
                  strokeWidth={34}
                  valueFormatter={formatCurrency}
                />
              </View>
            </SurfaceCard>

            <SurfaceCard>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Yearly Spending</Text>
                <View style={styles.filterPills}>
                  {['1Y', '3Y', '5Y', '10Y'].map((filter) => (
                    <View key={filter} style={[styles.filterPill, filter === '3Y' && styles.filterPillActive]}>
                      <Text style={[styles.filterPillText, filter === '3Y' && styles.filterPillTextActive]}>{filter}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <InteractiveBarChart
                data={yearlySpendingData.map((item) => ({
                  value: item.amount,
                  label: item.year,
                  color: theme.colors.primary,
                }))}
                valueFormatter={formatCurrency}
              />
            </SurfaceCard>

            <SurfaceCard>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Price Trend</Text>
                <View style={styles.filterPills}>
                  {['1Y', '3Y', '5Y'].map((filter) => (
                    <View key={filter} style={[styles.filterPill, filter === '1Y' && styles.filterPillActive]}>
                      <Text style={[styles.filterPillText, filter === '1Y' && styles.filterPillTextActive]}>{filter}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <SelectField value={selectedService} options={serviceNames} onSelect={setSelectedService} label="Service" placeholder="Select service" />
              <View style={styles.chartSpacing} />
              <InteractiveLineChart
                data={priceData}
                color={theme.colors.purple}
                fill="#EDE9FE"
                valueFormatter={formatCurrency}
              />
            </SurfaceCard>

            <SurfaceCard>
              <Text style={styles.sectionTitle}>OTT Spending Trend</Text>
              <InteractiveLineChart
                data={ottSpendingData.map((item) => ({
                  title: 'OTT',
                  value: item.amount,
                  label: `${item.month} 2026`,
                }))}
                color={theme.colors.green}
                valueFormatter={formatCurrency}
              />
            </SurfaceCard>

            <SurfaceCard>
              <Text style={styles.sectionTitle}>Top Services by Spending</Text>
              <InteractiveHorizontalBarChart
                data={topServicesData.map((item) => ({
                  value: item.value,
                  label: item.label,
                  color: theme.colors.cyan,
                }))}
                valueFormatter={formatCurrency}
              />
            </SurfaceCard>
          </>
        ) : (
          <StatsScreen navigation={navigation} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  segmentWrap: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  segmentButton: {
    flex: 1,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(37, 99, 235, 0.34)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.white,
  },
  segmentText: {
    color: theme.colors.white,
    ...theme.typography.bodyMedium,
  },
  segmentTextActive: {
    color: theme.colors.primary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 24,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    ...theme.typography.h2,
  },
  sectionHeader: {
    marginBottom: 20,
    gap: 12,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
  },
  filterPillText: {
    color: theme.colors.textSecondary,
    ...theme.typography.captionStrong,
  },
  filterPillTextActive: {
    color: theme.colors.white,
  },
  chartCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartSpacing: {
    height: 20,
  },
});
