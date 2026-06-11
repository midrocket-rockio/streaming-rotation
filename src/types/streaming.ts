// ─── Streaming Types for Watch Tracking & Recommendations ──────────

export interface WatchEntry {
  id: string;
  title: string;
  type: 'series' | 'movie' | 'documentary' | 'special';
  service: string;
  serviceId: string;
  watchedAt: number;
  rating: number;
  favorite: boolean;
  genre: string;
  duration?: number; // in minutes
  notes: string;
  progress: number; // 0-100
}

export interface CostPerShow {
  id: string;
  title: string;
  service: string;
  monthlyCost: number;
  hoursWatched: number;
  costPerHour: number;
  rating: number;
  watchedAt: number;
}

export interface Recommendation {
  id: string;
  title: string;
  type: 'series' | 'movie' | 'documentary';
  genre: string[];
  rating: number;
  year: number;
  service: string;
  serviceId: string;
  matchScore: number; // 0-100
  reason: string;
  imageUrl?: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'watch' | 'rotate' | 'reminder' | 'milestone';
  title: string;
  description: string;
  serviceId?: string;
  isCompleted: boolean;
}

export interface WatchParty {
  id: string;
  title: string;
  service: string;
  serviceId: string;
  scheduledAt: number;
  hostId: string;
  hostName: string;
  attendees: PartyAttendee[];
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  episode?: string;
  notes: string;
}

export interface PartyAttendee {
  id: string;
  name: string;
  email: string;
  status: 'invited' | 'accepted' | 'declined';
  joinedAt?: number;
}

export interface ContentLibraryItem {
  id: string;
  title: string;
  type: 'series' | 'movie' | 'documentary' | 'special';
  genre: string[];
  rating: number;
  year: number;
  service: string;
  serviceId: string;
  personalRating: number;
  status: 'watching' | 'completed' | 'plan-to-watch' | 'dropped';
  dateAdded: number;
  dateCompleted?: number;
  totalEpisodes?: number;
  episodesWatched?: number;
  notes: string;
  tags: string[];
}

export interface ViewingStats {
  totalShowsWatched: number;
  totalMoviesWatched: number;
  totalHoursWatched: number;
  avgRating: number;
  favoriteGenre: string;
  favoriteService: string;
  currentStreak: number;
  longestStreak: number;
  thisMonthWatched: number;
  thisWeekWatched: number;
}

export type RecommendationEngine = 'genre-match' | 'rating-weighted' | 'service-preference' | 'hybrid';

export interface AdMobConfig {
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  rewardedAdUnitId: string;
  testMode: boolean;
}
