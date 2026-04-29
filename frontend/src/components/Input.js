import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

import Theme from '../constants/theme';

export default function Input(props) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor={Theme.colors.textMuted}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Theme.colors.surface,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.textPrimary,
  },
});
