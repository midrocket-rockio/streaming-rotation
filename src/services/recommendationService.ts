// ─── Recommendation Engine ──────────────────────────────────────

import type {
  WatchEntry,
  Recommendation,
  ContentLibraryItem,
  RecommendationEngine,
  Service,
} from '@/types';

// ─── Mock Content Database ──────────────────────────────────────

const CONTENT_DATABASE: Omit<Recommendation, 'matchScore' | 'reason' | 'id'>[] = [
  // Netflix
  { title: 'Dark', type: 'series', genre: ['Sci-Fi', 'Thriller', 'Mystery'], rating: 8.8, year: 2017, service: 'Netflix', serviceId: 'netflix' },
  { title: 'Black Mirror', type: 'series', genre: ['Sci-Fi', 'Thriller', 'Drama'], rating: 8.8, year: 2011, service: 'Netflix', serviceId: 'netflix' },
  { title: 'The Witcher', type: 'series', genre: ['Fantasy', 'Action', 'Drama'], rating: 8.2, year: 2019, service: 'Netflix', serviceId: 'netflix' },
  { title: 'Everything Sucks!', type: 'movie', genre: ['Comedy', 'Drama'], rating: 6.8, year: 2018, service: 'Netflix', serviceId: 'netflix' },
  { title: 'Roma', type: 'movie', genre: ['Drama', 'Foreign'], rating: 7.7, year: 2018, service: 'Netflix', serviceId: 'netflix' },
  // Disney+
  { title: 'WandaVision', type: 'series', genre: ['Sci-Fi', 'Comedy', 'Superhero'], rating: 8.0, year: 2021, service: 'Disney+', serviceId: 'disney' },
  { title: 'The Book of Boba Fett', type: 'series', genre: ['Sci-Fi', 'Action', 'Western'], rating: 7.3, year: 2022, service: 'Disney+', serviceId: 'disney' },
  { title: 'Loki', type: 'series', genre: ['Sci-Fi', 'Action', 'Fantasy'], rating: 8.2, year: 2021, service: 'Disney+', serviceId: 'disney' },
  { title: 'Encanto', type: 'movie', genre: ['Animation', 'Family', 'Musical'], rating: 7.2, year: 2021, service: 'Disney+', serviceId: 'disney' },
  // HBO Max
  { title: 'The Last of Us', type: 'series', genre: ['Drama', 'Action', 'Sci-Fi'], rating: 8.8, year: 2023, service: 'HBO Max', serviceId: 'hbo' },
  { title: 'House of the Dragon', type: 'series', genre: ['Fantasy', 'Drama', 'Action'], rating: 8.4, year: 2022, service: 'HBO Max', serviceId: 'hbo' },
  { title: 'The Penguin', type: 'series', genre: ['Crime', 'Drama', 'Thriller'], rating: 8.6, year: 2024, service: 'HBO Max', serviceId: 'hbo' },
  { title: 'Dune', type: 'movie', genre: ['Sci-Fi', 'Adventure', 'Drama'], rating: 8.0, year: 2021, service: 'HBO Max', serviceId: 'hbo' },
  // Prime Video
  { title: 'Fallout', type: 'series', genre: ['Sci-Fi', 'Action', 'Comedy'], rating: 8.5, year: 2024, service: 'Prime Video', serviceId: 'prime' },
  { title: 'The Boys', type: 'series', genre: ['Action', 'Comedy', 'Superhero'], rating: 8.7, year: 2019, service: 'Prime Video', serviceId: 'prime' },
  { title: 'Reacher', type: 'series', genre: ['Action', 'Thriller', 'Crime'], rating: 8.1, year: 2022, service: 'Prime Video', serviceId: 'prime' },
  { title: 'Prison Break', type: 'series', genre: ['Action', 'Thriller', 'Crime'], rating: 8.3, year: 2005, service: 'Prime Video', serviceId: 'prime' },
  // Apple TV+
  { title: 'Severance', type: 'series', genre: ['Thriller', 'Sci-Fi', 'Drama'], rating: 8.7, year: 2022, service: 'Apple TV+', serviceId: 'apple' },
  { title: 'Ted Lasso', type: 'series', genre: ['Comedy', 'Drama', 'Sports'], rating: 8.8, year: 2020, service: 'Apple TV+', serviceId: 'apple' },
  { title: 'Foundation', type: 'series', genre: ['Sci-Fi', 'Drama', 'Fantasy'], rating: 7.3, year: 2021, service: 'Apple TV+', serviceId: 'apple' },
  { title: 'Killers of the Flower Moon', type: 'movie', genre: ['Crime', 'Drama', 'History'], rating: 7.7, year: 2023, service: 'Apple TV+', serviceId: 'apple' },
  // Max
  { title: 'Succession', type: 'series', genre: ['Drama', 'Comedy'], rating: 8.9, year: 2018, service: 'Max', serviceId: 'max' },
  { title: 'The White Lotus', type: 'series', genre: ['Comedy', 'Drama', 'Mystery'], rating: 7.9, year: 2021, service: 'Max', serviceId: 'max' },
  { title: 'Hacks', type: 'series', genre: ['Comedy', 'Drama'], rating: 8.3, year: 2021, service: 'Max', serviceId: 'max' },
  // Paramount+
  { title: 'Yellowstone', type: 'series', genre: ['Drama', 'Western'], rating: 8.7, year: 2018, service: 'Paramount+', serviceId: 'paramount' },
  { title: '1923', type: 'series', genre: ['Drama', 'Western'], rating: 8.2, year: 2022, service: 'Paramount+', serviceId: 'paramount' },
  { title: 'Tulsa King', type: 'series', genre: ['Crime', 'Drama', 'Comedy'], rating: 7.5, year: 2022, service: 'Paramount+', serviceId: 'paramount' },
];

// ─── Recommendation Engine ─────────────────────────────────────

function calculateMatchScore(
  candidate: Omit<Recommendation, 'matchScore' | 'reason' | 'id'>,
  history: WatchEntry[],
  library: ContentLibraryItem[],
  services: Service[],
  engine: RecommendationEngine
): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  // Genre matching
  const userGenres: Record<string, number> = {};
  for (const entry of history) {
    const genre = entry.genre || 'Unknown';
    userGenres[genre] = (userGenres[genre] || 0) + 1;
  }
  for (const item of library) {
    for (const tag of item.tags) {
      userGenres[tag] = (userGenres[tag] || 0) + 0.5;
    }
  }

  const matchingGenres = candidate.genre.filter((g) => userGenres[g]);
  if (matchingGenres.length > 0) {
    score += matchingGenres.length * 15;
    reasons.push(`Matches your favorite genres: ${matchingGenres.join(', ')}`);
  }

  // Service preference
  if (engine === 'service-preference' || engine === 'hybrid') {
    const serviceUsage: Record<string, number> = {};
    for (const entry of history) {
      serviceUsage[entry.serviceId] = (serviceUsage[entry.serviceId] || 0) + 1;
    }
    const serviceCount = serviceUsage[candidate.serviceId] || 0;
    if (serviceCount > 0) {
      score += serviceCount * 10;
      reasons.push(`Available on ${candidate.service} (you use this service)`);
    }
  }

  // Rating boost
  if (candidate.rating >= 8.0) {
    score += 10;
    reasons.push('Highly rated (8.0+)');
  }

  // Year recency
  if (candidate.year >= 2023) {
    score += 5;
    reasons.push('Recent release');
  }

  // Normalize to 0-100
  score = Math.min(score, 100);

  const reason = reasons.length > 0 ? reasons[0] : 'Based on your viewing patterns';

  return { score, reason };
}

export function getRecommendations(
  watchHistory: WatchEntry[],
  contentLibrary: ContentLibraryItem[],
  services: Service[],
  engine: RecommendationEngine = 'hybrid',
  limit: number = 10
): Recommendation[] {
  const watchedTitles = new Set(watchHistory.map((h) => h.title.toLowerCase()));
  const libraryTitles = new Set(contentLibrary.map((c) => c.title.toLowerCase()));

  const candidates = CONTENT_DATABASE.filter(
    (c) => !watchedTitles.has(c.title.toLowerCase()) && !libraryTitles.has(c.title.toLowerCase())
  );

  const scored = candidates.map((c) => {
    const { score, reason } = calculateMatchScore(c, watchHistory, contentLibrary, services, engine);
    return {
      ...c,
      id: `rec-${c.title}-${c.service}`,
      matchScore: score,
      reason,
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}

export function getTopGenres(watchHistory: WatchEntry[]): { genre: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const entry of watchHistory) {
    const genre = entry.genre || 'Unknown';
    counts[genre] = (counts[genre] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);
}

export function getTopServices(watchHistory: WatchEntry[]): { service: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const entry of watchHistory) {
    counts[entry.service] = (counts[entry.service] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);
}
