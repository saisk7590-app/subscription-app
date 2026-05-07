import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import theme from '../constants/theme';

export default function SearchField({ value, onChangeText, placeholder = 'Search...' }) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color={theme.colors.textMuted} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    paddingLeft: 44,
    paddingRight: 16,
    ...theme.shadows.card,
  },
  icon: {
    position: 'absolute',
    left: 16,
    zIndex: 2,
  },
  input: {
    color: theme.colors.textPrimary,
    ...theme.typography.body,
  },
});
