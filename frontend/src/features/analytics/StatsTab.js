import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import InsightCard from '../../components/InsightCard';
import ServiceItem from '../../components/ServiceItem';
import theme from '../../constants/theme';
import { analyticsData } from './analyticsData';
import { dashboardData } from '../dashboard/dashboardData';

export default function StatsTab() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Year Summary</Text>
        <Text style={styles.summaryAmount}>Rs {analyticsData.yearly[0].amount}</Text>
        <Text style={styles.summaryText}>
          Highest recorded spend year with strong OTT and utility contribution.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Category Totals</Text>
        {analyticsData.categories.map((item) => (
          <View key={item.name} style={styles.row}>
            <Text style={styles.rowLabel}>{item.name}</Text>
            <Text style={styles.rowAmount}>Rs {item.amount}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service List</Text>
        <View style={styles.stack}>
          {dashboardData.topServices.map((service) => (
            <ServiceItem key={service.name} name={service.name} amount={service.amount} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <InsightCard message={dashboardData.insight} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  cardLabel: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  summaryAmount: {
    ...theme.typography.sectionTitle,
    fontSize: 24,
  },
  summaryText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.sectionTitle,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  rowLabel: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  rowAmount: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
  stack: {
    gap: theme.spacing.sm,
  },
});
