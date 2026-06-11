import { useState, useCallback } from 'react';
import { useScheduleStore } from '../services/scheduleService';

export const useSchedule = () => {
  const entries = useScheduleStore((s) => s.entries);
  const addEntry = useScheduleStore((s) => s.addEntry);
  const toggleActive = useScheduleStore((s) => s.toggleActive);
  const removeEntry = useScheduleStore((s) => s.removeEntry);
  const upcoming = useScheduleStore((s) => s.getUpcoming());
  const active = useScheduleStore((s) => s.getActive());
  const completed = useScheduleStore((s) => s.getCompleted());

  return {
    entries,
    upcoming,
    active,
    completed,
    addEntry,
    toggleActive,
    removeEntry,
  };
};
