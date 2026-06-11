import { create } from 'zustand';
import { storage } from './storage';
import { WatchlistItem } from '../types/rotation';

const WATCHLIST_KEY = 'watchlist';

interface WatchlistState {
  items: WatchlistItem[];
  addItem: (item: Omit<WatchlistItem, 'id' | 'dateAdded'>) => void;
  toggleWatched: (id: string) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  getUnwatched: () => WatchlistItem[];
  getWatched: () => WatchlistItem[];
  getByService: (service: string) => WatchlistItem[];
  getStats: () => { total: number; watched: number; unwatched: number; progress: number };
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: (() => {
    const data = storage.getString(WATCHLIST_KEY);
    return data ? JSON.parse(data) : [];
  })(),

  addItem: (item) => {
    const newItem: WatchlistItem = {
      ...item,
      id: `wl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: Date.now(),
    };
    const items = [...get().items, newItem];
    storage.set(WATCHLIST_KEY, JSON.stringify(items));
    set({ items });
  },

  toggleWatched: (id) => {
    const items = get().items.map((i) =>
      i.id === id ? { ...i, watched: !i.watched } : i
    );
    storage.set(WATCHLIST_KEY, JSON.stringify(items));
    set({ items });
  },

  removeItem: (id) => {
    const items = get().items.filter((i) => i.id !== id);
    storage.set(WATCHLIST_KEY, JSON.stringify(items));
    set({ items });
  },

  clearAll: () => {
    storage.delete(WATCHLIST_KEY);
    set({ items: [] });
  },

  getUnwatched: () => get().items.filter((i) => !i.watched),
  getWatched: () => get().items.filter((i) => i.watched),

  getByService: (service) => get().items.filter((i) => i.service === service),

  getStats: () => {
    const items = get().items;
    const watched = items.filter((i) => i.watched).length;
    return {
      total: items.length,
      watched,
      unwatched: items.length - watched,
      progress: items.length > 0 ? Math.round((watched / items.length) * 100) : 0,
    };
  },
}));
