// ─── Cost Per Show Hook ─────────────────────────────────────────

import { useMemo } from 'react';
import type { WatchEntry, CostPerShow } from '@/types';

export function useCostPerShow(
  watchHistory: WatchEntry[],
  monthlyCost: number,
  totalServices: number
): CostPerShow[] {
  return useMemo(() => {
    if (totalServices === 0 || monthlyCost === 0) return [];

    // Calculate cost per show based on monthly subscription cost
    const costPerShow = monthlyCost / Math.max(watchHistory.length, 1);

    return watchHistory.map((entry) => {
      const hoursWatched = (entry.duration || 0) / 60;
      const cph = hoursWatched > 0 ? costPerShow / hoursWatched : 0;

      return {
        id: entry.id,
        title: entry.title,
        service: entry.service,
        monthlyCost,
        hoursWatched: Math.round(hoursWatched * 100) / 100,
        costPerHour: Math.round(cph * 100) / 100,
        rating: entry.rating,
        watchedAt: entry.watchedAt,
      };
    }).sort((a, b) => a.costPerHour - b.costPerHour);
  }, [watchHistory, monthlyCost, totalServices]);
}

export function useCostSummary(
  watchHistory: WatchEntry[],
  monthlyCost: number
): {
  totalCost: number;
  totalHours: number;
  avgCostPerHour: number;
  bestValueShow: CostPerShow | null;
  worstValueShow: CostPerShow | null;
} {
  return useMemo(() => {
    const totalCost = monthlyCost;
    const totalHours = watchHistory.reduce((sum, e) => sum + (e.duration || 0), 0) / 60;
    const avgCostPerHour = totalHours > 0 ? totalCost / totalHours : 0;

    const costPerShows = watchHistory.map((e) => ({
      entry: e,
      cph: (e.duration || 0) > 0 ? monthlyCost / ((e.duration || 0) / 60) : Infinity,
    }));

    const best = costPerShows.reduce(
      (best, c) => (c.cph < best.cph ? c : best),
      { entry: watchHistory[0], cph: Infinity }
    );

    const worst = costPerShows.reduce(
      (worst, c) => (c.cph > worst.cph ? c : worst),
      { entry: watchHistory[0], cph: -Infinity }
    );

    return {
      totalCost,
      totalHours: Math.round(totalHours * 100) / 100,
      avgCostPerHour: Math.round(avgCostPerHour * 100) / 100,
      bestValueShow: best.entry
        ? {
            id: best.entry.id,
            title: best.entry.title,
            service: best.entry.service,
            monthlyCost,
            hoursWatched: Math.round(((best.entry.duration || 0) / 60) * 100) / 100,
            costPerHour: Math.round(best.cph * 100) / 100,
            rating: best.entry.rating,
            watchedAt: best.entry.watchedAt,
          }
        : null,
      worstValueShow: worst.entry
        ? {
            id: worst.entry.id,
            title: worst.entry.title,
            service: worst.entry.service,
            monthlyCost,
            hoursWatched: Math.round(((worst.entry.duration || 0) / 60) * 100) / 100,
            costPerHour: Math.round(worst.cph * 100) / 100,
            rating: worst.entry.rating,
            watchedAt: worst.entry.watchedAt,
          }
        : null,
    };
  }, [watchHistory, monthlyCost]);
}
