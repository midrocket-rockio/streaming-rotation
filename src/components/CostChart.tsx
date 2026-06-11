import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CostChartProps {
  simultaneousCost: number;
  rotationCost: number;
  savings: number;
}

export const CostChart: React.FC<CostChartProps> = ({ simultaneousCost, rotationCost, savings }) => {
  const maxCost = Math.max(simultaneousCost, rotationCost);
  const simPercent = maxCost > 0 ? (simultaneousCost / maxCost) * 100 : 0;
  const rotPercent = maxCost > 0 ? (rotationCost / maxCost) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cost Comparison</Text>

      <View style={styles.barGroup}>
        <Text style={styles.barLabel}>Simultaneous</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, styles.simBar, { width: `${simPercent}%` }]} />
        </View>
        <Text style={styles.barValue}>${simultaneousCost.toFixed(2)}/mo</Text>
      </View>

      <View style={styles.barGroup}>
        <Text style={styles.barLabel}>Rotation</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, styles.rotBar, { width: `${rotPercent}%` }]} />
        </View>
        <Text style={styles.barValue}>${rotationCost.toFixed(2)}/mo</Text>
      </View>

      <View style={styles.savingsCard}>
        <Text style={styles.savingsIcon}>💰</Text>
        <Text style={styles.savingsLabel}>Monthly Savings</Text>
        <Text style={styles.savingsValue}>${savings.toFixed(2)}</Text>
        <Text style={styles.savingsAnnual}>${(savings * 12).toFixed(2)}/year</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  barGroup: { marginBottom: 12 },
  barLabel: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  barTrack: { height: 24, backgroundColor: '#f1f5f9', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 6 },
  simBar: { backgroundColor: '#ef4444' },
  rotBar: { backgroundColor: '#10b981' },
  barValue: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginTop: 4 },
  savingsCard: { marginTop: 16, backgroundColor: '#f0fdf4', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#bbf7d0' },
  savingsIcon: { fontSize: 28 },
  savingsLabel: { fontSize: 13, color: '#166534', fontWeight: '600' },
  savingsValue: { fontSize: 24, fontWeight: '800', color: '#059669', marginTop: 2 },
  savingsAnnual: { fontSize: 14, color: '#059669', marginTop: 2 },
});
