import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import Theme from '../constants/theme';
import { subscriptions, yearlySpendingData } from '../features/analytics/analyticsData';

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString()}`;
}

export default function StatsScreen({ onSelectService }) {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const years = ['2024', '2025', '2026'];

  // Calculations for Stats
  const currentYearData = useMemo(() => yearlySpendingData.find(d => d.year === selectedYear), [selectedYear]);
  const previousYearData = useMemo(() => yearlySpendingData.find(d => d.year === String(Number(selectedYear) - 1)), [selectedYear]);

  const statsPercentageChange = useMemo(() => {
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

  const totalYearlySpending = useMemo(() => Object.values(categoryTotals).reduce((sum, val) => sum + val, 0), [categoryTotals]);

  const categoriesWithPercentage = useMemo(() => Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalYearlySpending) * 100,
    }))
    .sort((a, b) => b.amount - a.amount), [categoryTotals, totalYearlySpending]);

  const serviceTotals = useMemo(() => subscriptions
    .map(sub => ({
      ...sub,
      yearlyTotal: sub.billingType === 'Monthly' ? sub.price * 12 : sub.price,
    }))
    .filter(sub => sub.serviceName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.yearlyTotal - a.yearlyTotal), [searchQuery]);

  const insights = useMemo(() => {
    const list = [];
    if (categoriesWithPercentage.length > 0) {
      const topCategory = categoriesWithPercentage[0];
      if (statsPercentageChange > 0) {
        list.push(`${topCategory.category} increased by ${Math.abs(Math.round(statsPercentageChange))}% this year`);
      }
      list.push(`${topCategory.category} is your highest spending category`);
    }
    const ottTotal3Years = subscriptions
      .filter(sub => sub.category === 'OTT')
      .reduce((sum, sub) => {
        const yearlyPrice = sub.billingType === 'Monthly' ? sub.price * 12 : sub.price;
        return sum + (yearlyPrice * 3);
      }, 0);
    list.push(`You spent ₹${Math.round(ottTotal3Years).toLocaleString()} on OTT in last 3 years`);
    return list;
  }, [categoriesWithPercentage, statsPercentageChange]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Statistics</Text>
      <Text style={styles.headerSubtitle}>Yearly breakdown and insights</Text>
    </View>
  );

  const flatData = [
    { type: 'search' },
    { type: 'year_picker' },
    { type: 'summary' },
    { type: 'breakdown' },
    { type: 'insights' },
    { type: 'services' },
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'search') {
      return (
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94a3b8" />
          <TextInput 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search subscriptions..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
        </View>
      );
    }

    if (item.type === 'year_picker') {
      return (
        <View style={{ zIndex: 10 }}>
          <Pressable 
            onPress={() => setShowYearPicker(!showYearPicker)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerButtonText}>{selectedYear}</Text>
            <Feather name="chevron-down" size={18} color="#94a3b8" />
          </Pressable>
          {showYearPicker && (
            <View style={styles.dropdown}>
              {years.map(y => (
                <Pressable key={y} onPress={() => { setSelectedYear(y); setShowYearPicker(false); }} style={styles.dropdownItem}>
                  <Text style={[styles.dropdownText, selectedYear === y && styles.dropdownTextActive]}>{y}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      );
    }

    if (item.type === 'summary') {
      return (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spending</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(currentYearData ? currentYearData.amount : totalYearlySpending)}
          </Text>
          {statsPercentageChange !== 0 && (
            <View style={styles.summaryTrend}>
              <Feather 
                name={statsPercentageChange > 0 ? "trending-up" : "trending-down"} 
                size={16} 
                color={statsPercentageChange > 0 ? '#16a34a' : '#dc2626'} 
              />
              <Text style={[styles.trendText, statsPercentageChange > 0 ? styles.textSuccess : styles.textDanger]}>
                {Math.abs(Math.round(statsPercentageChange))}% vs {Number(selectedYear) - 1}
              </Text>
            </View>
          )}
        </View>
      );
    }

    if (item.type === 'breakdown') {
      return (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Category Breakdown</Text>
          <View style={styles.listContainer}>
            {categoriesWithPercentage.map(cat => (
              <View key={cat.category} style={styles.breakdownRow}>
                <View>
                  <Text style={styles.breakdownName}>{cat.category}</Text>
                  <Text style={styles.breakdownMeta}>{Math.round(cat.percentage)}%</Text>
                </View>
                <Text style={styles.breakdownValue}>{formatCurrency(cat.amount)}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    if (item.type === 'insights') {
      return (
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Insights</Text>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightRow}>
              <View style={styles.insightDot} />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (item.type === 'services') {
      return (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>All Services</Text>
          <View style={styles.listContainer}>
            {serviceTotals.map(service => (
              <Pressable 
                key={service.id} 
                onPress={() => onSelectService && onSelectService(service.serviceName)}
                style={styles.serviceRow}
              >
                <View>
                  <Text style={styles.serviceName}>{service.serviceName}</Text>
                  <Text style={styles.serviceMeta}>{service.billingType}</Text>
                </View>
                <Text style={styles.serviceValue}>{formatCurrency(service.yearlyTotal)}</Text>
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
        contentContainerStyle={styles.content}
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
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
  },
  pickerButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownText: {
    color: '#0f172a',
    fontSize: 14,
  },
  dropdownTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryLabel: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 8,
  },
  summaryValue: {
    color: '#0f172a',
    fontSize: 32,
    fontWeight: '700',
  },
  summaryTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  textSuccess: {
    color: '#16a34a',
  },
  textDanger: {
    color: '#dc2626',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  listContainer: {
    gap: 0,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  breakdownName: {
    color: '#0f172a',
    fontWeight: '500',
    fontSize: 15,
  },
  breakdownMeta: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  breakdownValue: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  insightsCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 24,
    padding: 20,
  },
  insightsTitle: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginTop: 8,
  },
  insightText: {
    color: '#1e3a8a',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  serviceName: {
    color: '#0f172a',
    fontWeight: '500',
    fontSize: 15,
  },
  serviceMeta: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  serviceValue: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
});
