import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import SavingsChart from '@/components/SavingsChart';
import { useRotationStore } from '@/stores/rotationStore';
import { formatCurrency } from '@/services/calculatorService';

export default function SavingsScreen() {
  const savings = useRotationStore((s) => s.savings);
  const services = useRotationStore((s) => s.services);
  const enabledServices = services.filter((s) => s.enabled);
  const calculateSavings = useRotationStore((s) => s.calculateSavings);

  const [customMonthly, setCustomMonthly] = React.useState('');
  const [showCustom, setShowCustom] = React.useState(false);

  // Custom savings calculation
  const customSavings = React.useMemo(() => {
    if (!customMonthly || showCustom === false) return null;
    const monthly = parseFloat(customMonthly);
    if (isNaN(monthly) || monthly <= 0) return null;
    const rotationMonthly = monthly / Math.max(enabledServices.length, 1);
    const monthlyDiff = monthly - rotationMonthly;
    return {
      allAtOnceMonthly: monthly,
      rotationMonthly: Math.round(rotationMonthly * 100) / 100,
      monthlyDifference: Math.round(monthlyDiff * 100) / 100,
      yearlySavings: Math.round(monthlyDiff * 12 * 100) / 100,
      twoYearSavings: Math.round(monthlyDiff * 24 * 100) / 100,
      threeYearSavings: Math.round(monthlyDiff * 36 * 100) / 100,
      activeServicesCount: enabledServices.length,
      totalServicesCount: services.length,
    };
  }, [customMonthly, showCustom, enabledServices.length, services.length]);

  const displaySavings = showCustom && customSavings ? customSavings : savings;
  const savedPercent = displaySavings.allAtOnceMonthly > 0
    ? Math.round(((displaySavings.allAtOnceMonthly - displaySavings.rotationMonthly) / displaySavings.allAtOnceMonthly) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ahorro</Text>
          <Text style={styles.headerSubtitle}>
            Calcula cuánto ahorras con la rotación
          </Text>
        </View>

        {/* Big Savings Number */}
        <View style={styles.bigSavingsCard}>
          <Text style={styles.bigSavingsLabel}>Ahorro Mensual</Text>
          <Text style={styles.bigSavingsValue}>
            {formatCurrency(displaySavings.monthlyDifference)}
          </Text>
          <Text style={styles.bigSavingsPercent}>-{savedPercent}% vs todo junto</Text>
        </View>

        {/* Chart */}
        <SavingsChart />

        {/* Toggle Custom */}
        <TouchableOpacity
          style={styles.customToggle}
          onPress={() => setShowCustom(!showCustom)}
        >
          <Text style={styles.customToggleText}>
            {showCustom ? '▼' : '▶'} Usar monto personalizado
          </Text>
        </TouchableOpacity>

        {/* Custom Input */}
        {showCustom && (
          <View style={styles.customSection}>
            <Text style={styles.inputLabel}>Tu gasto mensual total en streaming ($)</Text>
            <View style={styles.customInputRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.customInput}
                placeholder="Ej: 80.00"
                value={customMonthly}
                onChangeText={setCustomMonthly}
                keyboardType="decimal-pad"
                placeholderTextColor="#555"
              />
            </View>
            {customSavings && (
              <View style={styles.customResult}>
                <Text style={styles.customResultLabel}>Rotación mensual:</Text>
                <Text style={styles.customResultValue}>
                  {formatCurrency(customSavings.rotationMonthly)}
                </Text>
                <Text style={styles.customResultLabel}>Ahorro anual:</Text>
                <Text style={[styles.customResultValue, { color: '#4ADE80' }]}>
                  {formatCurrency(customSavings.yearlySavings)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Service Breakdown */}
        <View style={styles.breakdown}>
          <Text style={styles.sectionTitle}>📊 Desglose de Servicios</Text>
          {enabledServices.map((svc, i) => {
            const rotationShare =
              Math.round((svc.monthlyPrice / Math.max(enabledServices.length, 1)) * 100) / 100;
            return (
              <View key={svc.id} style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownEmoji}>{svc.icon}</Text>
                  <View>
                    <Text style={styles.breakdownName}>{svc.name}</Text>
                    <Text style={styles.breakdownShare}>
                      Rotación: {formatCurrency(rotationShare)}/mes
                    </Text>
                  </View>
                </View>
                <Text style={styles.breakdownPrice}>
                  {formatCurrency(svc.monthlyPrice)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Tips */}
        <View style={styles.tips}>
          <Text style={styles.sectionTitle}>💡 Consejos para Ahorrar Más</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              🔄 Rotar 4 servicios te ahorra ~75% vs tenerlos todos activos
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              📅 Aprovecha las pruebas gratis de 30 días al reactivar servicios
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              🎯 Mira 2-3 series por servicio antes de cancelar
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              📊 Comparte planes familiares para reducir costos adicionales
            </Text>
          </View>
        </View>

        {/* Yearly Projection */}
        <View style={styles.projection}>
          <Text style={styles.sectionTitle}>📈 Proyección de Ahorro</Text>
          <View style={styles.projectionGrid}>
            <View style={styles.projectionCard}>
              <Text style={styles.projectionPeriod}>6 meses</Text>
              <Text style={styles.projectionAmount}>
                {formatCurrency(displaySavings.monthlyDifference * 6)}
              </Text>
            </View>
            <View style={styles.projectionCard}>
              <Text style={styles.projectionPeriod}>1 año</Text>
              <Text style={[styles.projectionAmount, { color: '#4ADE80' }]}>
                {formatCurrency(displaySavings.yearlySavings)}
              </Text>
            </View>
            <View style={styles.projectionCard}>
              <Text style={styles.projectionPeriod}>2 años</Text>
              <Text style={[styles.projectionAmount, { color: '#4ADE80' }]}>
                {formatCurrency(displaySavings.twoYearSavings)}
              </Text>
            </View>
            <View style={styles.projectionCard}>
              <Text style={styles.projectionPeriod}>3 años</Text>
              <Text style={[styles.projectionAmount, { color: '#4ADE80' }]}>
                {formatCurrency(displaySavings.threeYearSavings)}
              </Text>
            </View>
          </View>
        </View>
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
  bigSavingsCard: {
    backgroundColor: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4ADE8033',
  },
  bigSavingsLabel: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bigSavingsValue: {
    color: '#4ADE80',
    fontSize: 42,
    fontWeight: '800',
    marginTop: 8,
  },
  bigSavingsPercent: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  customToggle: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  customToggleText: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '600',
  },
  customSection: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  inputLabel: {
    color: '#888888',
    fontSize: 13,
    marginBottom: 8,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    color: '#4ADE80',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 8,
  },
  customInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    paddingVertical: 12,
  },
  customResult: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  customResultLabel: {
    color: '#888888',
    fontSize: 12,
    marginTop: 8,
  },
  customResultValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  breakdown: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breakdownEmoji: {
    fontSize: 24,
  },
  breakdownName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  breakdownShare: {
    color: '#888888',
    fontSize: 11,
    marginTop: 2,
  },
  breakdownPrice: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  tips: {
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  tipText: {
    color: '#CCCCCC',
    fontSize: 13,
    lineHeight: 20,
  },
  projection: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  projectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  projectionCard: {
    width: '48%',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 4,
  },
  projectionPeriod: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
  },
  projectionAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
});
