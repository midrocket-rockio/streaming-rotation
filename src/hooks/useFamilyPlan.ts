import { useCallback, useMemo } from 'react';
import { useFamilyStore } from '@/services/familyService';
import type { FamilyPlanMember } from '@/types/rotation';

/**
 * Hook providing family plan management functionality.
 */
export function useFamilyPlan() {
  const members = useFamilyStore((s) => s.members);
  const familyPlanEnabled = useFamilyStore((s) => s.familyPlanEnabled);
  const familyPlanPrice = useFamilyStore((s) => s.familyPlanPrice);
  const addMember = useFamilyStore((s) => s.addMember);
  const removeMember = useFamilyStore((s) => s.removeMember);
  const updateMember = useFamilyStore((s) => s.updateMember);
  const toggleMemberActive = useFamilyStore((s) => s.toggleMemberActive);
  const updatePlan = useFamilyStore((s) => s.updatePlan);
  const getActiveMembers = useFamilyStore((s) => s.getActiveMembers);
  const getCostPerMember = useFamilyStore((s) => s.getCostPerMember);
  const getTotalSavings = useFamilyStore((s) => s.getTotalSavings);
  const clearAll = useFamilyStore((s) => s.clearAll);

  const activeMembers = useMemo(
    () => getActiveMembers(),
    [getActiveMembers]
  );

  const costPerMember = useMemo(
    () => getCostPerMember(),
    [getCostPerMember]
  );

  const totalSavings = useMemo(
    () => getTotalSavings(),
    [getTotalSavings]
  );

  const savingsPercentage = useMemo(() => {
    if (members.length === 0) return 0;
    const individualCost = members.reduce(
      (sum, m) => sum + m.monthlyShare,
      0
    );
    if (individualCost === 0) return 0;
    return Math.round(
      ((individualCost - familyPlanPrice) / individualCost) * 100
    );
  }, [members, familyPlanPrice]);

  const addFamilyMember = useCallback(
    (member: Omit<FamilyPlanMember, 'id' | 'joinedAt' | 'currentProfiles' | 'monthlyShare'>) => {
      addMember(member);
    },
    [addMember]
  );

  const removeFamilyMember = useCallback(
    (id: string) => {
      removeMember(id);
    },
    [removeMember]
  );

  const updateFamilyMember = useCallback(
    (id: string, updates: Partial<FamilyPlanMember>) => {
      updateMember(id, updates);
    },
    [updateMember]
  );

  const toggleMember = useCallback(
    (id: string) => {
      toggleMemberActive(id);
    },
    [toggleMemberActive]
  );

  const updatePlanConfig = useCallback(
    (price: number, enabled: boolean) => {
      updatePlan(price, enabled);
    },
    [updatePlan]
  );

  const maxMembers = 6;
  const availableSlots = maxMembers - members.length;

  return {
    // Data
    members,
    activeMembers,
    familyPlanEnabled,
    familyPlanPrice,
    costPerMember,
    totalSavings,
    savingsPercentage,
    availableSlots,
    maxMembers,

    // Actions
    addMember: addFamilyMember,
    removeMember: removeFamilyMember,
    updateMember: updateFamilyMember,
    toggleMember,
    updatePlan: updatePlanConfig,
    clearAll,
  };
}
