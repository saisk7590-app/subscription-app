import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import theme from '../constants/theme';

export default function ComingSoonScreen({
  title,
  children,
  isFullScreen = true,
}) {
  const content = (
    <View style={[styles.container, !isFullScreen && styles.embeddedContainer]}>
      
      {/* TITLE */}
      {title ? <Text style={styles.title}>{title}</Text> : null}

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.message}>Coming Soon</Text>
        <Text style={styles.description}>
          This part of the app is ready for future subscription features.
        </Text>
      </View>

      {/* EXTRA */}
      {children ? <View style={styles.extraContent}>{children}</View> : null}
    </View>
  );

  if (!isFullScreen) {
    return content;
  }

  return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },

  embeddedContainer: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },

  title: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },

  // 🔥 FIXED: no center, proper flow layout
  content: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },

  message: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },

  description: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },

  extraContent: {
    marginTop: theme.spacing.lg,
  },
});
