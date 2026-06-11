// ─── Calendar View Hook ─────────────────────────────────────────

import { useMemo } from 'react';
import type { CalendarEvent } from '@/types';

export function useCalendarView(events: CalendarEvent[]) {
  return useMemo(() => {
    // Group events by date
    const byDate: Record<string, CalendarEvent[]> = {};
    for (const event of events) {
      if (!byDate[event.date]) byDate[event.date] = [];
      byDate[event.date].push(event);
    }

    // Get current month info
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0=Sunday

    // Generate calendar grid
    const days: { date: string; day: number; events: CalendarEvent[]; isCurrentMonth: boolean }[] = [];

    // Previous month padding
    const prevMonth = new Date(year, month, 0);
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonth.getDate() - i;
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: dateStr, day: d, events: byDate[dateStr] || [], isCurrentMonth: false });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: dateStr, day: d, events: byDate[dateStr] || [], isCurrentMonth: true });
    }

    // Next month padding
    const remaining = 42 - days.length; // 6 rows x 7 days
    const nextMonth = month + 1 > 11 ? 0 : month + 1;
    const nextYear = month + 1 > 11 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: dateStr, day: d, events: byDate[dateStr] || [], isCurrentMonth: false });
    }

    // Event type counts
    const typeCounts = { watch: 0, rotate: 0, reminder: 0, milestone: 0 };
    for (const event of events) {
      typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
    }

    // Upcoming events
    const upcoming = events
      .filter((e) => !e.isCompleted)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);

    return {
      days,
      year,
      month,
      typeCounts,
      upcoming,
      totalEvents: events.length,
      completedEvents: events.filter((e) => e.isCompleted).length,
    };
  }, [events]);
}

// ─── Date Utility Helpers ───────────────────────────────────────

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getWeekDates(): string[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

export function isPast(dateStr: string): boolean {
  return dateStr < new Date().toISOString().split('T')[0];
}
