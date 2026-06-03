import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRotationStore } from '@/stores/rotationStore';
import { formatCurrency, calculatePercentageSaved } from '@/services/calculatorService';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 64;
const CHART_HEIGHT = 200;

export default function SavingsChart() {
  const savings = useRotationStore((s) => s.savings);
  const maxVal = Math.max(savings.allAtOnceMonthly, savings.rotationMonthly, 1);

  // Bar dimensions
  const barWidth = CHART_WIDTH / 3 - 24;
  const allAtOnceHeight = (savings.allAtOnceMonthly / maxVal) * (CHART_HEIGHT - 60);
  const rotationHeight = (savings.rotationMonthly / maxVal) * (CHART_HEIGHT - 60);
  const savingsHeight = (savings.monthlyDifference / maxVal) * (CHART_HEIGHT - 60);

  const savedPercentage = calculatePercentageSaved(
    savings.allAtOnceMonthly,
    savings.rotationMonthly
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Comparación de Costos</Text>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>{formatCurrency(maxVal)}</Text>
          <Text style={styles.yAxisLabel}>{formatCurrency(maxVal * 0.5)}</Text>
          <Text style={styles.yAxisLabel}>$0</Text>
        </View>

        {/* Bars */}
        <View style={styles.barsContainer}>
          {/* All at once bar */}
          <View style={styles.barGroup}>
            <View style={styles.barLabel}>
              <Text style={styles.barLabelText}>Todo</Text>
            </View>
            <View style={[styles.bar, { height: allAtOnceHeight, backgroundColor: '#E50914' }]} />
            <Text style={styles.barValue}>
              {formatCurrency(savings.allAtOnceMonthly)}
            </Text>
          </View>

          {/* Rotation bar */}
          <View style={styles.barGroup}>
            <View style={styles.barLabel}>
              <Text style={styles.barLabelText}>Rotación</Text>
            </View>
            <View style={[styles.bar, { height: rotationHeight, backgroundColor: '#4ADE80' }]} />
            <Text style={styles.barValue}>
              {formatCurrency(savings.rotationMonthly)}
            </Text>
          </View>

          {/* Savings bar */}
          <View style={styles.barGroup}>
            <View style={styles.barLabel}>
              <Text style={styles.barLabelText}>Ahorro</Text>
            </View>
            <View style={[styles.bar, { height: savingsHeight, backgroundColor: '#F59E0B' }]} />
            <Text style={styles.barValue}>
              {formatCurrency(savings.monthlyDifference)}
            </Text>
          </View>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ahorro mensual:</Text>
          <Text style={styles.summaryValue}>
            {formatCurrency(savings.monthlyDifference)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Ahorro anual:</Text>
          <Text style={[styles.summaryValue, { color: '#4ADE80' }]}>
            {formatCurrency(savings.yearlySavings)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Reducción:</Text>
          <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
            -{savedPercentage}%
          </Text>
        </View>
      </View>

      {/* Long-term projections */}
      <View style={styles.projections}>
        <Text style={styles.projectionsTitle}>Proyección a largo plazo</Text>
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>1 año</Text>
          <Text style={styles.projectionValue}>{formatCurrency(savings.yearlySavings)}</Text>
        </View>
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>2 años</Text>
          <Text style={styles.projectionValue}>{formatCurrency(savings.twoYearSavings)}</Text>
        </View>
        <View style={styles.projectionRow}>
          <Text style={styles.projectionLabel}>3 años</Text>
          <Text style={styles.projectionValue}>{formatCurrency(savings.threeYearSavings)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  yAxis: {
    width: 48,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yAxisLabel: {
    color: '#555555',
    fontSize: 10,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: CHART_HEIGHT - 20,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barLabel: {
    marginBottom: 4,
  },
  barLabelText: {
    color: '#888888',
    fontSize: 10,
  },
  bar: {
    width: 32,
    borderRadius: 6,
    minHeight: 4,
  },
  barValue: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
    paddingTop: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    color: '#888888',
    fontSize: 13,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  projections: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
    paddingTop: 12,
  },
  projectionsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  projectionLabel: {
    color: '#888888',
    fontSize: 12,
  },
  projectionValue: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '600',
  },
});
