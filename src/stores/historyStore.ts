import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { Service } from '@/types';

const STORAGE = new MMKV();
const HISTORY_KEY = 'rotation_history';

export interface RotationHistoryEntry {
  id: string;
  date: string;
  serviceName: string;
  serviceId: string;
  monthlyPrice: number;
  category: string;
  icon: string;
  notes?: string;
}

export interface HistoryState {
  entries: RotationHistoryEntry[];
  addEntry: (entry: Omit<RotationHistoryEntry, 'id' | 'date'>) => void;
  removeEntry: (id: string) => void;
  updateEntryNotes: (id: string, notes: string) => void;
  getEntriesByMonth: (year: number, month: number) => RotationHistoryEntry[];
  getMonthlySpending: (year: number, month: number) => number;
  getTotalSpent: () => number;
  getSpendingByService: () => Record<string, { count: number; total: number }>;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: loadHistory(),

  addEntry: (entry) => {
    const newEntry: RotationHistoryEntry = {
      ...entry,
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
    };
    const updated = [newEntry, ...get().entries];
    saveHistory(updated);
    set({ entries: updated });
  },

  removeEntry: (id) => {
    const updated = get().entries.filter((e) => e.id !== id);
    saveHistory(updated);
    set({ entries: updated });
  },

  updateEntryNotes: (id, notes) => {
    const updated = get().entries.map((e) =>
      e.id === id ? { ...e, notes } : e
    );
    saveHistory(updated);
    set({ entries: updated });
  },

  getEntriesByMonth: (year, month) => {
    return get().entries.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  },

  getMonthlySpending: (year, month) => {
    return getMonthlySpendingFor(get().entries, year, month);
  },

  getTotalSpent: () => {
    return get().entries.reduce((sum, e) => sum + e.monthlyPrice, 0);
  },

  getSpendingByService: () => {
    const map: Record<string, { count: number; total: number }> = {};
    for (const e of get().entries) {
      if (!map[e.serviceId]) {
        map[e.serviceId] = { count: 0, total: 0 };
      }
      map[e.serviceId].count++;
      map[e.serviceId].total += e.monthlyPrice;
    }
    return map;
  },

  clearHistory: () => {
    STORAGE.delete(HISTORY_KEY);
    set({ entries: [] });
  },
}));

function loadHistory(): RotationHistoryEntry[] {
  const raw = STORAGE.getString(HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RotationHistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: RotationHistoryEntry[]): void {
  STORAGE.set(HISTORY_KEY, JSON.stringify(entries));
}

function getMonthlySpendingFor(
  entries: RotationHistoryEntry[],
  year: number,
  month: number
): number {
  return entries
    .filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, e) => sum + e.monthlyPrice, 0);
}
