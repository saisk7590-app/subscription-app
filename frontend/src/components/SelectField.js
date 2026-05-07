import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import theme from '../constants/theme';

export default function SelectField({ value, options, onSelect, label, fullWidth = true, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable style={[styles.trigger, fullWidth && styles.fullWidth]} onPress={() => setVisible(true)}>
        <Text style={styles.triggerText}>{value || placeholder || label}</Text>
        <Feather name="chevron-down" size={18} color={theme.colors.textMuted} />
      </Pressable>

      <Modal animationType="fade" transparent visible={visible} onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            {options.map((option) => {
              const selected = option === value;

              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    setVisible(false);
                  }}
                  style={styles.option}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.card,
  },
  fullWidth: {
    flex: 1,
  },
  triggerText: {
    color: theme.colors.textPrimary,
    ...theme.typography.bodyMedium,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.18)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: 8,
    ...theme.shadows.floating,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    color: theme.colors.textPrimary,
    ...theme.typography.body,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
