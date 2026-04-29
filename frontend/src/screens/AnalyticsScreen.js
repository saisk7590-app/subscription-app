import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Svg, { Rect, Circle, Polyline, G, Text as SvgText } from 'react-native-svg';

import Theme from '../constants/theme';
import { subscriptions, yearlySpendingData, priceHistory, ottSpendingData } from '../features/analytics/analyticsData';
import StatsScreen from './StatsScreen';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

export default function AnalyticsScreen({ onSelectService }) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'stats'
  const [timeFilter, setTimeFilter] = useState('1Y');
  const [selectedService, setSelectedService] = useState('Netflix');
  const [showServicePicker, setShowServicePicker] = useState(false);

  const serviceNames = useMemo(() => Array.from(new Set(subscriptions.map(s => s.serviceName))), []);

  const categoryData = useMemo(() => subscriptions.reduce((acc, sub) => {
    const monthlyPrice = sub.billingType === 'Yearly' ? sub.price / 12 : sub.price;
    const existing = acc.find(item => item.name === sub.category);
    if (existing) {
      existing.value += monthlyPrice;
    } else {
      acc.push({ name: sub.category, value: monthlyPrice });
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value), []);

  const renderHeader = () => (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.header}>
      <Text style={styles.headerTitle}>Analytics</Text>
      <Text style={styles.headerSubtitle}>Subscription insights</Text>
      
      <View style={styles.tabBar}>
        <Pressable 
          onPress={() => setActiveTab('analytics')}
          style={[styles.tabButton, activeTab === 'analytics' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'analytics' && styles.tabButtonTextActive]}>Analytics</Text>
        </Pressable>
        <Pressable 
          onPress={() => setActiveTab('stats')}
          style={[styles.tabButton, activeTab === 'stats' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'stats' && styles.tabButtonTextActive]}>Stats</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );

  if (activeTab === 'stats') {
    return (
      <View style={styles.screen}>
        {renderHeader()}
        <StatsScreen onSelectService={onSelectService} />
      </View>
    );
  }

  const flatData = [
    { type: 'time_filters' },
    { type: 'chart_category' },
    { type: 'chart_yearly' },
    { type: 'chart_price_trend' },
    { type: 'chart_ott_trend' },
    { type: 'chart_top_services' },
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'time_filters') {
      return (
        <View style={styles.filterRow}>
          {['1Y', '3Y', '5Y', '10Y'].map(f => (
            <Pressable 
              key={f} 
              onPress={() => setTimeFilter(f)}
              style={[styles.filterBtn, timeFilter === f && styles.filterBtnActive]}
            >
              <Text style={[styles.filterBtnText, timeFilter === f && styles.filterBtnTextActive]}>{f}</Text>
            </Pressable>
          ))}
        </View>
      );
    }

    if (item.type === 'chart_category') {
      const total = categoryData.reduce((s, x) => s + x.value, 0);
      return (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Category Distribution</Text>
          <View style={styles.pieContainer}>
            <Svg width="180" height="180" viewBox="0 0 100 100">
              <G rotation="-90" origin="50, 50">
                {categoryData.reduce((acc, cat, i) => {
                  const percentage = (cat.value / total) * 100;
                  const strokeDasharray = `${percentage} ${100 - percentage}`;
                  acc.elements.push(
                    <Circle
                      key={cat.name}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={COLORS[i % COLORS.length]}
                      strokeWidth="20"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={-acc.offset}
                    />
                  );
                  acc.offset += percentage;
                  return acc;
                }, { elements: [], offset: 0 }).elements}
              </G>
            </Svg>
            <View style={styles.pieLegend}>
              {categoryData.map((cat, i) => (
                <View key={cat.name} style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: COLORS[i % COLORS.length] }]} />
                  <Text style={styles.legendText}>{cat.name} {Math.round((cat.value / total) * 100)}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }

    if (item.type === 'chart_yearly') {
      const maxAmount = Math.max(...yearlySpendingData.map(d => d.amount));
      return (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Yearly Spending</Text>
          <View style={styles.barChart}>
            <Svg width="100%" height="180">
              {yearlySpendingData.map((d, i) => {
                const barHeight = (d.amount / maxAmount) * 120;
                const x = 40 + i * 80;
                return (
                  <G key={d.year}>
                    <Rect x={x} y={140 - barHeight} width="40" height={barHeight} fill="#3b82f6" rx="8" />
                    <SvgText x={x + 20} y="160" fontSize="12" fill="#6b7280" textAnchor="middle">{d.year}</SvgText>
                  </G>
                );
              })}
            </Svg>
          </View>
        </View>
      );
    }

    if (item.type === 'chart_price_trend') {
      const history = priceHistory[selectedService] || priceHistory.Netflix;
      const maxPrice = Math.max(...history.map(h => h.price));
      const points = history.map((h, i) => `${40 + i * 50},${140 - (h.price / maxPrice) * 100}`).join(' ');
      return (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Price Trend</Text>
          <Pressable onPress={() => setShowServicePicker(!showServicePicker)} style={styles.pickerButton}>
            <Text style={styles.pickerButtonText}>{selectedService}</Text>
            <Feather name="chevron-down" size={18} color="#94a3b8" />
          </Pressable>
          {showServicePicker && (
            <View style={styles.dropdown}>
              {serviceNames.map(s => (
                <Pressable key={s} onPress={() => { setSelectedService(s); setShowServicePicker(false); }} style={styles.dropdownItem}>
                  <Text style={styles.dropdownText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          )}
          <View style={styles.lineChart}>
            <Svg width="100%" height="180">
              <Polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="3" />
              {history.map((h, i) => (
                <G key={h.month}>
                  <Circle cx={40 + i * 50} cy={140 - (h.price / maxPrice) * 100} r="4" fill="#8b5cf6" />
                  <SvgText x={40 + i * 50} y="160" fontSize="10" fill="#6b7280" textAnchor="middle">{h.month}</SvgText>
                </G>
              ))}
            </Svg>
          </View>
        </View>
      );
    }

    if (item.type === 'chart_ott_trend') {
      const maxAmount = Math.max(...ottSpendingData.map(d => d.amount));
      const points = ottSpendingData.map((d, i) => `${40 + i * 50},${140 - (d.amount / maxAmount) * 100}`).join(' ');
      return (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>OTT Spending Trend</Text>
          <View style={styles.lineChart}>
            <Svg width="100%" height="180">
              <Polyline points={points} fill="none" stroke="#10b981" strokeWidth="3" />
              {ottSpendingData.map((d, i) => (
                <G key={d.month}>
                  <Circle cx={40 + i * 50} cy={140 - (d.amount / maxAmount) * 100} r="4" fill="#10b981" />
                  <SvgText x={40 + i * 50} y="160" fontSize="10" fill="#6b7280" textAnchor="middle">{d.month}</SvgText>
                </G>
              ))}
            </Svg>
          </View>
        </View>
      );
    }

    if (item.type === 'chart_top_services') {
      const topServicesData = subscriptions
        .map(sub => ({
          name: sub.serviceName,
          amount: sub.billingType === 'Yearly' ? Math.round(sub.price / 12) : sub.price,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
      const maxAmount = Math.max(...topServicesData.map(d => d.amount));
      return (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Top Services by Spending</Text>
          <View style={styles.horizontalBarChart}>
            {topServicesData.map((d, i) => (
              <View key={d.name} style={styles.hBarRow}>
                <Text style={styles.hBarLabel} numberOfLines={1}>{d.name}</Text>
                <View style={styles.hBarTrack}>
                  <View style={[styles.hBarFill, { width: `${(d.amount / maxAmount) * 100}%`, backgroundColor: '#06b6d4' }]} />
                </View>
                <Text style={styles.hBarValue}>₹{d.amount}</Text>
              </View>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(37, 99, 235, 0.3)',
    borderRadius: 16,
    padding: 4,
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#fff',
  },
  tabButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#2563eb',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterBtnActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  filterBtnTextActive: {
    color: '#fff',
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
  pieContainer: {
    alignItems: 'center',
    gap: 20,
  },
  pieLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
  },
  barChart: {
    height: 180,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  pickerButtonText: {
    color: '#0f172a',
    fontSize: 14,
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
    maxHeight: 200,
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
  lineChart: {
    height: 180,
  },
  horizontalBarChart: {
    gap: 16,
  },
  hBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hBarLabel: {
    width: 60,
    fontSize: 12,
    color: '#64748b',
  },
  hBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  hBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  hBarValue: {
    width: 50,
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'right',
  },
});
