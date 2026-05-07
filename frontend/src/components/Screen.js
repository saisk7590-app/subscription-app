import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';

import theme from '../constants/theme';

export default function Screen({ children, scroll = true, contentContainerStyle }) {
  const Wrapper = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Wrapper
        style={styles.wrapper}
        contentContainerStyle={scroll ? [styles.contentContainer, contentContainerStyle] : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingBottom: 104,
  },
});
