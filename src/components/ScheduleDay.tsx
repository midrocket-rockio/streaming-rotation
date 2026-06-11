import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScheduleDayProps {
  day: number;
  hasEntry: boolean;
  isToday: boolean;
  isActive: boolean;
  isCompleted: boolean;
}

export const ScheduleDay: React.FC<ScheduleDayProps> = ({ day, hasEntry, isToday, isActive, isCompleted }) => (
  <View style={[
    styles.day,
    isToday && styles.today,
    isActive && styles.active,
    isCompleted && styles.completed,
  ]}>
    <Text style={styles.dayText}>{day}</Text>
    {hasEntry && (
      <View style={styles.entryDot}>
        {isActive ? (
          <Text style={styles.activeDot}>🔴</Text>
        ) : isCompleted ? (
          <Text style={styles.completedDot}>✅</Text>
        ) : (
          <View style={styles.dot} />
        )}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  day: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dayText: { fontSize: 14, fontWeight: '600', color: '#334155' },
  today: { backgroundColor: '#dbeafe', borderColor: '#3b82f6' },
  active: { backgroundColor: '#fef2f2', borderColor: '#ef4444' },
  completed: { backgroundColor: '#f0fdf4', borderColor: '#10b981' },
  entryDot: { position: 'absolute', top: 2, right: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3b82f6' },
  activeDot: { fontSize: 10 },
  completedDot: { fontSize: 10 },
});
