import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import SimpleDonutChart from '../components/charts/SimpleDonutChart';
import Screen from '../components/Screen';
import GradientHeader from '../components/GradientHeader';
import SurfaceCard from '../components/SurfaceCard';
import theme from '../constants/theme';
import { subscriptions, yearlySpendingData } from '../data/mockData';
import { formatCurrency, formatMonthYear, getDaysUntil, getMonthlyPrice, getYearlyPrice } from '../utils/formatters';

const chartColors = [theme.colors.primary, theme.colors.purple, theme.colors.cyan, theme.colors.green, theme.colors.amber];

const categoryIconMap = {
  OTT: { icon: 'television-play', background: theme.colors.blueSoft, color: theme.colors.primary },
  Mobile: { icon: 'cellphone', background: theme.colors.purpleSoft, color: theme.colors.purple },
  Internet: { icon: 'wifi', background: theme.colors.cyanSoft, color: theme.colors.cyan },
  DTH: { icon: 'satellite-variant', background: theme.colors.greenSoft, color: theme.colors.green },
};

export default function DashboardScreen({ navigation }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = formatMonthYear();
  const currentYearData = yearlySpendingData.find((item) => item.year === String(currentYear));
  const previousYearData = yearlySpendingData.find((item) => item.year === String(currentYear - 1));

  let percentageChange = 0;
  if (currentYearData && previousYearData && previousYearData.amount > 0) {
    percentageChange = ((currentYearData.amount - previousYearData.amount) / previousYearData.amount) * 100;
  }

  const categoryTotalsMap = subscriptions.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + getYearlyPrice(item);
    return acc;
  }, {});

  const topCategoriesKPI = Object.entries(categoryTotalsMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  const categoryData = subscriptions.reduce((acc, item) => {
    const existing = acc.find((entry) => entry.name === item.category);
    const monthlyPrice = getMonthlyPrice(item);

    if (existing) {
      existing.value += monthlyPrice;
      return acc;
    }

    acc.push({ name: item.category, value: monthlyPrice });
    return acc;
  }, []);

  const topCategories = [...categoryData].sort((a, b) => b.value - a.value).slice(0, 5);
  const topServices = [...subscriptions]
    .map((item) => ({ ...item, monthlyPrice: getMonthlyPrice(item) }))
    .sort((a, b) => b.monthlyPrice - a.monthlyPrice)
    .slice(0, 3);

  const upcomingDue = subscriptions.find((item) => {
    const days = getDaysUntil(item.nextDueDate);
    return days > 0 && days <= 7;
  });

  return (
    <Screen>
      <GradientHeader title="Hello, Sai" subtitle={currentMonth} />

      <View style={styles.content}>
        <Pressable onPress={() => navigation.navigate('Analytics', { initialTab: 'analytics' })} style={styles.pressableCard}>
          <SurfaceCard style={styles.mainCard}>
            <Text style={styles.subtleLabel}>Total Yearly Spending</Text>
            <Text style={styles.kpiValue}>{formatCurrency(currentYearData ? currentYearData.amount : 0)}</Text>
            <Text style={styles.kpiYear}>{currentYear}</Text>
            {percentageChange !== 0 && (
              <View style={[styles.trendPill, percentageChange > 0 ? styles.trendUp : styles.trendDown]}>
                <Feather
                  name={percentageChange > 0 ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={percentageChange > 0 ? theme.colors.green : theme.colors.red}
                />
                <Text style={[styles.trendText, percentageChange > 0 ? styles.trendTextUp : styles.trendTextDown]}>
                  {Math.abs(Math.round(percentageChange))}% vs {currentYear - 1}
                </Text>
              </View>
            )}
          </SurfaceCard>
        </Pressable>

        <View style={styles.kpiGrid}>
          {topCategoriesKPI.map((item) => {
            const config = categoryIconMap[item.category] || categoryIconMap.OTT;

            return (
              <Pressable
                key={item.category}
                style={styles.kpiTile}
                onPress={() => navigation.navigate('Analytics', { initialTab: 'stats', category: item.category })}
              >
                <SurfaceCard style={styles.tileCard}>
                  <View style={styles.tileHeader}>
                    <View style={[styles.tileIconWrap, { backgroundColor: config.background }]}>
                      <MaterialCommunityIcons name={config.icon} size={16} color={config.color} />
                    </View>
                    <Text style={styles.tileTag}>{item.category}</Text>
                  </View>
                  <Text style={styles.tileValue}>{formatCurrency(item.amount)}</Text>
                </SurfaceCard>
              </Pressable>
            );
          })}
        </View>

        {!!topCategoriesKPI.length && (
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Text style={styles.insightBulb}>💡</Text>
            </View>
            <Text style={styles.insightText}>
              {topCategoriesKPI[0].category} is your highest spending category at {formatCurrency(topCategoriesKPI[0].amount)} this year
            </Text>
          </View>
        )}

        <SurfaceCard>
          <Text style={styles.sectionTitle}>Category Distribution</Text>
          <View style={styles.pieWrap}>
            <SimpleDonutChart
              data={topCategories.slice(0, 4).map((item, index) => ({
                label: item.name,
                value: Math.round(item.value),
                color: chartColors[index % chartColors.length],
              }))}
              size={150}
              strokeWidth={24}
              valueFormatter={formatCurrency}
            />
          </View>
        </SurfaceCard>

        <SurfaceCard>
          <Text style={styles.sectionTitle}>Top Services</Text>
          <View style={styles.serviceList}>
            {topServices.map((service) => (
              <Pressable
                key={service.id}
                style={styles.serviceRow}
                onPress={() => navigation.navigate('ServiceDetails', { serviceName: service.serviceName })}
              >
                <View>
                  <Text style={styles.serviceName}>{service.serviceName}</Text>
                  <Text style={styles.serviceMeta}>{service.category}</Text>
                </View>
                <View style={styles.servicePriceWrap}>
                  <Text style={styles.servicePrice}>{formatCurrency(service.monthlyPrice)}</Text>
                  <Text style={styles.servicePriceMeta}>/month</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </SurfaceCard>

        {upcomingDue && (
          <View style={styles.alertCard}>
            <View style={styles.alertIcon}>
              <Feather name="alert-circle" size={20} color={theme.colors.red} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>
                {upcomingDue.serviceName} due in {getDaysUntil(upcomingDue.nextDueDate)} days
              </Text>
              <Text style={styles.alertMeta}>
                {formatCurrency(upcomingDue.price)} • {upcomingDue.nextDueDate}
              </Text>
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    marginTop: -16,
    gap: 24,
  },
  pressableCard: {
    borderRadius: theme.radius.lg,
  },
  mainCard: {
    padding: 28,
  },
  subtleLabel: {
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  kpiValue: {
    marginTop: 12,
    color: theme.colors.textPrimary,
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '700',
  },
  kpiYear: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  trendPill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  trendUp: {
    backgroundColor: theme.colors.greenSoft,
  },
  trendDown: {
    backgroundColor: theme.colors.redSoft,
  },
  trendText: {
    ...theme.typography.captionStrong,
  },
  trendTextUp: {
    color: theme.colors.green,
  },
  trendTextDown: {
    color: theme.colors.red,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  kpiTile: {
    width: '48%',
  },
  tileCard: {
    padding: 16,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tileIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTag: {
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    ...theme.typography.captionStrong,
  },
  tileValue: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    backgroundColor: '#FAF5FF',
    padding: 20,
    ...theme.shadows.card,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBulb: {
    fontSize: 18,
  },
  insightText: {
    flex: 1,
    color: '#581C87',
    ...theme.typography.bodyMedium,
  },
  sectionTitle: {
    marginBottom: 16,
    color: theme.colors.textPrimary,
    ...theme.typography.h2,
  },
  pieWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceList: {
    gap: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    color: theme.colors.textPrimary,
    ...theme.typography.h3,
  },
  serviceMeta: {
    marginTop: 2,
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  servicePriceWrap: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  servicePriceMeta: {
    color: theme.colors.textMuted,
    ...theme.typography.caption,
  },
  alertCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: theme.colors.redSoft,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.red,
    borderRadius: theme.radius.md,
    padding: 20,
    ...theme.shadows.card,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    color: theme.colors.redDark,
    ...theme.typography.bodyMedium,
  },
  alertMeta: {
    marginTop: 4,
    color: '#B45309',
    ...theme.typography.caption,
  },
});
