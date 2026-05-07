import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import theme from '../../constants/theme';

export default function ChartTooltip({
  title,
  label,
  subtitle,
  value,
  accentColor = theme.colors.textPrimary,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      {!!label && <Text style={styles.label}>{label}</Text>}
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.floating,
  },
  title: {
    color: theme.colors.textPrimary,
    textAlign: 'center',
    ...theme.typography.captionStrong,
  },
  label: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    ...theme.typography.caption,
  },
  subtitle: {
    marginTop: 2,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    ...theme.typography.caption,
  },
  value: {
    marginTop: 4,
    textAlign: 'center',
    ...theme.typography.captionStrong,
  },
});
