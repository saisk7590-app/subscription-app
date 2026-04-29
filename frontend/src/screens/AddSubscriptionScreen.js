import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, TextInput, Switch, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Theme from '../constants/theme';
import { categories } from '../features/analytics/analyticsData';

function formatDateDisplay(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AddSubscriptionScreen({ onBack }) {
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
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate next due date
      if (field === 'startDate' || field === 'billingType' || field === 'duration') {
        const startDate = field === 'startDate' ? value : prev.startDate;
        const billingType = field === 'billingType' ? value : prev.billingType;
        const duration = field === 'duration' ? value : prev.duration;
        
        if (startDate) {
          const date = new Date(startDate);
          if (!isNaN(date.getTime())) {
            if (billingType === 'Monthly') {
              date.setMonth(date.getMonth() + 1);
            } else if (billingType === 'Yearly') {
              date.setFullYear(date.getFullYear() + 1);
            } else if (billingType === 'Custom' && duration) {
              date.setDate(date.getDate() + parseInt(duration));
            }
            newData.nextDueDate = date.toISOString().split('T')[0];
          }
        } else {
          newData.nextDueDate = '';
        }
      }
      return newData;
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#0f172a" />
        </Pressable>
        <Text style={styles.headerTitle}>Add Subscription</Text>
      </View>
    </View>
  );

  const flatData = [
    { type: 'basic' },
    { type: 'billing' },
    { type: 'date' },
    { type: 'extra' },
    { type: 'reminder' },
    { type: 'submit' },
  ];

  const renderItem = ({ item }) => {
    if (item.type === 'basic') {
      return (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Service Name</Text>
            <TextInput 
              value={formData.serviceName}
              onChangeText={v => handleChange('serviceName', v)}
              placeholder="e.g. Netflix"
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerWrap}>
              <TextInput 
                value={formData.category}
                onChangeText={v => handleChange('category', v)}
                placeholder="Select or type category"
                style={styles.pickerInput}
              />
              <Feather name="chevron-down" size={18} color="#94a3b8" />
            </View>
          </View>
        </View>
      );
    }

    if (item.type === 'billing') {
      return (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Billing Details</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Price (₹)</Text>
            <TextInput 
              value={formData.price}
              onChangeText={v => handleChange('price', v)}
              placeholder="0"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Billing Type</Text>
            <View style={styles.billingTypeRow}>
              {['Monthly', 'Yearly', 'Custom'].map(t => (
                <Pressable 
                  key={t} 
                  onPress={() => handleChange('billingType', t)}
                  style={[styles.typeBtn, formData.billingType === t && styles.typeBtnActive]}
                >
                  <Text style={[styles.typeBtnText, formData.billingType === t && styles.typeBtnTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          {formData.billingType === 'Custom' && (
            <View style={styles.field}>
              <Text style={styles.label}>Duration (days)</Text>
              <TextInput 
                value={formData.duration}
                onChangeText={v => handleChange('duration', v)}
                placeholder="30"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          )}
        </View>
      );
    }

    if (item.type === 'date') {
      return (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Date Information</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
            <View style={styles.inputWithIcon}>
              <TextInput 
                value={formData.startDate}
                onChangeText={v => handleChange('startDate', v)}
                placeholder="2026-01-01"
                style={styles.inputTransparent}
              />
              <Feather name="calendar" size={18} color="#94a3b8" />
            </View>
          </View>
          <View style={styles.field}>
            <View style={styles.labelWithInfo}>
              <Text style={styles.label}>Next Due Date</Text>
              <Feather name="info" size={14} color="#94a3b8" />
            </View>
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>
                {formData.nextDueDate ? formatDateDisplay(formData.nextDueDate) : 'Auto-calculated'}
              </Text>
              <Feather name="calendar" size={18} color="#94a3b8" />
            </View>
            <Text style={styles.helperText}>Auto-calculated based on billing type</Text>
          </View>
        </View>
      );
    }

    if (item.type === 'extra') {
      return (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Additional Info</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Remark</Text>
            <TextInput 
              value={formData.remark}
              onChangeText={v => handleChange('remark', v)}
              placeholder="e.g. Premium Plan"
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
            />
          </View>
        </View>
      );
    }

    if (item.type === 'reminder') {
      return (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Reminder Settings</Text>
          <View style={styles.switchRow}>
            <Text style={styles.labelNoMargin}>Enable Reminder</Text>
            <Switch 
              value={formData.reminderEnabled}
              onValueChange={v => handleChange('reminderEnabled', v)}
              trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
              thumbColor="#fff"
            />
          </View>
          {formData.reminderEnabled && (
            <View style={styles.field}>
              <Text style={styles.label}>Remind me before (days)</Text>
              <View style={styles.daysRow}>
                {['3', '5', '7'].map(d => (
                  <Pressable 
                    key={d} 
                    onPress={() => handleChange('reminderDays', d)}
                    style={[styles.dayBtn, formData.reminderDays === d && styles.dayBtnActive]}
                  >
                    <Text style={[styles.dayBtnText, formData.reminderDays === d && styles.dayBtnTextActive]}>{d} days</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      );
    }

    if (item.type === 'submit') {
      return (
        <Pressable onPress={() => onBack()}>
          <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>Save Subscription</Text>
          </LinearGradient>
        </Pressable>
      );
    }

    return null;
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={flatData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  labelNoMargin: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  labelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0f172a',
  },
  inputTransparent: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  billingTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  typeBtnActive: {
    backgroundColor: '#3b82f6',
  },
  typeBtnText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  disabledInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  disabledInputText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  helperText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 6,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },
  dayBtnActive: {
    backgroundColor: '#3b82f6',
  },
  dayBtnText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  dayBtnTextActive: {
    color: '#fff',
  },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
