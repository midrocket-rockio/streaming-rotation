// ─── Streaming Utility Functions ─────────────────────────────────

import type { WatchEntry, ContentLibraryItem, ViewingStats } from '@/types';

// ─── Date Formatting ────────────────────────────────────────────

export function formatWatchDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// ─── Genre Utilities ────────────────────────────────────────────

export function getGenreColor(genre: string): string {
  const colors: Record<string, string> = {
    'Sci-Fi': '#06B6D4',
    'Drama': '#8B5CF6',
    'Comedy': '#FBBF24',
    'Action': '#EF4444',
    'Thriller': '#6B7280',
    'Fantasy': '#A855F7',
    'Crime': '#EC4899',
    'Animation': '#F97316',
    'Documentary': '#10B981',
    'Horror': '#DC2626',
    'Romance': '#F472B6',
    'Mystery': '#6366F1',
    'Sports': '#22C55E',
    'Family': '#EAB308',
    'Musical': '#A855F7',
    'Western': '#D97706',
    'History': '#78716C',
    'Foreign': '#0EA5E9',
    'Superhero': '#DC2626',
    'Adventure': '#F97316',
  };
  return colors[genre] || '#6B7280';
}

// ─── Stats Helpers ──────────────────────────────────────────────

export function calculateStreak(history: WatchEntry[]): { current: number; longest: number } {
  const dates = [...new Set(history.map((e) => new Date(e.watchedAt).toDateString()))];
  dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (dates.length === 0) return { current: 0, longest: 0 };

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (dates[0] !== today && dates[0] !== yesterday) return { current: 0, longest: 0 };

  let currentStreak = 1;
  let longestStreak = 1;
  let streak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;

    if (diff === 1) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else if (diff > 1) {
      streak = 1;
    }
  }

  return { current: streak, longest: longestStreak };
}

export function getMonthlyBreakdown(history: WatchEntry[]): { month: string; count: number }[] {
  const months: Record<string, number> = {};
  for (const entry of history) {
    const d = new Date(entry.watchedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = (months[key] || 0) + 1;
  }
  return Object.entries(months)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12);
}

// ─── Service Helpers ────────────────────────────────────────────

export function getServiceIcon(serviceId: string): string {
  const icons: Record<string, string> = {
    netflix: '🎬',
    disney: '🏰',
    hbo: '🎭',
    spotify: '🎵',
    prime: '📦',
    apple: '🍎',
    max: '✨',
    paramount: '⛰️',
  };
  return icons[serviceId] || '📺';
}

export function getServiceColor(serviceId: string): string {
  const colors: Record<string, string> = {
    netflix: '#E50914',
    disney: '#0063E5',
    hbo: '#B535F6',
    spotify: '#1DB954',
    prime: '#00A8E1',
    apple: '#555555',
    max: '#4F46E5',
    paramount: '#0064FF',
  };
  return colors[serviceId] || '#666666';
}

// ─── Cost Calculations ──────────────────────────────────────────

export function calculateCostPerShow(
  monthlyCost: number,
  durationMinutes: number
): number {
  if (durationMinutes === 0) return Infinity;
  const hours = durationMinutes / 60;
  return monthlyCost / hours;
}

export function formatCost(cost: number): string {
  if (cost === Infinity) return 'N/A';
  if (cost < 0.01) return '<$0.01';
  return `$${cost.toFixed(2)}`;
}
