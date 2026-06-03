import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const STORAGE = new MMKV();
const PREMIUM_KEY = 'premium_state';

export type PremiumTier = 'free' | 'pro' | 'family';

export interface PremiumState {
  tier: PremiumTier;
  isPremium: boolean;
  familyMembers: number;
  maxFamilyMembers: number;
  adsEnabled: boolean;
  rotationAlgorithm: 'standard' | 'advanced' | 'ai-optimized';
  familySharingEnabled: boolean;
  purchasedAt: string | null;

  // Actions
  activatePremium: (tier: PremiumTier) => void;
  deactivatePremium: () => void;
  toggleFamilySharing: () => void;
  addFamilyMember: () => boolean;
  removeFamilyMember: () => boolean;
  setRotationAlgorithm: (algo: PremiumState['rotationAlgorithm']) => void;
  simulatePurchase: (tier: PremiumTier) => void;
}

export const usePremiumStore = create<PremiumState>((set, get) => ({
  tier: 'free',
  isPremium: false,
  familyMembers: 0,
  maxFamilyMembers: 0,
  adsEnabled: true,
  rotationAlgorithm: 'standard',
  familySharingEnabled: false,
  purchasedAt: null,

  activatePremium: (tier) => {
    const maxMembers = tier === 'family' ? 6 : 0;
    set({
      tier,
      isPremium: true,
      familyMembers: tier === 'family' ? 1 : 0,
      maxFamilyMembers: maxMembers,
      adsEnabled: false,
      familySharingEnabled: tier === 'family',
      purchasedAt: new Date().toISOString(),
    });
    STORAGE.set(PREMIUM_KEY, JSON.stringify({
      tier,
      isPremium: true,
      familyMembers: 1,
      maxFamilyMembers: maxMembers,
      adsEnabled: false,
      familySharingEnabled: tier === 'family',
      purchasedAt: new Date().toISOString(),
    }));
  },

  deactivatePremium: () => {
    set({
      tier: 'free',
      isPremium: false,
      familyMembers: 0,
      maxFamilyMembers: 0,
      adsEnabled: true,
      familySharingEnabled: false,
      rotationAlgorithm: 'standard',
      purchasedAt: null,
    });
    STORAGE.delete(PREMIUM_KEY);
  },

  toggleFamilySharing: () => {
    const state = get();
    if (!state.isPremium || state.tier !== 'family') return;
    const newState = !state.familySharingEnabled;
    set({ familySharingEnabled: newState });
  },

  addFamilyMember: () => {
    const state = get();
    if (!state.isPremium || state.tier !== 'family') return false;
    if (state.familyMembers >= state.maxFamilyMembers + 1) return false;
    set({ familyMembers: state.familyMembers + 1 });
    return true;
  },

  removeFamilyMember: () => {
    const state = get();
    if (state.familyMembers <= 1) return false;
    set({ familyMembers: state.familyMembers - 1 });
    return true;
  },

  setRotationAlgorithm: (algo) => {
    set({ rotationAlgorithm: algo });
  },

  simulatePurchase: (tier) => {
    // For testing/demo — simulates an IAP purchase
    get().activatePremium(tier);
  },
}));
