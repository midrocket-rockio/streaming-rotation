import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { ViewingHistory } from '@/types/rotation';

const STORAGE = new MMKV();
const VIEWING_KEY = 'viewing_history';

interface ViewingState {
  entries: ViewingHistory[];
  addEntry: (entry: Omit<ViewingHistory, 'id' | 'watchedAt' | 'isFavorite'>) => void;
  removeEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateEntry: (id: string, updates: Partial<ViewingHistory>) => void;
  getFavorites: () => ViewingHistory[];
  getByService: (serviceId: string) => ViewingHistory[];
  getByType: (type: ViewingHistory['type']) => ViewingHistory[];
  getByMonth: (year: number, month: number) => ViewingHistory[];
  getAverageRating: (serviceId?: string) => number;
  getTotalWatched: () => number;
  getGenreDistribution: () => Record<string, number>;
  clearAll: () => void;
  getStats: () => {
    total: number;
    favorites: number;
    averageRating: number;
    byService: Record<string, number>;
    byType: Record<string, number>;
  };
}

function loadViewing(): ViewingHistory[] {
  const raw = STORAGE.getString(VIEWING_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as ViewingHistory[];
  } catch {
    return [];
  }
}

function saveViewing(entries: ViewingHistory[]): void {
  STORAGE.set(VIEWING_KEY, JSON.stringify(entries));
}

export const useViewingStore = create<ViewingState>((set, get) => ({
  entries: loadViewing(),

  addEntry: (entry) => {
    const newEntry: ViewingHistory = {
      ...entry,
      id: `view-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      watchedAt: new Date().toISOString(),
      isFavorite: false,
    };
    const updated = [newEntry, ...get().entries];
    saveViewing(updated);
    set({ entries: updated });
  },

  removeEntry: (id) => {
    const updated = get().entries.filter((e) => e.id !== id);
    saveViewing(updated);
    set({ entries: updated });
  },

  toggleFavorite: (id) => {
    const updated = get().entries.map((e) =>
      e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
    );
    saveViewing(updated);
    set({ entries: updated });
  },

  updateEntry: (id, updates) => {
    const updated = get().entries.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    saveViewing(updated);
    set({ entries: updated });
  },

  getFavorites: () => get().entries.filter((e) => e.isFavorite),

  getByService: (serviceId) =>
    get().entries.filter((e) => e.serviceId === serviceId),

  getByType: (type) => get().entries.filter((e) => e.type === type),

  getByMonth: (year, month) =>
    get().entries.filter((e) => {
      const d = new Date(e.watchedAt);
      return d.getFullYear() === year && d.getMonth() === month;
    }),

  getAverageRating: (serviceId) => {
    const entries = serviceId
      ? get().entries.filter((e) => e.serviceId === serviceId)
      : get().entries;
    if (entries.length === 0) return 0;
    const sum = entries.reduce((s, e) => s + e.rating, 0);
    return Math.round((sum / entries.length) * 100) / 100;
  },

  getTotalWatched: () => get().entries.length,

  getGenreDistribution: () => {
    const map: Record<string, number> = {};
    for (const e of get().entries) {
      map[e.genre] = (map[e.genre] || 0) + 1;
    }
    return map;
  },

  clearAll: () => {
    STORAGE.delete(VIEWING_KEY);
    set({ entries: [] });
  },

  getStats: () => {
    const entries = get().entries;
    const favorites = entries.filter((e) => e.isFavorite).length;
    const avgRating =
      entries.length > 0
        ? Math.round(
            (entries.reduce((s, e) => s + e.rating, 0) / entries.length) * 100
          ) / 100
        : 0;
    const byService: Record<string, number> = {};
    const byType: Record<string, number> = {};
    for (const e of entries) {
      byService[e.serviceName] = (byService[e.serviceName] || 0) + 1;
      byType[e.type] = (byType[e.type] || 0) + 1;
    }
    return {
      total: entries.length,
      favorites,
      averageRating: avgRating,
      byService,
      byType,
    };
  },
}));
