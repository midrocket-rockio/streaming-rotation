export interface WatchlistItem {
  id: string;
  title: string;
  type: 'show' | 'movie';
  service: string;
  watched: boolean;
  rating?: number;
  notes: string;
  dateAdded: number;
}

export interface RotationSchedule {
  id: string;
  service: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
  notes: string;
}

export interface CostComparison {
  service: string;
  monthlyCost: number;
  annualCost: number;
  isSimultaneous: boolean;
  savings: number;
}

export interface ViewingHistory {
  id: string;
  title: string;
  service: string;
  type: string;
  watchedAt: number;
  rating: number;
  favorite: boolean;
}

export interface FamilyPlanMember {
  id: string;
  name: string;
  profileCount: number;
  isActive: boolean;
  role: 'admin' | 'user';
  monthlyCost: number;
}

export interface RotationAnalytics {
  totalServices: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
  totalSavings: number;
  avgRating: number;
  topService: string;
}
