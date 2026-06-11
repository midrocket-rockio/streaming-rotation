import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSchedule } from '../src/hooks/useSchedule';
import { useCostComparison } from '../src/hooks/useCostComparison';
import { CostChart } from '../src/components/CostChart';
import { ScheduleDay } from '../src/components/ScheduleDay';

export default function ScheduleScreen() {
  const { entries, upcoming, active, completed } = useSchedule();
  const { annualSummary } = useCostComparison();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Rotation Schedule</Text>
        <Text style={styles.subtitle}>Plan your streaming rotations</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{upcoming.length}</Text>
          <Text style={styles.summaryLabel}>Upcoming</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{active.length}</Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{completed.length}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.calendarSection}>
        <Text style={styles.sectionTitle}>
          {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        <View style={styles.calendarGrid}>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const hasEntry = entries.some((e) => {
              const d = new Date(e.startDate);
              return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
            });
            const entry = entries.find((e) => {
              const d = new Date(e.startDate);
              return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
            });
            return (
              <ScheduleDay
                key={day}
                day={day}
                hasEntry={hasEntry}
                isToday={day === today}
                isActive={entry?.isActive || false}
                isCompleted={!entry?.isActive && hasEntry}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.costSection}>
        <CostChart
          simultaneousCost={annualSummary.totalMonthly}
          rotationCost={Math.round(annualSummary.totalMonthly * 0.5 * 100) / 100}
          savings={Math.round(annualSummary.totalMonthly * 0.5 * 100) / 100}
        />
      </View>

      {active.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currently Active</Text>
          {active.map((e) => (
            <View key={e.id} style={styles.entryCard}>
              <Text style={styles.entryName}>{e.service}</Text>
              <Text style={styles.entryDate}>
                {new Date(e.startDate).toLocaleDateString()} — {new Date(e.endDate).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, backgroundColor: '#0f172a' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  summaryRow: { flexDirection: 'row', padding: 16, gap: 8 },
  summaryCard: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  summaryNum: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  summaryLabel: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  calendarSection: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, justifyContent: 'center' },
  costSection: { padding: 16 },
  section: { padding: 16 },
  entryCard: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  entryName: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  entryDate: { fontSize: 13, color: '#64748b', marginTop: 4 },
});
