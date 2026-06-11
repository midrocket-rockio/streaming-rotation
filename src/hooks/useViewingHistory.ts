import { useCallback, useMemo } from 'react';
import { useViewingStore } from '@/services/viewingService';
import type { ViewingHistory } from '@/types/rotation';

/**
 * Hook providing viewing history management and analytics.
 */
export function useViewingHistory() {
  const entries = useViewingStore((s) => s.entries);
  const addEntry = useViewingStore((s) => s.addEntry);
  const removeEntry = useViewingStore((s) => s.removeEntry);
  const toggleFavorite = useViewingStore((s) => s.toggleFavorite);
  const updateEntry = useViewingStore((s) => s.updateEntry);
  const getStats = useViewingStore((s) => s.getStats);
  const getAverageRating = useViewingStore((s) => s.getAverageRating);
  const getGenreDistribution = useViewingStore((s) => s.getGenreDistribution);
  const clearAll = useViewingStore((s) => s.clearAll);

  const stats = useMemo(() => getStats(), [getStats]);
  const genreDistribution = useMemo(
    () => getGenreDistribution(),
    [getGenreDistribution]
  );

  const favorites = useMemo(
    () => entries.filter((e) => e.isFavorite),
    [entries]
  );

  const recentEntries = useMemo(
    () => entries.slice(0, 20),
    [entries]
  );

  const entriesByService = useMemo(() => {
    const map: Record<string, ViewingHistory[]> = {};
    for (const entry of entries) {
      if (!map[entry.serviceId]) map[entry.serviceId] = [];
      map[entry.serviceId].push(entry);
    }
    return map;
  }, [entries]);

  const entriesByType = useMemo(() => {
    const map: Record<string, ViewingHistory[]> = {};
    for (const entry of entries) {
      if (!map[entry.type]) map[entry.type] = [];
      map[entry.type].push(entry);
    }
    return map;
  }, [entries]);

  const addViewingEntry = useCallback(
    (entry: Omit<ViewingHistory, 'id' | 'watchedAt' | 'isFavorite'>) => {
      addEntry(entry);
    },
    [addEntry]
  );

  const removeViewingEntry = useCallback(
    (id: string) => {
      removeEntry(id);
    },
    [removeEntry]
  );

  const toggleEntryFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
    },
    [toggleFavorite]
  );

  const updateViewingEntry = useCallback(
    (id: string, updates: Partial<ViewingHistory>) => {
      updateEntry(id, updates);
    },
    [updateEntry]
  );

  const getMonthEntries = useCallback(
    (year: number, month: number) => {
      return useViewingStore.getState().getByMonth(year, month);
    },
    []
  );

  const ratingByService = useCallback(
    (serviceId: string) => {
      return getAverageRating(serviceId);
    },
    [getAverageRating]
  );

  const topRated = useMemo(() => {
    return [...entries]
      .filter((e) => e.rating >= 4)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, [entries]);

  const genrePercentages = useMemo(() => {
    const total = entries.length;
    if (total === 0) return {};
    const result: Record<string, number> = {};
    for (const [genre, count] of Object.entries(genreDistribution)) {
      result[genre] = Math.round((count / total) * 100);
    }
    return result;
  }, [entries.length, genreDistribution]);

  return {
    // Data
    entries,
    recentEntries,
    favorites,
    topRated,
    entriesByService,
    entriesByType,
    stats,
    genreDistribution,
    genrePercentages,

    // Actions
    addEntry: addViewingEntry,
    removeEntry: removeViewingEntry,
    toggleFavorite: toggleEntryFavorite,
    updateEntry: updateViewingEntry,
    clearAll,

    // Derived
    getMonthEntries,
    getRatingByService: ratingByService,
  };
}
