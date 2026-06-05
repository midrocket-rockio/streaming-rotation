import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type {
  Service,
  RotationPlan,
  SavingsCalc,
  AlertConfig,
  NotificationState,
  ContentItem,
} from '@/types';
import { useHistoryStore } from '@/stores/historyStore';

// ─── Predefined Services ──────────────────────────────────────

const PREDEFINED_SERVICES: Service[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    monthlyPrice: 13.99,
    brandColor: '#E50914',
    icon: '🎬',
    category: 'video',
    enabled: true,
    createdAt: new Date().toISOString(),
    featuredContent: [
      { id: 'n1', title: 'Stranger Things', type: 'series', rating: 8.7, year: 2016, genre: 'Sci-Fi' },
      { id: 'n2', title: 'The Crown', type: 'series', rating: 8.6, year: 2016, genre: 'Drama' },
      { id: 'n3', title: 'Glass Onion', type: 'movie', rating: 7.1, year: 2022, genre: 'Mystery' },
    ],
  },
  {
    id: 'disney',
    name: 'Disney+',
    monthlyPrice: 10.99,
    brandColor: '#0063E5',
    icon: '🏰',
    category: 'video',
    enabled: true,
    createdAt: new Date().toISOString(),
    featuredContent: [
      { id: 'd1', title: 'The Mandalorian', type: 'series', rating: 8.7, year: 2019, genre: 'Sci-Fi' },
      { id: 'd2', title: 'Loki', type: 'series', rating: 8.2, year: 2021, genre: 'Action' },
      { id: 'd3', title: 'Encanto', type: 'movie', rating: 7.2, year: 2021, genre: 'Animation' },
    ],
  },
  {
    id: 'hbo',
    name: 'HBO Max',
    monthlyPrice: 15.99,
    brandColor: '#B535F6',
    icon: '🎭',
    category: 'video',
    enabled: true,
    createdAt: new Date().toISOString(),
    featuredContent: [
      { id: 'h1', title: 'The Last of Us', type: 'series', rating: 8.8, year: 2023, genre: 'Drama' },
      { id: 'h2', title: 'House of the Dragon', type: 'series', rating: 8.4, year: 2022, genre: 'Fantasy' },
      { id: 'h3', title: 'The Batman', type: 'movie', rating: 7.8, year: 2022, genre: 'Action' },
    ],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    monthlyPrice: 10.99,
    brandColor: '#1DB954',
    icon: '🎵',
    category: 'music',
    enabled: true,
    createdAt: new Date().toISOString(),
    featuredContent: [
      { id: 's1', title: 'Top Global Hits', type: 'series', rating: 9.0, year: 2024, genre: 'Music' },
      { id: 's2', title: 'Chill Vibes', type: 'series', rating: 8.5, year: 2024, genre: 'Ambient' },
      { id: 's3', title: 'Rock Classics', type: 'series', rating: 8.8, year: 2023, genre: 'Rock' },
    ],
  },
  {
    id: 'prime',
    name: 'Prime Video',
    monthlyPrice: 8.99,
    brandColor: '#00A8E1',
    icon: '📦',
    category: 'video',
    enabled: true,
    createdAt: new Date().toISOString(),
    featuredContent: [
      { id: 'p1', title: 'The Boys', type: 'series', rating: 8.7, year: 2019, genre: 'Action' },
      { id: 'p2', title: 'Reacher', type: 'series', rating: 8.1, year: 2022, genre: 'Thriller' },
      { id: 'p3', title: 'Fallout', type: 'series', rating: 8.5, year: 2024, genre: 'Sci-Fi' },
    ],
  },
  {
    id: 'apple',
    name: 'Apple TV+',
    monthlyPrice: 9.99,
    brandColor: '#555555',
    icon: '🍎',
    category: 'video',
    enabled: true,
    createdAt: new Date().toISOString(),
    featuredContent: [
      { id: 'a1', title: 'Severance', type: 'series', rating: 8.7, year: 2022, genre: 'Thriller' },
      { id: 'a2', title: 'Ted Lasso', type: 'series', rating: 8.8, year: 2020, genre: 'Comedy' },
      { id: 'a3', title: 'Foundation', type: 'series', rating: 7.3, year: 2021, genre: 'Sci-Fi' },
    ],
  },
  {
    id: 'max',
    name: 'Max',
    monthlyPrice: 12.99,
    brandColor: '#4F46E5',
    icon: '✨',
    category: 'video',
    enabled: true,
    createdAt: new Date().toISOString(),
    featuredContent: [
      { id: 'm1', title: 'Succession', type: 'series', rating: 8.9, year: 2018, genre: 'Drama' },
      { id: 'm2', title: 'The White Lotus', type: 'series', rating: 7.9, year: 2021, genre: 'Comedy' },
      { id: 'm3', title: 'Dune', type: 'movie', rating: 8.0, year: 2021, genre: 'Sci-Fi' },
    ],
  },
  {
    id: 'paramount',
    name: 'Paramount+',
    monthlyPrice: 11.99,
    brandColor: '#0064FF',
    icon: '⛰️',
    category: 'video',
    enabled: true,
    createdAt: new Date().toISOString(),
    featuredContent: [
      { id: 'pa1', title: 'Yellowstone', type: 'series', rating: 8.7, year: 2018, genre: 'Drama' },
      { id: 'pa2', title: '1923', type: 'series', rating: 8.2, year: 2022, genre: 'Western' },
      { id: 'pa3', title: 'Tulsa King', type: 'series', rating: 7.5, year: 2022, genre: 'Crime' },
    ],
  },
];

// ─── Storage Key ──────────────────────────────────────────────

const STORAGE = new MMKV();

const SERVICES_KEY = 'services';
const ROTATION_KEY = 'rotation_plan';
const NOTIFICATION_KEY = 'notification_state';
const SAVINGS_KEY = 'savings_records';

// ─── Helpers ──────────────────────────────────────────────────

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

// ─── Store ────────────────────────────────────────────────────

interface RotationStore {
  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'createdAt'>) => void;
  removeService: (id: string) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  toggleService: (id: string) => void;

  // Rotation
  rotationPlan: RotationPlan[];
  buildRotationPlan: () => void;
  updateRotationOrder: (planId: string, newOrder: number) => void;
  removeRotationEntry: (planId: string) => void;
  getNextService: () => Service | null;
  getCurrentService: () => Service | null;
  getMonthsUntilNextRotation: () => number;

  // Savings
  savings: SavingsCalc;
  calculateSavings: () => SavingsCalc;

  // Notifications
  notificationState: NotificationState;
  updateNotificationState: (updates: Partial<NotificationState>) => void;

  // Alerts
  alerts: AlertConfig[];
  addAlert: (alert: Omit<AlertConfig, 'enabled'>) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;

  // Reset
  resetAll: () => void;

  // Rotation logging
  logRotation: (serviceId: string) => void;
}

export const useRotationStore = create<RotationStore>((set, get) => ({
  // ── Services ──────────────────────────────────────────────
  services: load<Service[]>(SERVICES_KEY, PREDEFINED_SERVICES),

  addService: (service) => {
    const newService: Service = {
      ...service,
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...get().services, newService];
    save(SERVICES_KEY, updated);
    set({ services: updated });
    get().buildRotationPlan();
  },

  removeService: (id) => {
    const updated = get().services.filter((s) => s.id !== id);
    save(SERVICES_KEY, updated);
    set({ services: updated });
    get().buildRotationPlan();
  },

  updateService: (id, updates) => {
    const updated = get().services.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    save(SERVICES_KEY, updated);
    set({ services: updated });
    get().buildRotationPlan();
  },

  toggleService: (id) => {
    const updated = get().services.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    save(SERVICES_KEY, updated);
    set({ services: updated });
    get().buildRotationPlan();
  },

  // ── Rotation Plan ─────────────────────────────────────────
  rotationPlan: load<RotationPlan[]>(ROTATION_KEY, []),

  buildRotationPlan: () => {
    const enabledServices = get().services.filter((s) => s.enabled);
    const plan: RotationPlan[] = enabledServices.map((svc, index) => ({
      id: `plan-${svc.id}`,
      serviceName: svc.name,
      serviceId: svc.id,
      startMonth: index,
      durationMonths: 1,
      order: index,
    }));
    save(ROTATION_KEY, plan);
    set({ rotationPlan: plan });
  },

  updateRotationOrder: (planId, newOrder) => {
    const updated = get().rotationPlan.map((p) =>
      p.id === planId ? { ...p, order: newOrder } : p
    );
    save(ROTATION_KEY, updated);
    set({ rotationPlan: updated });
  },

  removeRotationEntry: (planId) => {
    const updated = get().rotationPlan.filter((p) => p.id !== planId);
    save(ROTATION_KEY, updated);
    set({ rotationPlan: updated });
  },

  getNextService: (): Service | null => {
    const plan = get().rotationPlan;
    if (plan.length === 0) return null;
    const now = new Date();
    const currentMonth = now.getMonth();
    const sorted = [...plan].sort((a, b) => a.order - b.order);
    // Find the service whose start month is next
    const nextEntry = sorted.find((e) => e.startMonth > currentMonth) ?? sorted[0];
    return get().services.find((s) => s.id === nextEntry.serviceId) ?? null;
  },

  getCurrentService: (): Service | null => {
    const plan = get().rotationPlan;
    if (plan.length === 0) return null;
    const now = new Date();
    const currentMonth = now.getMonth();
    const sorted = [...plan].sort((a, b) => a.order - b.order);
    // Find service active this month
    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      const endMonth = (entry.startMonth + entry.durationMonths) % 12;
      if (entry.startMonth <= currentMonth && currentMonth < endMonth) {
        return get().services.find((s) => s.id === entry.serviceId) ?? null;
      }
    }
    // Fallback: service whose start month is closest to current
    return get().services.find((s) => s.id === sorted[0].serviceId) ?? null;
  },

  getMonthsUntilNextRotation: (): number => {
    const plan = get().rotationPlan;
    if (plan.length === 0) return 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const sorted = [...plan].sort((a, b) => a.order - b.order);
    const nextEntry = sorted.find((e) => e.startMonth > currentMonth) ?? sorted[0];
    let diff = nextEntry.startMonth - currentMonth;
    if (diff <= 0) diff += 12;
    return diff;
  },

  // ── Savings ───────────────────────────────────────────────
  savings: {
    allAtOnceMonthly: 0,
    rotationMonthly: 0,
    monthlyDifference: 0,
    yearlySavings: 0,
    twoYearSavings: 0,
    threeYearSavings: 0,
    activeServicesCount: 0,
    totalServicesCount: 0,
  },

  calculateSavings: (): SavingsCalc => {
    const services = get().services;
    const enabledServices = services.filter((s) => s.enabled);
    const totalMonthly = enabledServices.reduce((sum, s) => sum + s.monthlyPrice, 0);
    const rotationMonthly = totalMonthly / Math.max(enabledServices.length, 1);
    const monthlyDiff = totalMonthly - rotationMonthly;
    const calc: SavingsCalc = {
      allAtOnceMonthly: totalMonthly,
      rotationMonthly: Math.round(rotationMonthly * 100) / 100,
      monthlyDifference: Math.round(monthlyDiff * 100) / 100,
      yearlySavings: Math.round(monthlyDiff * 12 * 100) / 100,
      twoYearSavings: Math.round(monthlyDiff * 24 * 100) / 100,
      threeYearSavings: Math.round(monthlyDiff * 36 * 100) / 100,
      activeServicesCount: enabledServices.length,
      totalServicesCount: services.length,
    };
    save(SAVINGS_KEY, calc);
    set({ savings: calc });
    return calc;
  },

  // ── Notifications ─────────────────────────────────────────
  notificationState: load<NotificationState>(NOTIFICATION_KEY, {
    lastRotationDate: null,
    currentRotationIndex: 0,
    nextServiceId: null,
    pendingAlerts: [],
  }),

  updateNotificationState: (updates) => {
    const newState = { ...get().notificationState, ...updates };
    save(NOTIFICATION_KEY, newState);
    set({ notificationState: newState });
  },

  // ── Alerts ────────────────────────────────────────────────
  alerts: load<AlertConfig[]>(SAVINGS_KEY + '-alerts', []),

  addAlert: (alert) => {
    const newAlert: AlertConfig = { ...alert, enabled: true };
    const updated = [...get().alerts, newAlert];
    save(SAVINGS_KEY + '-alerts', updated);
    set({ alerts: updated });
  },

  removeAlert: (id) => {
    const updated = get().alerts.filter((a) => a.id !== id);
    save(SAVINGS_KEY + '-alerts', updated);
    set({ alerts: updated });
  },

  toggleAlert: (id) => {
    const updated = get().alerts.map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    save(SAVINGS_KEY + '-alerts', updated);
    set({ alerts: updated });
  },

  // ── Reset ─────────────────────────────────────────────────
  resetAll: () => {
    STORAGE.deleteAll();
    set({
      services: PREDEFINED_SERVICES,
      rotationPlan: [],
      savings: {
        allAtOnceMonthly: 0,
        rotationMonthly: 0,
        monthlyDifference: 0,
        yearlySavings: 0,
        twoYearSavings: 0,
        threeYearSavings: 0,
        activeServicesCount: 0,
        totalServicesCount: 0,
      },
      notificationState: {
        lastRotationDate: null,
        currentRotationIndex: 0,
        nextServiceId: null,
        pendingAlerts: [],
      },
      alerts: [],
    });
    get().buildRotationPlan();
    get().calculateSavings();
  },

  // ── Rotation Logging ──────────────────────────────────────
  logRotation: (serviceId) => {
    const service = get().services.find((s) => s.id === serviceId);
    if (service) {
      useHistoryStore.getState().addEntry({
        serviceName: service.name,
        serviceId: service.id,
        monthlyPrice: service.monthlyPrice,
        category: service.category,
        icon: service.icon,
      });
    }
  },
}));
