import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Screen from '../components/Screen';
import SelectField from '../components/SelectField';
import SurfaceCard from '../components/SurfaceCard';
import theme from '../constants/theme';
import { categories } from '../data/mockData';
import { formatDateDisplay } from '../utils/formatters';

export default function AddSubscriptionScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    price: '',
    billingType: 'Monthly',
    duration: '',
    startDate: '',
    nextDueDate: '',
    remark: '',
    reminderEnabled: true,
    reminderDays: '3',
  });

  const handleChange = (field, value) => {
    setFormData((current) => {
      const next = { ...current, [field]: value };
      const startDate = field === 'startDate' ? value : current.startDate;
      const billingType = field === 'billingType' ? value : current.billingType;
      const duration = field === 'duration' ? value : current.duration;

      if (startDate && ['startDate', 'billingType', 'duration'].includes(field)) {
        const date = new Date(startDate);

        if (!Number.isNaN(date.getTime())) {
          if (billingType === 'Monthly') {
            date.setMonth(date.getMonth() + 1);
          } else if (billingType === 'Yearly') {
            date.setFullYear(date.getFullYear() + 1);
          } else if (billingType === 'Custom' && duration) {
            date.setDate(date.getDate() + Number(duration));
          }

          next.nextDueDate = date.toISOString().split('T')[0];
        }
      }

      if (field === 'startDate' && !value) {
        next.nextDueDate = '';
      }

      return next;
    });
  };

  const reminderOptions = ['3', '5', '7'];
  const categoryOptions = useMemo(() => [...categories, '+ Add new category'], []);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.navigate('Dashboard')} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Add Subscription</Text>
        </View>
      </View>

      <View style={styles.content}>
        <SurfaceCard style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View>
            <View style={styles.fieldGroupWithMargin}>
              <Text style={styles.label}>Service Name</Text>
              <TextInput
                value={formData.serviceName}
                onChangeText={(value) => handleChange('serviceName', value)}
                placeholder="e.g. Netflix"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.input}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Category</Text>
              <SelectField
                value={formData.category}
                options={categoryOptions}
                onSelect={(value) => handleChange('category', value)}
                label="Category"
                placeholder="Select category"
                fullWidth={false}
              />
            </View>
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Billing Details</Text>
          <View>
            <View style={styles.fieldGroupWithMargin}>
              <Text style={styles.label}>Price (₹)</Text>
              <TextInput
                value={formData.price}
                onChangeText={(value) => handleChange('price', value)}
                placeholder="0"
                placeholderTextColor={theme.colors.textMuted}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Billing Type</Text>
              <SelectField
                value={formData.billingType}
                options={['Monthly', 'Yearly', 'Custom']}
                onSelect={(value) => handleChange('billingType', value)}
                label="Billing Type"
                fullWidth={false}
              />
            </View>
            {formData.billingType === 'Custom' && (
              <View style={styles.fieldGroupExtraTop}>
                <Text style={styles.label}>Duration (days)</Text>
                <TextInput
                  value={formData.duration}
                  onChangeText={(value) => handleChange('duration', value)}
                  placeholder="30"
                  placeholderTextColor={theme.colors.textMuted}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            )}
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Date Information</Text>
          <View>
            <View style={styles.fieldGroupWithMargin}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                value={formData.startDate}
                onChangeText={(value) => handleChange('startDate', value)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.colors.textMuted}
                style={styles.input}
              />
            </View>
            <View style={styles.fieldGroup}>
              <View style={styles.infoLabelRow}>
                <Text style={styles.label}>Next Due Date</Text>
                <Feather name="info" size={14} color={theme.colors.textMuted} />
              </View>
              <View style={styles.readOnlyInput}>
                <Text style={styles.readOnlyText}>
                  {formData.nextDueDate ? formatDateDisplay(formData.nextDueDate) : 'Select start date and billing type'}
                </Text>
                <Feather name="calendar" size={18} color={theme.colors.textMuted} />
              </View>
              <Text style={styles.helpText}>Auto-calculated based on billing type and duration</Text>
            </View>
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Additional Info</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Remark</Text>
            <TextInput
              value={formData.remark}
              onChangeText={(value) => handleChange('remark', value)}
              placeholder="e.g. Premium Plan, Includes Ads, Family Plan..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
            />
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.cardSpacing}>
          <Text style={styles.sectionTitle}>Reminder Settings</Text>
          <View>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Enable Reminder</Text>
              <Switch
                trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
                thumbColor={theme.colors.white}
                value={formData.reminderEnabled}
                onValueChange={(value) => handleChange('reminderEnabled', value)}
              />
            </View>

            {formData.reminderEnabled && (
              <View style={styles.fieldGroupExtraTop}>
                <Text style={styles.label}>Remind me before (days)</Text>
                <SelectField
                  value={formData.reminderDays}
                  options={reminderOptions}
                  onSelect={(value) => handleChange('reminderDays', value)}
                  label="Reminder Days"
                  fullWidth={false}
                />
              </View>
            )}
          </View>
        </SurfaceCard>

        <Pressable style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Subscription</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    marginLeft: -8,
    padding: 8,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  cardSpacing: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    color: theme.colors.textPrimary,
    ...theme.typography.h2,
  },
  fieldGroup: {
    marginBottom: 0,
  },
  fieldGroupWithMargin: {
    marginBottom: 16,
  },
  fieldGroupExtraTop: {
    marginTop: 16,
  },
  label: {
    marginBottom: 8,
    color: theme.colors.textPrimary,
    ...theme.typography.bodyMedium,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
    ...theme.typography.body,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  readOnlyInput: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: theme.radius.md,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readOnlyText: {
    color: '#6B7280',
    ...theme.typography.body,
  },
  helpText: {
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.floating,
  },
  saveButtonText: {
    color: theme.colors.white,
    ...theme.typography.bodyMedium,
  },
});
