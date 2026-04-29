import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Theme from '../constants/theme';

export default function Chart({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Chart Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Theme.spacing.lg,
  },
  title: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.medium,
    color: Theme.colors.textPrimary,
  },
  placeholder: {
    height: 150,
    marginTop: Theme.spacing.sm,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  placeholderText: {
    color: Theme.colors.textSecondary,
    fontSize: Theme.typography.fontSize.md,
  },
});
