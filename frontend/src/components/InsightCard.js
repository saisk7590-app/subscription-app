import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../constants/theme';

export default function InsightCard({ message }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Insight</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
});
