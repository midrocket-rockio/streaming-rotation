import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';
import type { FamilyPlanMember } from '@/types/rotation';

const STORAGE = new MMKV();
const FAMILY_KEY = 'family_plan';

interface FamilyState {
  members: FamilyPlanMember[];
  familyPlanEnabled: boolean;
  familyPlanPrice: number;
  addMember: (member: Omit<FamilyPlanMember, 'id' | 'joinedAt' | 'currentProfiles' | 'monthlyShare'>) => void;
  removeMember: (id: string) => void;
  updateMember: (id: string, updates: Partial<FamilyPlanMember>) => void;
  toggleMemberActive: (id: string) => void;
  getActiveMembers: () => FamilyPlanMember[];
  getMemberCount: () => number;
  getMaxMembers: () => number;
  getCostPerMember: () => number;
  getTotalSavings: () => number;
  updatePlan: (price: number, enabled: boolean) => void;
  clearAll: () => void;
}

function loadFamily(): FamilyPlanMember[] {
  const raw = STORAGE.getString(FAMILY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as FamilyPlanMember[];
  } catch {
    return [];
  }
}

function saveFamily(members: FamilyPlanMember[]): void {
  STORAGE.set(FAMILY_KEY, JSON.stringify(members));
}

function loadPlan(): { enabled: boolean; price: number } {
  const raw = STORAGE.getString(FAMILY_KEY + '-plan');
  if (!raw) return { enabled: false, price: 22.99 };
  try {
    return JSON.parse(raw);
  } catch {
    return { enabled: false, price: 22.99 };
  }
}

function savePlan(enabled: boolean, price: number): void {
  STORAGE.set(FAMILY_KEY + '-plan', JSON.stringify({ enabled, price }));
}

export const useFamilyStore = create<FamilyState>((set, get) => {
  const plan = loadPlan();

  return {
    members: loadFamily(),
    familyPlanEnabled: plan.enabled,
    familyPlanPrice: plan.price,

    addMember: (member) => {
      const maxMembers = 6;
      if (get().members.length >= maxMembers) return;
      const costPerMember = get().getCostPerMember();
      const newMember: FamilyPlanMember = {
        ...member,
        id: `fam-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        joinedAt: new Date().toISOString(),
        currentProfiles: 1,
        monthlyShare: costPerMember,
        isActive: true,
      };
      const updated = [...get().members, newMember];
      saveFamily(updated);
      set({ members: updated });
    },

    removeMember: (id) => {
      const updated = get().members.filter((m) => m.id !== id);
      saveFamily(updated);
      set({ members: updated });
    },

    updateMember: (id, updates) => {
      const updated = get().members.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      );
      saveFamily(updated);
      set({ members: updated });
    },

    toggleMemberActive: (id) => {
      const updated = get().members.map((m) =>
        m.id === id ? { ...m, isActive: !m.isActive } : m
      );
      saveFamily(updated);
      set({ members: updated });
    },

    getActiveMembers: () =>
      get().members.filter((m) => m.isActive),

    getMemberCount: () => get().members.length,

    getMaxMembers: () => 6,

    getCostPerMember: () => {
      const active = get().getActiveMembers();
      if (active.length === 0) return get().familyPlanPrice;
      return Math.round((get().familyPlanPrice / active.length) * 100) / 100;
    },

    getTotalSavings: () => {
      const individualTotal = get().members.reduce(
        (sum, m) => sum + m.monthlyShare * get().getMaxMembers(),
        0
      );
      const familyTotal = get().familyPlanPrice;
      return Math.max(0, Math.round((individualTotal - familyTotal) * 100) / 100);
    },

    updatePlan: (price, enabled) => {
      savePlan(enabled, price);
      set({ familyPlanEnabled: enabled, familyPlanPrice: price });
    },

    clearAll: () => {
      STORAGE.delete(FAMILY_KEY);
      STORAGE.delete(FAMILY_KEY + '-plan');
      set({
        members: [],
        familyPlanEnabled: false,
        familyPlanPrice: 22.99,
      });
    },
  };
});
