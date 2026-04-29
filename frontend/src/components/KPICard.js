import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../constants/theme';

export default function KPICard({ label, amount }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>Rs {amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
  },
  amount: {
    ...theme.typography.cardTitle,
    fontSize: 22,
  },
});
