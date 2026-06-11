import { create } from 'zustand';
import { storage } from './storage';
import { RotationSchedule } from '../types/rotation';

const SCHEDULE_KEY = 'rotation_schedule';

interface ScheduleState {
  entries: RotationSchedule[];
  addEntry: (entry: Omit<RotationSchedule, 'id'>) => void;
  toggleActive: (id: string) => void;
  removeEntry: (id: string) => void;
  getUpcoming: () => RotationSchedule[];
  getActive: () => RotationSchedule[];
  getCompleted: () => RotationSchedule[];
  getMonthEntries: (year: number, month: number) => RotationSchedule[];
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  entries: (() => {
    const data = storage.getString(SCHEDULE_KEY);
    return data ? JSON.parse(data) : [];
  })(),

  addEntry: (entry) => {
    const newEntry: RotationSchedule = {
      ...entry,
      id: `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const entries = [...get().entries, newEntry];
    storage.set(SCHEDULE_KEY, JSON.stringify(entries));
    set({ entries });
  },

  toggleActive: (id) => {
    const entries = get().entries.map((e) =>
      e.id === id ? { ...e, isActive: !e.isActive } : e
    );
    storage.set(SCHEDULE_KEY, JSON.stringify(entries));
    set({ entries });
  },

  removeEntry: (id) => {
    const entries = get().entries.filter((e) => e.id !== id);
    storage.set(SCHEDULE_KEY, JSON.stringify(entries));
    set({ entries });
  },

  getUpcoming: () => get().entries.filter((e) => !e.isActive && new Date(e.startDate) > new Date()),
  getActive: () => get().entries.filter((e) => e.isActive),
  getCompleted: () => get().entries.filter((e) => !e.isActive && new Date(e.endDate) < new Date()),

  getMonthEntries: (year, month) =>
    get().entries.filter((e) => {
      const d = new Date(e.startDate);
      return d.getFullYear() === year && d.getMonth() === month - 1;
    }),
}));
