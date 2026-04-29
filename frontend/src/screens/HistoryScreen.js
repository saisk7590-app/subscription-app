import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import Theme from '../constants/theme';
import { payments, categories, subscriptions } from '../features/analytics/analyticsData';

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

export default function HistoryScreen({ onSelectService }) {
  const [yearFilter, setYearFilter] = useState('2026');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const years = ['2024', '2025', '2026'];

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesYear = payment.date.startsWith(yearFilter);
      const matchesCategory = categoryFilter === 'All' || payment.category === categoryFilter;
      const matchesSearch = payment.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesYear && matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [yearFilter, categoryFilter, searchQuery]);

  const groupedByMonth = useMemo(() => {
    return filteredPayments.reduce((acc, payment) => {
      const month = new Date(payment.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(payment);
      return acc;
    }, {});
  }, [filteredPayments]);

  const flatData = useMemo(() => {
    const data = [];
    Object.entries(groupedByMonth).forEach(([month, monthPayments]) => {
      data.push({ type: 'header', value: month });
      monthPayments.forEach(p => data.push({ type: 'payment', value: p }));
    });
    if (filteredPayments.length > 0) {
      data.push({ type: 'summary' });
    }
    return data;
  }, [groupedByMonth, filteredPayments]);

  const getSubscriptionStatus = (serviceName) => {
    const sub = subscriptions.find(s => s.serviceName === serviceName);
    return sub?.status || 'Active';
  };

  const getSubscriptionDates = (serviceName) => {
    const sub = subscriptions.find(s => s.serviceName === serviceName);
    return {
      startDate: sub?.startDate || '',
      endDate: sub?.endDate || 'Present',
    };
  };

  const renderHeader = () => (
    <View>
      <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.header}>
        <Text style={styles.headerTitle}>Payment History</Text>
        <Text style={styles.headerSubtitle}>Track all your payments</Text>
      </LinearGradient>

      <View style={styles.filterSection}>
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

        <View style={styles.filterRow}>
          <View style={{ flex: 1, zIndex: 20 }}>
            <Pressable 
              onPress={() => { setShowYearPicker(!showYearPicker); setShowCategoryPicker(false); }}
              style={styles.pickerButton}
            >
              <Text style={styles.pickerButtonText}>{yearFilter}</Text>
              <Feather name="filter" size={16} color="#94a3b8" />
            </Pressable>
            {showYearPicker && (
              <View style={styles.dropdown}>
                {years.map(y => (
                  <Pressable key={y} onPress={() => { setYearFilter(y); setShowYearPicker(false); }} style={styles.dropdownItem}>
                    <Text style={[styles.dropdownText, yearFilter === y && styles.activeDropdownText]}>{y}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={{ flex: 1, zIndex: 10 }}>
            <Pressable 
              onPress={() => { setShowCategoryPicker(!showCategoryPicker); setShowYearPicker(false); }}
              style={styles.pickerButton}
            >
              <Text style={styles.pickerButtonText}>{categoryFilter}</Text>
              <Feather name="filter" size={16} color="#94a3b8" />
            </Pressable>
            {showCategoryPicker && (
              <View style={styles.dropdown}>
                <Pressable onPress={() => { setCategoryFilter('All'); setShowCategoryPicker(false); }} style={styles.dropdownItem}>
                  <Text style={[styles.dropdownText, categoryFilter === 'All' && styles.activeDropdownText]}>All Categories</Text>
                </Pressable>
                {categories.map(c => (
                  <Pressable key={c} onPress={() => { setCategoryFilter(c); setShowCategoryPicker(false); }} style={styles.dropdownItem}>
                    <Text style={[styles.dropdownText, categoryFilter === c && styles.activeDropdownText]}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.monthHeader}>{item.value}</Text>;
    }

    if (item.type === 'payment') {
      const payment = item.value;
      const status = getSubscriptionStatus(payment.serviceName);
      const dates = getSubscriptionDates(payment.serviceName);
      const statusColors = {
        Active: { bg: '#f0fdf4', text: '#16a34a', border: '#bcfce7' },
        Cancelled: { bg: '#f9fafb', text: '#4b5563', border: '#e5e7eb' },
        Paused: { bg: '#fffaf0', text: '#ea580c', border: '#ffeddf' },
      };
      const colors = statusColors[status] || statusColors.Active;

      return (
        <Pressable 
          onPress={() => onSelectService(payment.serviceName)}
          style={styles.paymentCard}
        >
          <View style={styles.paymentLeft}>
            <Text style={styles.serviceName}>{payment.serviceName}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{formatDate(payment.date)}</Text>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{payment.category}</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>
                {formatDate(dates.startDate)} - {dates.endDate === 'Present' ? dates.endDate : formatDate(dates.endDate)}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                <Text style={[styles.statusBadgeText, { color: colors.text }]}>{status}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
        </Pressable>
      );
    }

    if (item.type === 'summary') {
      return (
        <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spent ({yearFilter})</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(filteredPayments.reduce((sum, p) => sum + p.amount, 0))}
          </Text>
          <Text style={styles.summaryMeta}>
            {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
          </Text>
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
  filterSection: {
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
  filterRow: {
    flexDirection: 'row',
    gap: 12,
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
  activeDropdownText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    paddingBottom: 24,
  },
  monthHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    paddingHorizontal: 18,
    marginTop: 16,
  },
  paymentCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  paymentLeft: {
    flex: 1,
  },
  serviceName: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  metaText: {
    color: '#64748b',
    fontSize: 12,
  },
  metaDot: {
    color: '#94a3b8',
    fontSize: 12,
  },
  categoryBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#2563eb',
    fontSize: 10,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  paymentAmount: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryLabel: {
    color: '#dbeafe',
    fontSize: 14,
    marginBottom: 8,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  summaryMeta: {
    color: '#dbeafe',
    fontSize: 14,
    marginTop: 8,
  },
});
