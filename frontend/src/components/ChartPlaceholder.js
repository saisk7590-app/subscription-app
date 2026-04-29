import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../constants/theme';

export default function ChartPlaceholder({ title }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartArea}>
        <View style={[styles.bar, styles.barShort]} />
        <View style={[styles.bar, styles.barMedium]} />
        <View style={[styles.bar, styles.barTall]} />
        <View style={[styles.bar, styles.barMedium]} />
      </View>
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
    gap: theme.spacing.md,
  },
  title: {
    ...theme.typography.cardTitle,
  },
  chartArea: {
    height: 140,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bar: {
    width: 32,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
  },
  barShort: {
    height: 42,
  },
  barMedium: {
    height: 76,
  },
  barTall: {
    height: 106,
  },
});
