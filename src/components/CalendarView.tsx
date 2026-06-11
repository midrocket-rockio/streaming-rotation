// ─── Calendar View Component ────────────────────────────────────

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useWatchStore } from '@/stores/watchStore';
import { useCalendarView, formatDate, isToday, isPast } from '@/hooks/useCalendarView';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView() {
  const calendarEvents = useWatchStore((s) => s.calendarEvents);
  const addEvent = useWatchStore((s) => s.addEvent);
  const updateEvent = useWatchStore((s) => s.updateEvent);

  const calendar = useCalendarView(calendarEvents);

  const typeColors: Record<string, string> = {
    watch: '#4ADE80',
    rotate: '#FBBF24',
    reminder: '#F87171',
    milestone: '#A78BFA',
  };

  const typeIcons: Record<string, string> = {
    watch: '📺',
    rotate: '🔄',
    reminder: '⏰',
    milestone: '🏆',
  };

  const renderDay = ({ item }: { item: typeof calendar.days[0] }) => {
    const hasEvents = item.events.length > 0;
    const today = isToday(item.date);
    const past = isPast(item.date);

    return (
      <TouchableOpacity
        style={[
          styles.dayCell,
          !item.isCurrentMonth && styles.dayCellOtherMonth,
          today && styles.dayCellToday,
          past && styles.dayCellPast,
        ]}
        onPress={() => {
          if (item.events.length > 0) {
            // Could navigate to day detail
          }
        }}
      >
        <Text style={[
          styles.dayNumber,
          !item.isCurrentMonth && styles.dayNumberOtherMonth,
          today && styles.dayNumberToday,
        ]}>
          {item.day}
        </Text>
        {hasEvents && (
          <View style={styles.eventDots}>
            {item.events.slice(0, 3).map((ev, i) => (
              <View
                key={i}
                style={[styles.eventDot, { backgroundColor: typeColors[ev.type] }]}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderUpcomingEvent = ({ item }: { item: typeof calendar.upcoming[0] }) => (
    <View style={[styles.eventCard, { borderLeftColor: typeColors[item.type] }]}>
      <Text style={styles.eventIcon}>{typeIcons[item.type]}</Text>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{formatDate(item.date)}</Text>
        {item.description && <Text style={styles.eventDesc}>{item.description}</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.monthHeader}>
        <Text style={styles.monthTitle}>
          {new Date(calendar.year, calendar.month).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>

      {/* Day of Week Headers */}
      <View style={styles.dowRow}>
        {DAYS_OF_WEEK.map((d) => (
          <Text key={d} style={styles.dowText}>{d}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <FlatList
        data={calendar.days}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderDay}
        numColumns={7}
        keyExtractor={(item, index) => `day-${index}`}
        contentContainerStyle={styles.calendarGrid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={null}
      />

      {/* Upcoming Events */}
      <Text style={styles.sectionTitle}>Upcoming</Text>
      {calendar.upcoming.length > 0 ? (
        <FlatList
          data={calendar.upcoming}
          keyExtractor={(item) => item.id}
          renderItem={renderUpcomingEvent}
          contentContainerStyle={styles.eventList}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyEvents}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No events this week</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  monthHeader: {
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  dowRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dowText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  calendarGrid: {
    gap: 2,
    marginBottom: 20,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#1a1a2e',
  },
  dayCellToday: {
    backgroundColor: '#3B82F6',
  },
  dayCellOtherMonth: {
    opacity: 0.3,
  },
  dayCellPast: {
    opacity: 0.6,
  },
  dayNumber: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  dayNumberOtherMonth: {
    color: '#666',
  },
  dayNumberToday: {
    fontWeight: 'bold',
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    position: 'absolute',
    bottom: 3,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  eventList: {
    gap: 8,
    paddingBottom: 16,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
  },
  eventIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  eventDate: {
    fontSize: 12,
    color: '#888',
  },
  eventDesc: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  emptyEvents: {
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
});
