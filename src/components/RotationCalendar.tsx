import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { generateRotationSchedule, getMonthLabel } from '@/services/calculatorService';
import { useRotationStore } from '@/stores/rotationStore';

export default function RotationCalendar() {
  const services = useRotationStore((s) => s.services);
  const schedule = generateRotationSchedule(services);
  const now = new Date();
  const currentMonth = now.getMonth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Calendario de Rotación</Text>
      <Text style={styles.subtitle}>Tu plan de 12 meses</Text>

      <View style={styles.grid}>
        {schedule.map(({ month, label, service }) => {
          const isCurrent = month === currentMonth;
          return (
            <View
              key={month}
              style={[
                styles.monthCell,
                isCurrent && styles.monthCellActive,
                !service && styles.monthCellEmpty,
              ]}
            >
              <Text style={[styles.monthLabel, isCurrent && styles.monthLabelActive]}>
                {label.slice(0, 3)}
              </Text>
              {service ? (
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                  <Text
                    style={[
                      styles.serviceName,
                      isCurrent && styles.serviceNameActive,
                    ]}
                    numberOfLines={1}
                  >
                    {service.name}
                  </Text>
                </View>
              ) : (
                <Text style={styles.emptyText}>Sin servicio</Text>
              )}
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Ahora</Text>
                </View>
              )}
            </View>
          );
        })}
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
  },
  subtitle: {
    color: '#888888',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthCell: {
    width: '30%',
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 10,
    minHeight: 90,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  monthCellActive: {
    borderColor: '#4ADE80',
    backgroundColor: '#0d2818',
  },
  monthCellEmpty: {
    opacity: 0.5,
  },
  monthLabel: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '600',
  },
  monthLabelActive: {
    color: '#4ADE80',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  serviceIcon: {
    fontSize: 14,
  },
  serviceName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  serviceNameActive: {
    color: '#4ADE80',
  },
  emptyText: {
    color: '#555555',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  currentBadge: {
    alignSelf: 'center',
    backgroundColor: '#4ADE80',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  currentBadgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '700',
  },
});
