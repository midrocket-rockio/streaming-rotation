import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useHistoryStore } from '@/stores/historyStore';
import { formatCurrency } from '@/services/calculatorService';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export default function HistoryScreen() {
  const entries = useHistoryStore((s) => s.entries);
  const getMonthlySpending = useHistoryStore((s) => s.getMonthlySpending);
  const getSpendingByService = useHistoryStore((s) => s.getSpendingByService);
  const getTotalSpent = useHistoryStore((s) => s.getTotalSpent);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthlySpending = getMonthlySpending(currentYear, currentMonth);
  const spendingByService = getSpendingByService();
  const totalSpent = getTotalSpent();

  // Group entries by month
  const groupedByMonth: Record<string, typeof entries> = {};
  for (const entry of entries) {
    const d = new Date(entry.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groupedByMonth[key]) {
      groupedByMonth[key] = [];
    }
    groupedByMonth[key].push(entry);
  }

  const sortedMonths = Object.keys(groupedByMonth).sort().reverse();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 Historial</Text>
          <Text style={styles.headerSubtitle}>
            {entries.length} registros · {formatCurrency(totalSpent)} total
          </Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Este Mes</Text>
            <Text style={styles.summaryValue}>{formatCurrency(monthlySpending)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Gastado</Text>
            <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
              {formatCurrency(totalSpent)}
            </Text>
          </View>
        </View>

        {/* Spending by Service */}
        {Object.keys(spendingByService).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gasto por Servicio</Text>
            {Object.entries(spendingByService)
              .sort(([, a], [, b]) => b.total - a.total)
              .map(([serviceId, data]) => {
                const service = entries.find((e) => e.serviceId === serviceId);
                return (
                  <View key={serviceId} style={styles.serviceSpendingRow}>
                    <View style={styles.serviceSpendingLeft}>
                      <Text style={styles.serviceSpendingEmoji}>{service?.icon || '📺'}</Text>
                      <View>
                        <Text style={styles.serviceSpendingName}>{service?.serviceName || serviceId}</Text>
                        <Text style={styles.serviceSpendingCount}>{data.count} rotaciones</Text>
                      </View>
                    </View>
                    <View style={styles.serviceSpendingRight}>
                      <Text style={styles.serviceSpendingTotal}>{formatCurrency(data.total)}</Text>
                      <View style={styles.spendingBar}>
                        <View
                          style={[
                            styles.spendingBarFill,
                            { width: `${Math.min((data.total / (totalSpent || 1)) * 100, 100)}%` },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
          </View>
        )}

        {/* Monthly Breakdown */}
        {sortedMonths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Desglose Mensual</Text>
            {sortedMonths.map((monthKey) => {
              const [yearStr, monthStr] = monthKey.split('-');
              const year = parseInt(yearStr);
              const month = parseInt(monthStr) - 1;
              const monthEntries = groupedByMonth[monthKey];
              const monthTotal = monthEntries.reduce((sum, e) => sum + e.monthlyPrice, 0);
              const isCurrent = year === currentYear && month === currentMonth;

              return (
                <View key={monthKey} style={[styles.monthCard, isCurrent && styles.monthCardCurrent]}>
                  <View style={styles.monthHeader}>
                    <Text style={[styles.monthName, isCurrent && styles.monthNameCurrent]}>
                      {MONTHS[month]} {year}
                    </Text>
                    <Text style={styles.monthTotal}>{formatCurrency(monthTotal)}</Text>
                  </View>
                  {monthEntries.slice(0, 5).map((entry) => (
                    <View key={entry.id} style={styles.monthEntry}>
                      <Text style={styles.monthEntryIcon}>{entry.icon}</Text>
                      <View style={styles.monthEntryInfo}>
                        <Text style={styles.monthEntryName}>{entry.serviceName}</Text>
                        <Text style={styles.monthEntryDate}>
                          {new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </Text>
                      </View>
                      <Text style={styles.monthEntryPrice}>
                        {formatCurrency(entry.monthlyPrice)}
                      </Text>
                    </View>
                  ))}
                  {monthEntries.length > 5 && (
                    <Text style={styles.moreEntries}>
                      +{monthEntries.length - 5} más
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Empty State */}
        {entries.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>Sin historial aún</Text>
            <Text style={styles.emptyDesc}>
              Tu historial de rotaciones aparecerá aquí.
              Cada vez que gires un servicio, se registrará.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
    paddingTop: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#888888',
    fontSize: 13,
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  summaryLabel: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  // Service spending
  serviceSpendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  serviceSpendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  serviceSpendingEmoji: {
    fontSize: 24,
  },
  serviceSpendingName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  serviceSpendingCount: {
    color: '#888888',
    fontSize: 11,
    marginTop: 2,
  },
  serviceSpendingRight: {
    alignItems: 'flex-end',
    width: 120,
  },
  serviceSpendingTotal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  spendingBar: {
    height: 4,
    backgroundColor: '#0a0a0a',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  spendingBarFill: {
    height: '100%',
    backgroundColor: '#4ADE80',
    borderRadius: 2,
  },
  // Month cards
  monthCard: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  monthCardCurrent: {
    borderColor: '#4ADE80',
    backgroundColor: '#0d2818',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  monthNameCurrent: {
    color: '#4ADE80',
  },
  monthTotal: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '700',
  },
  monthEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  monthEntryIcon: {
    fontSize: 18,
  },
  monthEntryInfo: {
    flex: 1,
  },
  monthEntryName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  monthEntryDate: {
    color: '#555555',
    fontSize: 10,
  },
  monthEntryPrice: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  moreEntries: {
    color: '#555555',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDesc: {
    color: '#888888',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
