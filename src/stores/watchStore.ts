// ─── Watch State Store ──────────────────────────────────────────

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type {
  WatchEntry,
  ContentLibraryItem,
  WatchParty,
  CalendarEvent,
  ViewingStats,
} from '@/types';

const STORAGE = new MMKV();

const WATCH_ENTRIES_KEY = 'watch_entries';
const LIBRARY_KEY = 'content_library';
const WATCH_PARTIES_KEY = 'watch_parties';
const CALENDAR_KEY = 'calendar_events';
const STATS_KEY = 'viewing_stats';

function load<T>(key: string, fallback: T): T {
  const raw = STORAGE.getString(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  STORAGE.set(key, JSON.stringify(value));
}

interface WatchStore {
  // Watch History
  watchHistory: WatchEntry[];
  addEntry: (entry: Omit<WatchEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<WatchEntry>) => void;
  removeEntry: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getHistoryByService: (serviceId: string) => WatchEntry[];
  getHistoryByGenre: (genre: string) => WatchEntry[];
  getRecentEntries: (limit: number) => WatchEntry[];

  // Content Library
  library: ContentLibraryItem[];
  addItem: (item: Omit<ContentLibraryItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<ContentLibraryItem>) => void;
  removeItem: (id: string) => void;
  getItemsByStatus: (status: ContentLibraryItem['status']) => ContentLibraryItem[];
  searchLibrary: (query: string) => ContentLibraryItem[];

  // Watch Parties
  parties: WatchParty[];
  createParty: (party: Omit<WatchParty, 'id' | 'attendees' | 'status'>) => void;
  updateParty: (id: string, updates: Partial<WatchParty>) => void;
  removeParty: (id: string) => void;
  addAttendee: (partyId: string, attendee: Omit<WatchParty['attendees'][0], 'joinedAt'>) => void;
  getUpcomingParties: () => WatchParty[];

  // Calendar
  calendarEvents: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  getEventsForDate: (date: string) => CalendarEvent[];
  getEventsThisWeek: () => CalendarEvent[];

  // Stats
  stats: ViewingStats;
  recalculateStats: () => ViewingStats;

  // Reset
  resetAll: () => void;
}

export const useWatchStore = create<WatchStore>((set, get) => ({
  watchHistory: load<WatchEntry[]>(WATCH_ENTRIES_KEY, []),
  library: load<ContentLibraryItem[]>(LIBRARY_KEY, []),
  parties: load<WatchParty[]>(WATCH_PARTIES_KEY, []),
  calendarEvents: load<CalendarEvent[]>(CALENDAR_KEY, []),
  stats: load<ViewingStats>(STATS_KEY, {
    totalShowsWatched: 0,
    totalMoviesWatched: 0,
    totalHoursWatched: 0,
    avgRating: 0,
    favoriteGenre: 'N/A',
    favoriteService: 'N/A',
    currentStreak: 0,
    longestStreak: 0,
    thisMonthWatched: 0,
    thisWeekWatched: 0,
  }),

  // ── Watch History ───────────────────────────────────────────
  addEntry: (entry) => {
    const newEntry: WatchEntry = {
      ...entry,
      id: `watch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    const updated = [newEntry, ...get().watchHistory];
    save(WATCH_ENTRIES_KEY, updated);
    set({ watchHistory: updated });
    get().recalculateStats();
  },

  updateEntry: (id, updates) => {
    const updated = get().watchHistory.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    save(WATCH_ENTRIES_KEY, updated);
    set({ watchHistory: updated });
  },

  removeEntry: (id) => {
    const updated = get().watchHistory.filter((e) => e.id !== id);
    save(WATCH_ENTRIES_KEY, updated);
    set({ watchHistory: updated });
    get().recalculateStats();
  },

  toggleFavorite: (id) => {
    const updated = get().watchHistory.map((e) =>
      e.id === id ? { ...e, favorite: !e.favorite } : e
    );
    save(WATCH_ENTRIES_KEY, updated);
    set({ watchHistory: updated });
  },

  getHistoryByService: (serviceId) =>
    get().watchHistory.filter((e) => e.serviceId === serviceId),

  getHistoryByGenre: (genre) =>
    get().watchHistory.filter((e) => e.genre === genre),

  getRecentEntries: (limit) =>
    get().watchHistory.slice(0, limit),

  // ── Content Library ─────────────────────────────────────────
  addItem: (item) => {
    const newItem: ContentLibraryItem = {
      ...item,
      id: `lib-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    const updated = [...get().library, newItem];
    save(LIBRARY_KEY, updated);
    set({ library: updated });
  },

  updateItem: (id, updates) => {
    const updated = get().library.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    save(LIBRARY_KEY, updated);
    set({ library: updated });
  },

  removeItem: (id) => {
    const updated = get().library.filter((item) => item.id !== id);
    save(LIBRARY_KEY, updated);
    set({ library: updated });
  },

  getItemsByStatus: (status) =>
    get().library.filter((item) => item.status === status),

  searchLibrary: (query) => {
    const q = query.toLowerCase();
    return get().library.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
  },

  // ── Watch Parties ───────────────────────────────────────────
  createParty: (party) => {
    const newParty: WatchParty = {
      ...party,
      id: `party-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      attendees: [],
      status: 'planned',
    };
    const updated = [...get().parties, newParty];
    save(WATCH_PARTIES_KEY, updated);
    set({ parties: updated });
  },

  updateParty: (id, updates) => {
    const updated = get().parties.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    save(WATCH_PARTIES_KEY, updated);
    set({ parties: updated });
  },

  removeParty: (id) => {
    const updated = get().parties.filter((p) => p.id !== id);
    save(WATCH_PARTIES_KEY, updated);
    set({ parties: updated });
  },

  addAttendee: (partyId, attendee) => {
    const updated = get().parties.map((p) =>
      p.id === partyId
        ? {
            ...p,
            attendees: [
              ...p.attendees,
              { ...attendee, joinedAt: Date.now() },
            ],
          }
        : p
    );
    save(WATCH_PARTIES_KEY, updated);
    set({ parties: updated });
  },

  getUpcomingParties: () =>
    get().parties
      .filter((p) => p.status === 'planned' && p.scheduledAt > Date.now())
      .sort((a, b) => a.scheduledAt - b.scheduledAt),

  // ── Calendar ────────────────────────────────────────────────
  addEvent: (event) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `cal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    const updated = [...get().calendarEvents, newEvent];
    save(CALENDAR_KEY, updated);
    set({ calendarEvents: updated });
  },

  updateEvent: (id, updates) => {
    const updated = get().calendarEvents.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    save(CALENDAR_KEY, updated);
    set({ calendarEvents: updated });
  },

  removeEvent: (id) => {
    const updated = get().calendarEvents.filter((e) => e.id !== id);
    save(CALENDAR_KEY, updated);
    set({ calendarEvents: updated });
  },

  getEventsForDate: (date) =>
    get().calendarEvents.filter((e) => e.date === date),

  getEventsThisWeek: () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return get().calendarEvents.filter((e) => {
      const d = new Date(e.date);
      return d >= startOfWeek && d <= endOfWeek;
    });
  },

  // ── Stats ───────────────────────────────────────────────────
  recalculateStats: (): ViewingStats => {
    const history = get().watchHistory;
    const library = get().library;

    const shows = history.filter((e) => e.type === 'series');
    const movies = history.filter((e) => e.type === 'movie');

    const totalHours = history.reduce(
      (sum, e) => sum + (e.duration || 0),
      0
    );

    const avgRating =
      history.length > 0
        ? history.reduce((sum, e) => sum + e.rating, 0) / history.length
        : 0;

    // Favorite genre
    const genreCounts: Record<string, number> = {};
    for (const e of history) {
      if (e.genre) genreCounts[e.genre] = (genreCounts[e.genre] || 0) + 1;
    }
    const favGenre =
      Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Favorite service
    const serviceCounts: Record<string, number> = {};
    for (const e of history) {
      serviceCounts[e.service] = (serviceCounts[e.service] || 0) + 1;
    }
    const favService =
      Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Streak calculation
    const dates = [...new Set(history.map((e) => new Date(e.watchedAt).toDateString()))];
    dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (dates.length > 0) {
      if (dates[0] === today || dates[0] === yesterday) {
        streak = 1;
        for (let i = 1; i < dates.length; i++) {
          const prev = new Date(dates[i - 1]);
          const curr = new Date(dates[i]);
          const diff = (prev.getTime() - curr.getTime()) / 86400000;
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
        currentStreak = streak;
      }
    }

    longestStreak = Math.max(currentStreak, streak);

    // This month / week
    const now = new Date();
    const thisMonth = history.filter((e) => {
      const d = new Date(e.watchedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const weekAgo = Date.now() - 7 * 86400000;
    const thisWeek = history.filter((e) => e.watchedAt >= weekAgo).length;

    const stats: ViewingStats = {
      totalShowsWatched: shows.length,
      totalMoviesWatched: movies.length,
      totalHoursWatched: Math.round(totalHours),
      avgRating: Math.round(avgRating * 10) / 10,
      favoriteGenre: favGenre,
      favoriteService: favService,
      currentStreak,
      longestStreak,
      thisMonthWatched: thisMonth,
      thisWeekWatched: thisWeek,
    };

    save(STATS_KEY, stats);
    set({ stats });
    return stats;
  },

  // ── Reset ───────────────────────────────────────────────────
  resetAll: () => {
    STORAGE.deleteAll();
    set({
      watchHistory: [],
      library: [],
      parties: [],
      calendarEvents: [],
      stats: {
        totalShowsWatched: 0,
        totalMoviesWatched: 0,
        totalHoursWatched: 0,
        avgRating: 0,
        favoriteGenre: 'N/A',
        favoriteService: 'N/A',
        currentStreak: 0,
        longestStreak: 0,
        thisMonthWatched: 0,
        thisWeekWatched: 0,
      },
    });
  },
}));
