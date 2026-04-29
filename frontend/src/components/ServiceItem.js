import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../constants/theme';

export default function ServiceItem({ name, amount }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...theme.typography.cardTitle,
  },
  amount: {
    ...theme.typography.body,
    fontWeight: '700',
  },
});
