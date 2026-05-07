import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import InteractiveLineChart from '../components/charts/InteractiveLineChart';
import GradientHeader from '../components/GradientHeader';
import Screen from '../components/Screen';
import SurfaceCard from '../components/SurfaceCard';
import theme from '../constants/theme';
import { payments, priceHistory, subscriptions } from '../data/mockData';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function ServiceDetailsScreen({ navigation, route }) {
  const { serviceName } = route.params;
  const service = subscriptions.find((item) => item.serviceName === serviceName);

  if (!service) {
    return (
      <Screen scroll={false}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Service not found</Text>
        </View>
      </Screen>
    );
  }

  const servicePayments = payments
    .filter((item) => item.serviceName === serviceName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalSpent = servicePayments.reduce((sum, item) => sum + item.amount, 0);
  const servicePriceHistory = (priceHistory[serviceName] || []).map((item) => ({
    value: item.price,
    label: item.month,
  }));
  const priceChange =
    servicePriceHistory.length >= 2
      ? servicePriceHistory[servicePriceHistory.length - 1].value - servicePriceHistory[0].value
      : 0;

  return (
    <Screen>
      <GradientHeader
        title={service.serviceName}
        subtitle={service.category}
        leftAction={
          <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
            <Feather name="arrow-left" size={20} color={theme.colors.white} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        }
      />

      <View style={styles.content}>
        <SurfaceCard>
          <View style={styles.infoGrid}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Current Price</Text>
              <Text style={styles.infoValue}>{formatCurrency(service.price)}</Text>
              <Text style={styles.infoCaption}>{service.billingType}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Total Spent</Text>
              <Text style={styles.infoValue}>{formatCurrency(totalSpent)}</Text>
              <Text style={styles.infoCaption}>All time</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoGrid}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Start Date</Text>
              <Text style={styles.secondaryValue}>{formatDate(service.startDate)}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Next Due</Text>
              <Text style={styles.secondaryValue}>{formatDate(service.nextDueDate)}</Text>
            </View>
          </View>

          {!!service.remark && (
            <>
              <View style={styles.divider} />
              <View>
                <Text style={styles.infoLabel}>Plan Details</Text>
                <Text style={styles.planText}>{service.remark}</Text>
              </View>
            </>
          )}
        </SurfaceCard>

        {priceChange !== 0 && (
          <View style={[styles.changeCard, priceChange > 0 ? styles.changeDanger : styles.changeSuccess]}>
            <Text style={[styles.changeCardText, priceChange > 0 ? styles.changeDangerText : styles.changeSuccessText]}>
              Price {priceChange > 0 ? 'increased' : 'decreased'} by {formatCurrency(Math.abs(priceChange))} since start
            </Text>
          </View>
        )}

        {!!servicePriceHistory.length && (
          <SurfaceCard>
            <Text style={styles.sectionTitle}>Price Timeline</Text>
            <InteractiveLineChart
              data={servicePriceHistory}
              color={theme.colors.purple}
              valueFormatter={formatCurrency}
            />
          </SurfaceCard>
        )}

        <SurfaceCard>
          <Text style={styles.sectionTitle}>Recent Payments</Text>
          <View style={styles.paymentsList}>
            {servicePayments.slice(0, 5).map((payment, index) => (
              <View key={payment.id} style={[styles.paymentRow, index !== Math.min(servicePayments.length, 5) - 1 && styles.paymentBorder]}>
                <Text style={styles.paymentDate}>{formatDate(payment.date)}</Text>
                <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
              </View>
            ))}
          </View>
        </SurfaceCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backText: {
    color: theme.colors.white,
    ...theme.typography.bodyMedium,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  infoValue: {
    marginTop: 4,
    color: theme.colors.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  infoCaption: {
    marginTop: 4,
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
  },
  secondaryValue: {
    marginTop: 4,
    color: theme.colors.textPrimary,
    ...theme.typography.bodyMedium,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  planText: {
    marginTop: 4,
    color: theme.colors.textPrimary,
    ...theme.typography.body,
  },
  changeCard: {
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
  },
  changeDanger: {
    backgroundColor: theme.colors.redSoft,
    borderColor: '#FECACA',
  },
  changeSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  changeCardText: {
    ...theme.typography.bodyMedium,
  },
  changeDangerText: {
    color: theme.colors.redDark,
  },
  changeSuccessText: {
    color: '#166534',
  },
  sectionTitle: {
    marginBottom: 16,
    color: theme.colors.textPrimary,
    ...theme.typography.h2,
  },
  paymentsList: {
    gap: 0,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  paymentBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  paymentDate: {
    color: theme.colors.textPrimary,
    ...theme.typography.body,
  },
  paymentAmount: {
    color: theme.colors.textPrimary,
    ...theme.typography.bodyMedium,
  },
});
