import { useState, useCallback } from 'react';
import { useCostStore, useViewingStore, useFamilyStore } from '../services/costService';

export const useCostComparison = () => {
  const comparisons = useCostStore((s) => s.comparisons);
  const addComparison = useCostStore((s) => s.addComparison);
  const removeComparison = useCostStore((s) => s.removeComparison);
  const annualSummary = useCostStore((s) => s.getAnnualSummary());
  const spendingByService = useCostStore((s) => s.getSpendingByService());

  return {
    comparisons,
    annualSummary,
    spendingByService,
    addComparison,
    removeComparison,
  };
};

export const useViewingHistory = () => {
  const history = useViewingStore((s) => s.history);
  const addEntry = useViewingStore((s) => s.addEntry);
  const toggleFavorite = useViewingStore((s) => s.toggleFavorite);
  const favorites = useViewingStore((s) => s.getFavorites());
  const topRated = useViewingStore((s) => s.getTopRated());
  const genreDistribution = useViewingStore((s) => s.getGenreDistribution());

  return {
    history,
    favorites,
    topRated,
    genreDistribution,
    addEntry,
    toggleFavorite,
  };
};

export const useFamilyPlan = () => {
  const members = useFamilyStore((s) => s.members);
  const addMember = useFamilyStore((s) => s.addMember);
  const removeMember = useFamilyStore((s) => s.removeMember);
  const toggleActive = useFamilyStore((s) => s.toggleActive);
  const totalCost = useFamilyStore((s) => s.getTotalCost());
  const activeMembers = useFamilyStore((s) => s.getActiveMembers());
  const savingsPerMember = useFamilyStore((s) => s.getSavingsPerMember());

  return {
    members,
    totalCost,
    activeMembers,
    savingsPerMember,
    addMember,
    removeMember,
    toggleActive,
  };
};
