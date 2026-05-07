import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import theme from '../constants/theme';

export default function GradientHeader({ title, subtitle, children, compact = false, leftAction = null }) {
  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.purple]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, compact && styles.compactHeader]}
    >
      {leftAction}
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  compactHeader: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    color: theme.colors.white,
    ...theme.typography.h1,
  },
  subtitle: {
    marginTop: 4,
    color: theme.colors.blueTextSoft,
    ...theme.typography.body,
  },
});
