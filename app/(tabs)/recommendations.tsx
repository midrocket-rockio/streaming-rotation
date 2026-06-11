// ─── Recommendations Tab Page ───────────────────────────────────

import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Recommendations from '@/components/Recommendations';

export default function RecommendationsPage() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <Recommendations />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
