import type {
  WatchlistItem,
  RotationSchedule,
  ViewingHistory,
  FamilyPlanMember,
} from '@/types/rotation';

/**
 * Validate a watchlist item's data.
 */
export function validateWatchlistItem(
  item: Partial<WatchlistItem>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!item.title || item.title.trim().length === 0) {
    errors.push('El título es obligatorio');
  }
  if (!item.serviceId || item.serviceId.trim().length === 0) {
    errors.push('El servicio es obligatorio');
  }
  if (!item.type || !['series', 'movie', 'documentary'].includes(item.type)) {
    errors.push('Tipo inválido');
  }
  if (item.year && (item.year < 1900 || item.year > new Date().getFullYear() + 5)) {
    errors.push('Año fuera de rango');
  }
  if (item.rating !== undefined && (item.rating < 1 || item.rating > 5)) {
    errors.push('Rating debe estar entre 1 y 5');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a rotation schedule entry.
 */
export function validateRotationSchedule(
  entry: Partial<RotationSchedule>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!entry.serviceId || entry.serviceId.trim().length === 0) {
    errors.push('El servicio es obligatorio');
  }
  if (!entry.startDate) {
    errors.push('La fecha de inicio es obligatoria');
  }
  if (!entry.endDate) {
    errors.push('La fecha de fin es obligatoria');
  }
  if (entry.startDate && entry.endDate) {
    const start = new Date(entry.startDate);
    const end = new Date(entry.endDate);
    if (end <= start) {
      errors.push('La fecha de fin debe ser posterior a la de inicio');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a viewing history entry.
 */
export function validateViewingEntry(
  entry: Partial<ViewingHistory>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!entry.title || entry.title.trim().length === 0) {
    errors.push('El título es obligatorio');
  }
  if (!entry.serviceId || entry.serviceId.trim().length === 0) {
    errors.push('El servicio es obligatorio');
  }
  if (entry.rating !== undefined && (entry.rating < 1 || entry.rating > 5)) {
    errors.push('Rating debe estar entre 1 y 5');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a family plan member.
 */
export function validateFamilyMember(
  member: Partial<FamilyPlanMember>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!member.name || member.name.trim().length === 0) {
    errors.push('El nombre es obligatorio');
  }
  if (!member.email || member.email.trim().length === 0) {
    errors.push('El email es obligatorio');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
    errors.push('Email inválido');
  }
  if (!member.avatar || member.avatar.trim().length === 0) {
    errors.push('El avatar es obligatorio');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Format a date range for display.
 */
export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return `${startDate.toLocaleDateString('es', options)} → ${endDate.toLocaleDateString('es', options)}`;
}

/**
 * Get the status of a rotation schedule based on dates.
 */
export function getScheduleStatus(
  entry: RotationSchedule
): 'upcoming' | 'active' | 'completed' | 'cancelled' {
  const now = new Date();
  const start = new Date(entry.startDate);
  const end = new Date(entry.endDate);

  if (entry.status !== 'upcoming' && entry.status !== 'active') {
    return entry.status;
  }

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'active';
  return 'completed';
}

/**
 * Get the number of days between two dates.
 */
export function daysBetween(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Get the number of months between two dates.
 */
export function monthsBetween(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
}

/**
 * Get the next rotation date from a schedule.
 */
export function getNextRotationDate(
  entries: RotationSchedule[]
): string | null {
  const now = new Date();
  const upcoming = entries
    .filter((e) => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return upcoming.length > 0 ? upcoming[0].startDate : null;
}

/**
 * Format a rotation schedule for a summary display.
 */
export function formatRotationSummary(entry: RotationSchedule): string {
  const days = daysBetween(entry.startDate, entry.endDate);
  return `${entry.serviceName} · ${days} días · ${formatDateRange(entry.startDate, entry.endDate)}`;
}
