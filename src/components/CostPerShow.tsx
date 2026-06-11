// ─── Cost Per Show Component ────────────────────────────────────

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useWatchStore } from '@/stores/watchStore';
import { useRotationStore } from '@/stores/rotationStore';
import { useCostPerShow, useCostSummary } from '@/hooks/useCostPerShow';

export default function CostPerShow() {
  const watchHistory = useWatchStore((s) => s.watchHistory);
  const services = useRotationStore((s) => s.services);
  const enabledServices = services.filter((s) => s.enabled);

  const totalMonthlyCost = enabledServices.reduce((sum, s) => sum + s.monthlyPrice, 0);

  const costPerShows = useCostPerShow(watchHistory, totalMonthlyCost, enabledServices.length);
  const summary = useCostSummary(watchHistory, totalMonthlyCost);

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;
  const formatHours = (n: number) => `${n.toFixed(1)}h`;

  const renderCostItem = ({ item }: { item: typeof costPerShows[0] }) => (
    <View style={styles.card}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemService}>{item.service}</Text>
      </View>
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{formatHours(item.hoursWatched)}</Text>
          <Text style={styles.metricLabel}>Hours</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.metricValue, { color: item.costPerHour < 1 ? '#4ADE80' : item.costPerHour < 3 ? '#FBBF24' : '#F87171' }]}>
            {formatCurrency(item.costPerHour)}
          </Text>
          <Text style={styles.metricLabel}>Per Hour</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>★ {item.rating}</Text>
          <Text style={styles.metricLabel}>Rating</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { backgroundColor: '#1a1a2e' }]}>
          <Text style={styles.summaryValue}>{formatCurrency(summary.totalCost)}</Text>
          <Text style={styles.summaryLabel}>Monthly Cost</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#1a1a2e' }]}>
          <Text style={styles.summaryValue}>{formatHours(summary.totalHours)}</Text>
          <Text style={styles.summaryLabel}>Hours Watched</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#1a1a2e' }]}>
          <Text style={styles.summaryValue}>{formatCurrency(summary.avgCostPerHour)}</Text>
          <Text style={styles.summaryLabel}>Avg $/Hour</Text>
        </View>
      </View>

      {/* Best / Worst */}
      {summary.bestValueShow && (
        <View style={styles.bestWorstRow}>
          <View style={[styles.bwCard, { borderColor: '#4ADE80' }]}>
            <Text style={styles.bwLabel}>💰 Best Value</Text>
            <Text style={styles.bwValue}>{summary.bestValueShow.title}</Text>
            <Text style={styles.bwSub}>{formatCurrency(summary.bestValueShow.costPerHour)}/hr</Text>
          </View>
          {summary.worstValueShow && (
            <View style={[styles.bwCard, { borderColor: '#F87171' }]}>
              <Text style={styles.bwLabel}>📉 Worst Value</Text>
              <Text style={styles.bwValue}>{summary.worstValueShow.title}</Text>
              <Text style={styles.bwSub}>{formatCurrency(summary.worstValueShow.costPerHour)}/hr</Text>
            </View>
          )}
        </View>
      )}

      {/* Cost Per Show List */}
      <Text style={styles.sectionTitle}>Cost Breakdown</Text>
      <FlatList
        data={costPerShows}
        keyExtractor={(item) => item.id}
        renderItem={renderCostItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  bestWorstRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  bwCard: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    backgroundColor: '#1a1a2e',
  },
  bwLabel: {
    fontSize: 12,
    color: '#888',
  },
  bwValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  bwSub: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  list: {
    gap: 8,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  itemService: {
    fontSize: 12,
    color: '#888',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  metricLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
});
