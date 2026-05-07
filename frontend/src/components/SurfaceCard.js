import React from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '../constants/theme';

export default function SurfaceCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
    ...theme.shadows.card,
  },
});
