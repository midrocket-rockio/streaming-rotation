import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const STORAGE = new MMKV();
const SETTINGS_KEY = 'settings';

export interface AppSettings {
  currency: string;
  currencySymbol: string;
  rotationDayOfMonth: number; // Day of month to rotate (1-28)
  autoRotate: boolean;
  notificationDaysBefore: number;
  theme: 'dark' | 'system';
  language: 'es' | 'en';
  showSavingsProjections: boolean;
  defaultServices: string[]; // IDs of services to enable by default
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  currencySymbol: '$',
  rotationDayOfMonth: 1,
  autoRotate: false,
  notificationDaysBefore: 7,
  theme: 'dark',
  language: 'es',
  showSavingsProjections: true,
  defaultServices: [],
};

export interface SettingsState extends AppSettings {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const loaded = loadSettings();

  return {
    ...DEFAULT_SETTINGS,
    ...loaded,
    settings: { ...DEFAULT_SETTINGS, ...loaded },

    updateSettings: (updates) => {
      const newSettings = { ...get().settings, ...updates };
      saveSettings(newSettings);
      set(newSettings as AppSettings);
    },

    resetSettings: () => {
      STORAGE.delete(SETTINGS_KEY);
      set(DEFAULT_SETTINGS);
    },

    exportData: (): string => {
      const state = get();
      const data = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        settings: state.settings,
        services: [], // Will be populated by rotation store
      };
      return JSON.stringify(data, null, 2);
    },

    importData: (json: string): boolean => {
      try {
        const data = JSON.parse(json);
        if (data.settings) {
          get().updateSettings(data.settings);
        }
        return true;
      } catch {
        return false;
      }
    },
  };
});

function loadSettings(): Partial<AppSettings> {
  const raw = STORAGE.getString(SETTINGS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<AppSettings>;
  } catch {
    return {};
  }
}

function saveSettings(settings: AppSettings): void {
  STORAGE.set(SETTINGS_KEY, JSON.stringify(settings));
}
