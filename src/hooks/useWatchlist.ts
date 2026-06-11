import { useState, useCallback } from 'react';
import { useWatchlistStore } from '../services/watchlistService';

export const useWatchlist = () => {
  const items = useWatchlistStore((s) => s.items);
  const addItem = useWatchlistStore((s) => s.addItem);
  const toggleWatched = useWatchlistStore((s) => s.toggleWatched);
  const removeItem = useWatchlistStore((s) => s.removeItem);
  const clearAll = useWatchlistStore((s) => s.clearAll);
  const stats = useWatchlistStore((s) => s.getStats());

  return {
    items,
    stats,
    addItem,
    toggleWatched,
    removeItem,
    clearAll,
  };
};
