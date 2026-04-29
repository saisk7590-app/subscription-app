import React from 'react';
import { StyleSheet, View } from 'react-native';

import ChartPlaceholder from '../../components/ChartPlaceholder';
import theme from '../../constants/theme';

const chartTitles = [
  'Category Distribution',
  'Yearly Spending',
  'Price Trend',
  'Spending Spike',
  'Top Services',
];

export default function AnalyticsTab() {
  return (
    <View style={styles.container}>
      {chartTitles.map((title) => (
        <ChartPlaceholder key={title} title={title} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
});
