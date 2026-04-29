import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Theme from '../constants/theme';

export default function ListItem({ title, value }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.sm,
  },
  title: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.typography.fontSize.md,
  },
  value: {
    color: Theme.colors.textPrimary,
    fontSize: Theme.typography.fontSize.md,
    fontWeight: Theme.typography.fontWeight.medium,
  },
});
