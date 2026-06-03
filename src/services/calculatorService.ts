import type { SavingsCalc, Service } from '@/types';

/**
 * Calculate savings when rotating vs having all services simultaneously.
 */
export function calculateRotationSavings(
  services: Service[],
  enabledIds?: string[]
): SavingsCalc {
  const targetServices = enabledIds
    ? services.filter((s) => enabledIds.includes(s.id))
    : services.filter((s) => s.enabled);

  const enabledServices = targetServices.filter((s) => s.enabled);
  const totalMonthly = enabledServices.reduce(
    (sum, s) => sum + s.monthlyPrice,
    0
  );
  const count = Math.max(enabledServices.length, 1);
  const rotationMonthly = totalMonthly / count;
  const monthlyDiff = totalMonthly - rotationMonthly;

  return {
    allAtOnceMonthly: Math.round(totalMonthly * 100) / 100,
    rotationMonthly: Math.round(rotationMonthly * 100) / 100,
    monthlyDifference: Math.round(monthlyDiff * 100) / 100,
    yearlySavings: Math.round(monthlyDiff * 12 * 100) / 100,
    twoYearSavings: Math.round(monthlyDiff * 24 * 100) / 100,
    threeYearSavings: Math.round(monthlyDiff * 36 * 100) / 100,
    activeServicesCount: enabledServices.length,
    totalServicesCount: services.length,
  };
}

/**
 * Get the next service in the rotation order.
 */
export function getNextInRotation(
  services: Service[],
  currentMonthOffset: number = 0
): Service | null {
  const enabledServices = services.filter((s) => s.enabled);
  if (enabledServices.length === 0) return null;

  const now = new Date();
  const month = (now.getMonth() + currentMonthOffset) % 12;
  const sorted = [...enabledServices].sort((a, b) => {
    // Use alphabetical as default order
    return a.name.localeCompare(b.name);
  });

  // Find the service whose index matches the current month offset
  const index = month % sorted.length;
  return sorted[index];
}

/**
 * Get all services that would be active in a given month of the rotation.
 */
export function getServicesForMonth(
  services: Service[],
  monthIndex: number
): Service[] {
  const enabledServices = services.filter((s) => s.enabled);
  if (enabledServices.length === 0) return [];

  const sorted = [...enabledServices].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const index = monthIndex % sorted.length;
  return [sorted[index]];
}

/**
 * Generate a 12-month rotation schedule.
 */
export function generateRotationSchedule(
  services: Service[]
): { month: number; label: string; service: Service | null }[] {
  const enabledServices = services.filter((s) => s.enabled);
  if (enabledServices.length === 0) {
    return Array.from({ length: 12 }, (_, i) => ({
      month: i,
      label: getMonthLabel(i),
      service: null,
    }));
  }

  const sorted = [...enabledServices].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return Array.from({ length: 12 }, (_, i) => ({
    month: i,
    label: getMonthLabel(i),
    service: sorted[i % sorted.length],
  }));
}

/**
 * Format a currency amount.
 */
export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}

/**
 * Calculate percentage saved.
 */
export function calculatePercentageSaved(
  original: number,
  newAmount: number
): number {
  if (original === 0) return 0;
  return Math.round(((original - newAmount) / original) * 100);
}

/**
 * Get month name in Spanish.
 */
export function getMonthLabel(monthIndex: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return months[monthIndex] ?? '';
}
