import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import Theme from '../constants/theme';

export default function Button({ title, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
  },
  text: {
    color: Theme.colors.white,
    fontSize: Theme.typography.fontSize.md,
    fontWeight: Theme.typography.fontWeight.bold,
  },
});
