/**
 * Calculate the cost per hour of content for a service.
 */
export function calculateCostPerHour(
  monthlyCost: number,
  hoursWatchedPerMonth: number
): number {
  if (hoursWatchedPerMonth === 0) return 0;
  return Math.round((monthlyCost / hoursWatchedPerMonth) * 100) / 100;
}

/**
 * Calculate the savings from rotating vs. keeping all subscriptions.
 */
export function calculateRotationSavings(
  monthlyCosts: number[],
  rotationCount: number
): {
  totalMonthly: number;
  rotationMonthly: number;
  monthlySavings: number;
  yearlySavings: number;
  savingsPercentage: number;
} {
  const totalMonthly = monthlyCosts.reduce((sum, c) => sum + c, 0);
  const rotationMonthly = monthlyCosts.length > 0
    ? totalMonthly / Math.max(rotationCount, 1)
    : 0;
  const monthlySavings = totalMonthly - rotationMonthly;
  const yearlySavings = monthlySavings * 12;
  const savingsPercentage = totalMonthly > 0
    ? Math.round((monthlySavings / totalMonthly) * 100)
    : 0;

  return {
    totalMonthly: Math.round(totalMonthly * 100) / 100,
    rotationMonthly: Math.round(rotationMonthly * 100) / 100,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    yearlySavings: Math.round(yearlySavings * 100) / 100,
    savingsPercentage,
  };
}

/**
 * Calculate the family plan cost split.
 */
export function calculateFamilySplit(
  totalCost: number,
  memberCount: number,
  unequalShares?: Record<string, number>
): Record<string, number> {
  if (memberCount === 0) return {};

  if (!unequalShares || Object.keys(unequalShares).length === 0) {
    // Equal split
    const perMember = Math.round((totalCost / memberCount) * 100) / 100;
    const result: Record<string, number> = {};
    for (let i = 0; i < memberCount; i++) {
      result[`member-${i}`] = perMember;
    }
    return result;
  }

  // Unequal split based on percentages
  const totalPercentage = Object.values(unequalShares).reduce((s, v) => s + v, 0);
  const result: Record<string, number> = {};
  for (const [key, percentage] of Object.entries(unequalShares)) {
    result[key] = Math.round((totalCost * (percentage / totalPercentage)) * 100) / 100;
  }
  return result;
}

/**
 * Get the optimal rotation count for maximum savings.
 */
export function getOptimalRotationCount(
  serviceCosts: { id: string; cost: number }[],
  maxServices: number
): {
  count: number;
  savings: number;
  services: string[];
} {
  const sorted = [...serviceCosts].sort((a, b) => b.cost - a.cost);
  const totalCost = sorted.reduce((s, svc) => s + svc.cost, 0);

  let bestCount = 1;
  let bestSavings = 0;
  let bestServices: string[] = [];

  for (let count = 1; count <= Math.min(maxServices, sorted.length); count++) {
    const rotationCost = totalCost / count;
    const savings = totalCost - rotationCost;
    if (savings > bestSavings) {
      bestSavings = savings;
      bestCount = count;
      bestServices = sorted.slice(0, count).map((s) => s.id);
    }
  }

  return {
    count: bestCount,
    savings: Math.round(bestSavings * 100) / 100,
    services: bestServices,
  };
}

/**
 * Calculate the ROI of a rotation plan.
 */
export function calculateROI(
  totalSavings: number,
  totalSpent: number
): number {
  if (totalSpent === 0) return 0;
  return Math.round(((totalSavings - totalSpent) / totalSpent) * 10000) / 100;
}

/**
 * Generate a monthly cost projection.
 */
export function generateCostProjection(
  serviceCosts: number[],
  months: number
): { month: number; cost: number; cumulativeSavings: number }[] {
  const totalCost = serviceCosts.reduce((s, c) => s + c, 0);
  const rotationCost = serviceCosts.length > 0
    ? totalCost / serviceCosts.length
    : 0;
  const monthlySavings = totalCost - rotationCost;
  let cumulativeSavings = 0;

  return Array.from({ length: months }, (_, i) => {
    cumulativeSavings += monthlySavings;
    return {
      month: i + 1,
      cost: Math.round(rotationCost * 100) / 100,
      cumulativeSavings: Math.round(cumulativeSavings * 100) / 100,
    };
  });
}

/**
 * Format a cost amount with currency symbol.
 */
export function formatCost(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Check if a cost is within budget.
 */
export function isWithinBudget(cost: number, budget: number): boolean {
  return cost <= budget;
}

/**
 * Get the remaining budget.
 */
export function getRemainingBudget(cost: number, budget: number): number {
  return Math.max(0, Math.round((budget - cost) * 100) / 100);
}

/**
 * Calculate the percentage of budget used.
 */
export function getBudgetPercentage(cost: number, budget: number): number {
  if (budget === 0) return 0;
  return Math.round((cost / budget) * 100);
}
