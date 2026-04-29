import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../constants/theme';

export default function TimelineItem({ price, start, end, isLast }) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={styles.dot} />
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={styles.card}>
        <Text style={styles.price}>Rs {price}</Text>
        <Text style={styles.meta}>
          {start} - {end}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  rail: {
    alignItems: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginTop: theme.spacing.xs,
  },
  card: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  price: {
    ...theme.typography.cardTitle,
  },
  meta: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
