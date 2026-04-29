import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Svg, { Path, G, Circle } from 'react-native-svg';

import Theme from '../constants/theme';
import { subscriptions, yearlySpendingData } from '../features/analytics/analyticsData';

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString()}`;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export default function DashboardScreen({ onSelectService }) {
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const currentYear = new Date().getFullYear();

  // Calculations from Figma source
  const totalYearlySpending = useMemo(() => subscriptions.reduce((sum, sub) => {
    return sum + (sub.billingType === 'Monthly' ? sub.price * 12 : sub.price);
  }, 0), []);

  const currentYearData = yearlySpendingData.find(d => d.year === String(currentYear));
  const previousYearData = yearlySpendingData.find(d => d.year === String(currentYear - 1));

  const percentageChange = useMemo(() => {
    if (currentYearData && previousYearData && previousYearData.amount > 0) {
      return ((currentYearData.amount - previousYearData.amount) / previousYearData.amount) * 100;
    }
    return 0;
  }, [currentYearData, previousYearData]);

  const categoryTotals = useMemo(() => subscriptions.reduce((acc, sub) => {
    const yearlyPrice = sub.billingType === 'Monthly' ? sub.price * 12 : sub.price;
    acc[sub.category] = (acc[sub.category] || 0) + yearlyPrice;
    return acc;
  }, {}), []);

  const topCategories = useMemo(() => Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3), [categoryTotals]);

  const categoryDistribution = useMemo(() => subscriptions.reduce((acc, sub) => {
    const monthlyPrice = sub.billingType === 'Yearly' ? sub.price / 12 : sub.price;
    const existing = acc.find(item => item.name === sub.category);
    if (existing) {
      existing.value += monthlyPrice;
    } else {
      acc.push({ name: sub.category, value: monthlyPrice });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value).slice(0, 5), []);

  const topServices = useMemo(() => subscriptions
    .map(sub => ({
      ...sub,
      monthlyPrice: sub.billingType === 'Yearly' ? sub.price / 12 : sub.price
    }))
    .sort((a, b) => b.monthlyPrice - a.monthlyPrice)
    .slice(0, 3), []);

  const upcomingDue = useMemo(() => {
    const getDaysUntil = (dateString) => {
      const today = new Date();
      const dueDate = new Date(dateString);
      return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    };
    return subscriptions.find(sub => {
      const days = getDaysUntil(sub.nextDueDate);
      return days > 0 && days <= 7;
    });
  }, []);

  const renderHeader = () => (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.header}>
      <Text style={styles.headerTitle}>Hello, Sai</Text>
      <Text style={styles.headerSubtitle}>{currentMonth}</Text>
    </LinearGradient>
  );

  const flatData = [
    { type: 'kpi' },
    { type: 'category_cards' },
    { type: 'insight' },
    { type: 'alert' },
    { type: 'distribution' },
    { type: 'top_services' },
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'kpi') {
      return (
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Total Yearly Spending</Text>
          <Text style={styles.kpiValue}>
            {formatCurrency(currentYearData ? currentYearData.amount : totalYearlySpending)}
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={styles.yearText}>{currentYear}</Text>
            {percentageChange !== 0 && (
              <View style={[styles.badge, percentageChange > 0 ? styles.badgeSuccess : styles.badgeDanger]}>
                <Feather 
                  name={percentageChange > 0 ? "trending-up" : "trending-down"} 
                  size={12} 
                  color={percentageChange > 0 ? '#16a34a' : '#dc2626'} 
                />
                <Text style={[styles.badgeText, percentageChange > 0 ? styles.textSuccess : styles.textDanger]}>
                  {Math.abs(Math.round(percentageChange))}% vs {currentYear - 1}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (item.type === 'category_cards') {
      return (
        <View style={styles.categoryGrid}>
          {topCategories.map((cat, index) => {
            const icons = { 'OTT': 'tv', 'Mobile': 'smartphone', 'Internet': 'wifi', 'DTH': 'satellite' };
            const iconBg = { 'OTT': '#dbeafe', 'Mobile': '#f3e8ff', 'Internet': '#cffafe', 'DTH': '#dcfce7' };
            const iconColor = { 'OTT': '#2563eb', 'Mobile': '#9333ea', 'Internet': '#0891b2', 'DTH': '#16a34a' };

            return (
              <View key={cat.category} style={styles.miniCard}>
                <View style={styles.miniCardHeader}>
                  <View style={[styles.miniIconBox, { backgroundColor: iconBg[cat.category] || '#f3f4f6' }]}>
                    {cat.category === 'DTH' ? (
                      <MaterialIcons name="satellite" size={16} color={iconColor[cat.category]} />
                    ) : (
                      <Feather name={icons[cat.category] || 'box'} size={16} color={iconColor[cat.category] || '#4b5563'} />
                    )}
                  </View>
                  <Text style={styles.miniCategoryText} numberOfLines={1}>{cat.category}</Text>
                </View>
                <Text style={styles.miniPriceText}>{formatCurrency(cat.amount)}</Text>
              </View>
            );
          })}
        </View>
      );
    }

    if (item.type === 'insight') {
      return (
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            {topCategories[0].category} is your highest spending category at {formatCurrency(topCategories[0].amount)} this year
          </Text>
        </View>
      );
    }

    if (item.type === 'alert' && upcomingDue) {
      const getDaysUntil = (dateString) => {
        const today = new Date();
        const dueDate = new Date(dateString);
        return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      };
      return (
        <View style={styles.alertCard}>
          <Feather name="alert-circle" size={20} color="#ef4444" style={styles.alertIcon} />
          <View>
            <Text style={styles.alertTitle}>{upcomingDue.serviceName} due in {getDaysUntil(upcomingDue.nextDueDate)} days</Text>
            <Text style={styles.alertMeta}>₹{upcomingDue.price} • {upcomingDue.nextDueDate}</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'distribution') {
      return (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Category Distribution</Text>
          <View style={styles.chartArea}>
            <Svg width="150" height="150" viewBox="0 0 100 100">
              <G rotation="-90" origin="50, 50">
                {categoryDistribution.reduce((acc, item, i) => {
                  const total = categoryDistribution.reduce((s, x) => s + x.value, 0);
                  const percentage = (item.value / total) * 100;
                  const strokeDasharray = `${percentage} ${100 - percentage}`;
                  const strokeDashoffset = -acc.offset;
                  acc.elements.push(
                    <Circle
                      key={item.name}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth="15"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                    />
                  );
                  acc.offset += percentage;
                  return acc;
                }, { elements: [], offset: 0 }).elements}
                <Circle cx="50" cy="50" r="28" fill="#fff" />
              </G>
            </Svg>
          </View>
          <View style={styles.legendContainer}>
            {categoryDistribution.map((cat, i) => (
              <View key={cat.name} style={styles.legendItem}>
                <View style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: COLORS[i % COLORS.length] }]} />
                  <Text style={styles.legendLabel}>{cat.name}</Text>
                </View>
                <Text style={styles.legendValue}>{formatCurrency(cat.value)}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    if (item.type === 'top_services') {
      return (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Top Services</Text>
          <View style={styles.serviceList}>
            {topServices.map((sub) => (
              <Pressable 
                key={sub.id} 
                onPress={() => onSelectService(sub.serviceName)}
                style={styles.serviceItem}
              >
                <View>
                  <Text style={styles.serviceName}>{sub.serviceName}</Text>
                  <Text style={styles.serviceCategory}>{sub.category}</Text>
                </View>
                <Text style={styles.servicePrice}>
                  {formatCurrency(sub.monthlyPrice)}
                  <Text style={styles.servicePriceLabel}>/mo</Text>
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
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
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    paddingBottom: 48,
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
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  kpiCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    marginTop: -24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  kpiLabel: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 8,
  },
  kpiValue: {
    color: '#0f172a',
    fontSize: 48,
    fontWeight: '700',
  },
  kpiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  yearText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeSuccess: {
    backgroundColor: '#f0fdf4',
  },
  badgeDanger: {
    backgroundColor: '#fef2f2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSuccess: {
    color: '#16a34a',
  },
  textDanger: {
    color: '#dc2626',
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  miniCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  miniCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  miniIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCategoryText: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  miniPriceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  insightCard: {
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ede9fe',
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
  },
  insightText: {
    color: '#4c1d95',
    fontWeight: '500',
    lineHeight: 20,
  },
  alertCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  alertIcon: {
    marginTop: 2,
  },
  alertTitle: {
    color: '#7f1d1d',
    fontWeight: '500',
  },
  alertMeta: {
    color: '#b91c1c',
    fontSize: 14,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  legendContainer: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  serviceList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  serviceName: {
    color: '#0f172a',
    fontWeight: '500',
    fontSize: 16,
  },
  serviceCategory: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 2,
  },
  servicePrice: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 16,
  },
  servicePriceLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '400',
  },
});
