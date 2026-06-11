import { create } from 'zustand';
import { storage } from './storage';
import { CostComparison, ViewingHistory, FamilyPlanMember } from '../types/rotation';

const COST_KEY = 'cost_data';
const VIEWING_KEY = 'viewing_history';
const FAMILY_KEY = 'family_members';

interface CostState {
  comparisons: CostComparison[];
  addComparison: (c: Omit<CostComparison, 'annualCost' | 'savings'>) => void;
  removeComparison: (service: string) => void;
  getAnnualSummary: () => { totalMonthly: number; totalAnnual: number; totalSavings: number };
  getBudgetStatus: (budget: number) => { spent: number; remaining: number; overBudget: boolean };
  getSpendingByService: () => Record<string, number>;
}

interface ViewingState {
  history: ViewingHistory[];
  addEntry: (entry: Omit<ViewingHistory, 'id' | 'watchedAt' | 'favorite'>) => void;
  toggleFavorite: (id: string) => void;
  getFavorites: () => ViewingHistory[];
  getTopRated: () => ViewingHistory[];
  getGenreDistribution: () => Record<string, number>;
  getByService: (service: string) => ViewingHistory[];
}

interface FamilyState {
  members: FamilyPlanMember[];
  addMember: (m: Omit<FamilyPlanMember, 'id'>) => void;
  removeMember: (id: string) => void;
  toggleActive: (id: string) => void;
  getTotalCost: () => number;
  getActiveMembers: () => FamilyPlanMember[];
  getSavingsPerMember: () => number;
}

export const useCostStore = create<CostState>((set, get) => ({
  comparisons: (() => {
    const data = storage.getString(COST_KEY);
    return data ? JSON.parse(data) : [];
  })(),

  addComparison: (c) => {
    const entry: CostComparison = {
      ...c,
      annualCost: Math.round(c.monthlyCost * 12 * 100) / 100,
      savings: 0,
    };
    const comparisons = [...get().comparisons, entry];
    storage.set(COST_KEY, JSON.stringify(comparisons));
    set({ comparisons });
  },

  removeComparison: (service) => {
    const comparisons = get().comparisons.filter((c) => c.service !== service);
    storage.set(COST_KEY, JSON.stringify(comparisons));
    set({ comparisons });
  },

  getAnnualSummary: () => {
    const comps = get().comparisons;
    const totalMonthly = comps.reduce((s, c) => s + c.monthlyCost, 0);
    return {
      totalMonthly: Math.round(totalMonthly * 100) / 100,
      totalAnnual: Math.round(totalMonthly * 12 * 100) / 100,
      totalSavings: Math.round(totalMonthly * 6 * 100) / 100,
    };
  },

  getBudgetStatus: (budget) => {
    const summary = get().getAnnualSummary();
    const monthlyBudget = budget / 12;
    const spent = summary.totalMonthly;
    return {
      spent: Math.round(spent * 100) / 100,
      remaining: Math.round((monthlyBudget - spent) * 100) / 100,
      overBudget: spent > monthlyBudget,
    };
  },

  getSpendingByService: () => {
    const byService: Record<string, number> = {};
    for (const c of get().comparisons) {
      byService[c.service] = c.monthlyCost;
    }
    return byService;
  },
}));

export const useViewingStore = create<ViewingState>((set, get) => ({
  history: (() => {
    const data = storage.getString(VIEWING_KEY);
    return data ? JSON.parse(data) : [];
  })(),

  addEntry: (entry) => {
    const newEntry: ViewingHistory = {
      ...entry,
      id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      watchedAt: Date.now(),
      favorite: false,
    };
    const history = [...get().history, newEntry];
    storage.set(VIEWING_KEY, JSON.stringify(history));
    set({ history });
  },

  toggleFavorite: (id) => {
    const history = get().history.map((h) =>
      h.id === id ? { ...h, favorite: !h.favorite } : h
    );
    storage.set(VIEWING_KEY, JSON.stringify(history));
    set({ history });
  },

  getFavorites: () => get().history.filter((h) => h.favorite),
  getTopRated: () => get().history.filter((h) => h.rating && h.rating >= 4).sort((a, b) => (b.rating || 0) - (a.rating || 0)),
  getGenreDistribution: () => {
    const dist: Record<string, number> = {};
    for (const h of get().history) {
      dist[h.type] = (dist[h.type] || 0) + 1;
    }
    return dist;
  },
  getByService: (service) => get().history.filter((h) => h.service === service),
}));

export const useFamilyStore = create<FamilyState>((set, get) => ({
  members: (() => {
    const data = storage.getString(FAMILY_KEY);
    return data ? JSON.parse(data) : [];
  })(),

  addMember: (m) => {
    const newMember: FamilyPlanMember = {
      ...m,
      id: `fam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const members = [...get().members, newMember];
    storage.set(FAMILY_KEY, JSON.stringify(members));
    set({ members });
  },

  removeMember: (id) => {
    const members = get().members.filter((m) => m.id !== id);
    storage.set(FAMILY_KEY, JSON.stringify(members));
    set({ members });
  },

  toggleActive: (id) => {
    const members = get().members.map((m) =>
      m.id === id ? { ...m, isActive: !m.isActive } : m
    );
    storage.set(FAMILY_KEY, JSON.stringify(members));
    set({ members });
  },

  getTotalCost: () => get().members.reduce((s, m) => s + m.monthlyCost, 0),
  getActiveMembers: () => get().members.filter((m) => m.isActive),
  getSavingsPerMember: () => {
    const total = get().getTotalCost();
    const active = get().getActiveMembers().length;
    return active > 0 ? Math.round((total / active) * 100) / 100 : 0;
  },
}));
