import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCostComparison } from '@/hooks/useCostComparison';
import CostChart from '@/components/CostChart';
import { formatCurrency } from '@/services/calculatorService';
import { useRotationStore } from '@/stores/rotationStore';

export default function CostComparisonScreen() {
  const {
    comparisons,
    budget,
    annualSummary,
    budgetRemaining,
    budgetPercentage,
    spendingByService,
    projectedYearlySavings,
    projectedTwoYearSavings,
    addComparison,
    updateBudget,
  } = useCostComparison();

  const services = useRotationStore((s) => s.services);
  const enabledServices = services.filter((s) => s.enabled);

  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.monthlyBudget.toString());

  const [showAddForm, setShowAddForm] = useState(false);
  const [newServiceId, setNewServiceId] = useState(enabledServices[0]?.id ?? '');
  const [newSimCost, setNewSimCost] = useState('');
  const [newRotCost, setNewRotCost] = useState('');

  const handleUpdateBudget = () => {
    const val = parseFloat(newBudget);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Error', 'Ingresa un presupuesto válido');
      return;
    }
    updateBudget({ monthlyBudget: val });
    setShowBudgetForm(false);
  };

  const handleAddComparison = () => {
    const simCost = parseFloat(newSimCost);
    const rotCost = parseFloat(newRotCost);
    if (isNaN(simCost) || isNaN(rotCost)) {
      Alert.alert('Error', 'Ingresa valores válidos');
      return;
    }
    const service = services.find((s) => s.id === newServiceId);
    if (!service) {
      Alert.alert('Error', 'Selecciona un servicio');
      return;
    }
    const now = new Date();
    addComparison({
      id: `comp-${Date.now()}`,
      month: now.getMonth(),
      year: now.getFullYear(),
      simultaneousCost: simCost,
      rotationCost: rotCost,
      savings: Math.max(0, simCost - rotCost),
      activeServiceId: service.id,
      activeServiceName: service.name,
    });
    setNewSimCost('');
    setNewRotCost('');
    setShowAddForm(false);
  };

  const savingsPercent = annualSummary.totalSimultaneous > 0
    ? Math.round(
        ((annualSummary.totalSimultaneous - annualSummary.totalRotation) /
          annualSummary.totalSimultaneous) *
          100
      )
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>💰 Comparación de Costos</Text>
          <Text style={styles.subtitle}>
            Análisis de ahorro · Rotación vs. Todo junto
          </Text>
        </View>

        {/* Budget card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetTitle}>Presupuesto Mensual</Text>
            <TouchableOpacity onPress={() => setShowBudgetForm(!showBudgetForm)}>
              <Text style={styles.editBudget}>✏️ Editar</Text>
            </TouchableOpacity>
          </View>

          {showBudgetForm ? (
            <View style={styles.budgetForm}>
              <View style={styles.currencyRow}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.budgetInput}
                  value={newBudget}
                  onChangeText={setNewBudget}
                  keyboardType="decimal-pad"
                  placeholder="50.00"
                  placeholderTextColor="#555555"
                />
              </View>
              <View style={styles.budgetButtons}>
                <TouchableOpacity
                  style={[styles.budgetBtn, styles.budgetBtnCancel]}
                  onPress={() => setShowBudgetForm(false)}
                >
                  <Text style={styles.budgetBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.budgetBtn, styles.budgetBtnSave]}
                  onPress={handleUpdateBudget}
                >
                  <Text style={styles.budgetBtnText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.budgetAmountRow}>
                <Text style={styles.budgetAmount}>{formatCurrency(budget.monthlyBudget)}</Text>
                <Text style={styles.budgetLabel}>/mes</Text>
              </View>
              <View style={styles.budgetBar}>
                <View
                  style={[
                    styles.budgetFill,
                    {
                      width: `${Math.min(budgetPercentage, 100)}%`,
                      backgroundColor:
                        budgetPercentage > 100
                          ? '#FF4444'
                          : budgetPercentage > 80
                          ? '#F59E0B'
                          : '#4ADE80',
                    },
                  ]}
                />
              </View>
              <View style={styles.budgetFooter}>
                <Text style={styles.budgetSpent}>
                  Gastado: {formatCurrency(budget.monthlyBudget - budgetRemaining)}
                </Text>
                <Text style={styles.budgetLeft}>
                  Restante: {formatCurrency(budgetRemaining)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Cost Chart */}
        <CostChart
          simultaneousCost={annualSummary.totalSimultaneous}
          rotationCost={annualSummary.totalRotation}
          savings={annualSummary.totalSavings}
          title="Resumen Anual"
        />

        {/* Annual Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📊 Resumen Anual</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Costo simultáneo</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(annualSummary.totalSimultaneous)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Costo rotación</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(annualSummary.totalRotation)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowSavings]}>
            <Text style={styles.summaryLabel}>Ahorro total</Text>
            <Text style={[styles.summaryValue, { color: '#4ADE80' }]}>
              {formatCurrency(annualSummary.totalSavings)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Porcentaje ahorrado</Text>
            <Text style={[styles.summaryValue, { color: '#F59E0B' }]}>
              {savingsPercent}%
            </Text>
          </View>
        </View>

        {/* Projections */}
        <View style={styles.projectionCard}>
          <Text style={styles.projectionTitle}>🚀 Proyecciones</Text>
          <View style={styles.projectionRow}>
            <Text style={styles.projectionLabel}>Ahorro anual estimado</Text>
            <Text style={[styles.projectionValue, { color: '#4ADE80' }]}>
              {formatCurrency(projectedYearlySavings)}
            </Text>
          </View>
          <View style={styles.projectionRow}>
            <Text style={styles.projectionLabel}>Ahorro 2 años estimado</Text>
            <Text style={[styles.projectionValue, { color: '#4ADE80' }]}>
              {formatCurrency(projectedTwoYearSavings)}
            </Text>
          </View>
        </View>

        {/* Spending by service */}
        {Object.keys(spendingByService).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Gasto por Servicio</Text>
            {Object.entries(spendingByService).map(([serviceId, data]) => {
              const service = services.find((s) => s.id === serviceId);
              return (
                <View key={serviceId} style={styles.spendingItem}>
                  <View style={styles.spendingInfo}>
                    <Text style={styles.spendingName}>
                      {service?.icon ?? '📺'} {service?.name ?? serviceId}
                    </Text>
                    <Text style={styles.spendingCount}>{data.count} meses</Text>
                  </View>
                  <Text style={styles.spendingTotal}>
                    {formatCurrency(data.total)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Add comparison */}
        {!showAddForm && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.addBtnText}>+ Agregar Comparación</Text>
          </TouchableOpacity>
        )}

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Nueva Comparación</Text>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Costo Simultáneo ($)</Text>
                <TextInput
                  style={styles.input}
                  value={newSimCost}
                  onChangeText={setNewSimCost}
                  keyboardType="decimal-pad"
                  placeholder="100.00"
                  placeholderTextColor="#555555"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Costo Rotación ($)</Text>
                <TextInput
                  style={styles.input}
                  value={newRotCost}
                  onChangeText={setNewRotCost}
                  keyboardType="decimal-pad"
                  placeholder="30.00"
                  placeholderTextColor="#555555"
                />
              </View>
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formBtn, styles.formBtnCancel]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.formBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formBtn, styles.formBtnAdd]}
                onPress={handleAddComparison}
              >
                <Text style={styles.formBtnText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Comparison history */}
        {comparisons.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Historial de Comparaciones</Text>
            {comparisons.slice(0, 10).map((comp) => (
              <View key={comp.id} style={styles.comparisonItem}>
                <Text style={styles.comparisonService}>{comp.activeServiceName}</Text>
                <View style={styles.comparisonValues}>
                  <Text style={styles.comparisonSim}>
                    Sim: {formatCurrency(comp.simultaneousCost)}
                  </Text>
                  <Text style={styles.comparisonRot}>
                    Rot: {formatCurrency(comp.rotationCost)}
                  </Text>
                  <Text style={styles.comparisonSavings}>
                    Ahorro: {formatCurrency(comp.savings)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty state */}
        {comparisons.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💰</Text>
            <Text style={styles.emptyTitle}>Sin datos de costos</Text>
            <Text style={styles.emptyText}>
              Agrega comparaciones de costos para ver tu análisis de ahorro
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
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#888888',
    fontSize: 13,
    marginTop: 4,
  },
  budgetCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  editBudget: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '600',
  },
  budgetForm: {
    gap: 10,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    color: '#4ADE80',
    fontSize: 20,
    fontWeight: '700',
  },
  budgetInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    padding: 10,
  },
  budgetButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  budgetBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  budgetBtnCancel: {
    backgroundColor: '#333333',
  },
  budgetBtnSave: {
    backgroundColor: '#4ADE80',
  },
  budgetBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  budgetAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  budgetAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  budgetLabel: {
    color: '#888888',
    fontSize: 13,
    marginLeft: 4,
  },
  budgetBar: {
    height: 8,
    backgroundColor: '#16213e',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  budgetFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  budgetSpent: {
    color: '#888888',
    fontSize: 11,
  },
  budgetLeft: {
    color: '#4ADE80',
    fontSize: 11,
    fontWeight: '600',
  },
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
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
  summaryRowSavings: {
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
    paddingTop: 10,
    marginTop: 4,
  },
  projectionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  projectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  projectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  projectionLabel: {
    color: '#888888',
    fontSize: 13,
  },
  projectionValue: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  spendingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  spendingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spendingName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  spendingCount: {
    color: '#888888',
    fontSize: 10,
  },
  spendingTotal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  addBtn: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#4ADE80',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  addForm: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  halfInput: {
    flex: 1,
  },
  inputLabel: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 10,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  formBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  formBtnCancel: {
    backgroundColor: '#333333',
  },
  formBtnAdd: {
    backgroundColor: '#4ADE80',
  },
  formBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  comparisonItem: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  comparisonService: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  comparisonValues: {
    flexDirection: 'row',
    gap: 12,
  },
  comparisonSim: {
    color: '#E50914',
    fontSize: 10,
  },
  comparisonRot: {
    color: '#4ADE80',
    fontSize: 10,
  },
  comparisonSavings: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: '#888888',
    fontSize: 13,
    textAlign: 'center',
  },
});
