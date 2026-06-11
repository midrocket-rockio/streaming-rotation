// ─── Core Types ────────────────────────────────────────────────

export interface Service {
  id: string;
  name: string;
  monthlyPrice: number;
  brandColor: string;
  icon: string;
  featuredContent: ContentItem[];
  category: ServiceCategory;
  enabled: boolean;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'series' | 'movie' | 'documentary';
  rating: number;
  year: number;
  genre: string;
  imageUrl?: string;
}

export interface RotationPlan {
  id: string;
  serviceName: string;
  serviceId: string;
  startMonth: number; // 0-11
  durationMonths: number;
  order: number;
}

export interface SavingsRecord {
  id: string;
  date: string;
  monthlySavings: number;
  cumulativeSavings: number;
  activeServicesCount: number;
}

export interface SavingsCalc {
  allAtOnceMonthly: number;
  rotationMonthly: number;
  monthlyDifference: number;
  yearlySavings: number;
  twoYearSavings: number;
  threeYearSavings: number;
  activeServicesCount: number;
  totalServicesCount: number;
}

export type ServiceCategory = 'video' | 'music' | 'gaming' | 'other';

export type TabName = 'rotation' | 'services' | 'savings';

export interface AlertConfig {
  serviceId: string;
  daysBefore: number;
  type: 'cancel' | 'reactivate';
  enabled: boolean;
}

export interface NotificationState {
  lastRotationDate: string | null;
  currentRotationIndex: number;
  nextServiceId: string | null;
  pendingAlerts: AlertConfig[];
}

// Re-export streaming types
export * from './streaming';
