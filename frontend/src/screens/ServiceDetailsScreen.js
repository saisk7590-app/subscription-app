import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Svg, { Circle, Polyline, G, Text as SvgText } from 'react-native-svg';

import Theme from '../constants/theme';
import { subscriptions, priceHistory, payments } from '../features/analytics/analyticsData';

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

export default function ServiceDetailsScreen({ serviceName, onBack }) {
  const service = useMemo(() => subscriptions.find(s => s.serviceName === serviceName), [serviceName]);

  if (!service) {
    return (
      <View style={styles.errorScreen}>
        <Text style={styles.errorText}>Service not found</Text>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const servicePriceHistory = useMemo(() => priceHistory[serviceName] || [], [serviceName]);
  const totalSpent = useMemo(() => payments
    .filter(p => p.serviceName === serviceName)
    .reduce((sum, p) => sum + p.amount, 0), [serviceName]);

  const priceChange = useMemo(() => {
    if (servicePriceHistory.length >= 2) {
      return servicePriceHistory[servicePriceHistory.length - 1].price - servicePriceHistory[0].price;
    }
    return 0;
  }, [servicePriceHistory]);

  const recentPayments = useMemo(() => payments
    .filter(p => p.serviceName === serviceName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5), [serviceName]);

  const renderHeader = () => (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.header}>
      <Pressable onPress={onBack} style={styles.backLink}>
        <Feather name="arrow-left" size={20} color="#fff" />
        <Text style={styles.backLinkText}>Back</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{service.serviceName}</Text>
      <Text style={styles.headerSubtitle}>{service.category}</Text>
    </LinearGradient>
  );

  const flatData = [
    { type: 'info_card' },
    { type: 'price_change_alert' },
    { type: 'price_timeline' },
    { type: 'recent_payments' },
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'info_card') {
      return (
        <View style={styles.card}>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Current Price</Text>
              <Text style={styles.infoValue}>₹{service.price}</Text>
              <Text style={styles.infoMeta}>{service.billingType}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Total Spent</Text>
              <Text style={styles.infoValue}>{formatCurrency(totalSpent)}</Text>
              <Text style={styles.infoMeta}>All time</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Start Date</Text>
              <Text style={styles.infoValueSmall}>{formatDate(service.startDate)}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Next Due</Text>
              <Text style={styles.infoValueSmall}>{formatDate(service.nextDueDate)}</Text>
            </View>
          </View>
          {service.remark && (
            <View style={styles.remarkSection}>
              <View style={styles.divider} />
              <Text style={styles.infoLabel}>Plan Details</Text>
              <Text style={styles.remarkText}>{service.remark}</Text>
            </View>
          )}
        </View>
      );
    }

    if (item.type === 'price_change_alert' && priceChange !== 0) {
      const isIncrease = priceChange > 0;
      return (
        <View style={[styles.alertBox, isIncrease ? styles.alertDanger : styles.alertSuccess]}>
          <Text style={[styles.alertText, isIncrease ? styles.alertTextDanger : styles.alertTextSuccess]}>
            Price {isIncrease ? 'increased' : 'decreased'} by ₹{Math.abs(priceChange)} since start
          </Text>
        </View>
      );
    }

    if (item.type === 'price_timeline' && servicePriceHistory.length > 0) {
      const maxPrice = Math.max(...servicePriceHistory.map(h => h.price));
      const points = servicePriceHistory.map((h, i) => `${40 + i * 60},${140 - (h.price / maxPrice) * 100}`).join(' ');
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Timeline</Text>
          <View style={styles.chartArea}>
            <Svg width="100%" height="180">
              <Polyline points={points} fill="none" stroke="#8b5cf6" strokeWidth="3" />
              {servicePriceHistory.map((h, i) => (
                <G key={h.month}>
                  <Circle cx={40 + i * 60} cy={140 - (h.price / maxPrice) * 100} r="4" fill="#8b5cf6" />
                  <SvgText x={40 + i * 60} y="160" fontSize="10" fill="#64748b" textAnchor="middle">{h.month}</SvgText>
                </G>
              ))}
            </Svg>
          </View>
        </View>
      );
    }

    if (item.type === 'recent_payments') {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Payments</Text>
          <View style={styles.paymentList}>
            {recentPayments.map((p, i) => (
              <View key={p.id} style={[styles.paymentRow, i === recentPayments.length - 1 && styles.noBorder]}>
                <Text style={styles.paymentDate}>{formatDate(p.date)}</Text>
                <Text style={styles.paymentAmount}>₹{p.amount}</Text>
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
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backLinkText: {
    color: '#fff',
    fontSize: 16,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  infoValueSmall: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0f172a',
  },
  infoMeta: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 16,
  },
  remarkSection: {
    marginTop: 0,
  },
  remarkText: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 20,
  },
  alertBox: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  alertDanger: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  alertSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bcfce7',
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  alertTextDanger: {
    color: '#991b1b',
  },
  alertTextSuccess: {
    color: '#166534',
  },
  chartArea: {
    height: 180,
  },
  paymentList: {
    gap: 0,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  paymentDate: {
    fontSize: 14,
    color: '#0f172a',
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  errorScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
