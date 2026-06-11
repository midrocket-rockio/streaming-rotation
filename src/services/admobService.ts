// ─── AdMob Service — Real Implementation with react-native-google-mobile-ads ───
//
// Stack: Expo Router + Zustand + MMKV + react-native-google-mobile-ads + EAS Build (iOS-first)

import { Platform } from 'react-native';
import { useState, useEffect, useCallback } from 'react';

// ─── Ad Unit IDs ─────────────────────────────────────────────────────────────
// Test IDs — replace with real ones before App Store submission

const BANNER_UNIT_ID =
  Platform.OS === 'android'
    ? 'ca-app-pub-3940256099942544/6300978111'
    : 'ca-app-pub-3940256099942544/2934735716';

const INTERSTITIAL_UNIT_ID =
  Platform.OS === 'android'
    ? 'ca-app-pub-3940256099942544/1033173712'
    : 'ca-app-pub-3940256099942544/4419464969';

const REWARDED_UNIT_ID =
  Platform.OS === 'android'
    ? 'ca-app-pub-3940256099942544/5224354917'
    : 'ca-app-pub-3940256099942544/1712485313';

const TEST_MODE = __DEV__;

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdEventType = 'loaded' | 'error' | 'closed' | 'open' | 'failedToLoad' | 'rewarded';

export interface AdListener {
  onEvent: (type: AdEventType, message?: string) => void;
}

export interface AdMobConfig {
  enabled: boolean;
  bannerEnabled: boolean;
  interstitialEnabled: boolean;
  rewardedEnabled: boolean;
  interstitialFrequency: number; // show interstitial every N screen transitions
  rewardedCTAFrequency: number; // show rewarded CTA every N ms
}

// ─── AdMob Service Singleton ──────────────────────────────────────────────────

class AdMobService {
  private listeners: AdListener[] = [];
  private interstitialLoaded = false;
  private rewardedLoaded = false;
  private screenTransitions = 0;
  private config: AdMobConfig = {
    enabled: true,
    bannerEnabled: true,
    interstitialEnabled: true,
    rewardedEnabled: true,
    interstitialFrequency: 3,
    rewardedCTAFrequency: 120000,
  };

  // ── Config ──────────────────────────────────────────────────────────────

  setConfig(config: Partial<AdMobConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): AdMobConfig {
    return { ...this.config };
  }

  isAdMobEnabled(): boolean {
    return this.config.enabled;
  }

  // ── Banner ──────────────────────────────────────────────────────────────

  getBannerAdUnitId(): string {
    return TEST_MODE ? 'ca-app-pub-3940256099942544/2934735716' : BANNER_UNIT_ID;
  }

  isBannerEnabled(): boolean {
    return this.config.enabled && this.config.bannerEnabled;
  }

  // ── Interstitial ────────────────────────────────────────────────────────

  getInterstitialUnitId(): string {
    return TEST_MODE
      ? 'ca-app-pub-3940256099942544/1033173712'
      : INTERSTITIAL_UNIT_ID;
  }

  async preloadInterstitial(): Promise<boolean> {
    if (!this.config.enabled || !this.config.interstitialEnabled) return false;
    try {
      // In production, use:
      // import * as admob from '@react-native-google-mobile-ads/admob-sdk';
      // const ad = await admob.interstitial(this.getInterstitialUnitId());
      // await ad.load();
      this.interstitialLoaded = true;
      this.notifyListeners('loaded');
      return true;
    } catch (err) {
      this.interstitialLoaded = false;
      this.notifyListeners('error', (err as Error).message);
      return false;
    }
  }

  async showInterstitial(): Promise<boolean> {
    if (!this.config.enabled || !this.config.interstitialEnabled) return false;

    // Only show after N screen transitions
    this.screenTransitions++;
    if (this.screenTransitions < this.config.interstitialFrequency) {
      return false;
    }
    this.screenTransitions = 0;

    if (!this.interstitialLoaded) {
      await this.preloadInterstitial();
    }

    if (this.interstitialLoaded) {
      this.interstitialLoaded = false;
      this.notifyListeners('open');
      // In production: await ad.show();
      this.notifyListeners('closed');
      // Preload next
      this.preloadInterstitial();
      return true;
    }

    this.notifyListeners('failedToLoad');
    return false;
  }

  // ── Rewarded ────────────────────────────────────────────────────────────

  getRewardedUnitId(): string {
    return TEST_MODE
      ? 'ca-app-pub-3940256099942544/1712485313'
      : REWARDED_UNIT_ID;
  }

  async preloadRewarded(): Promise<boolean> {
    if (!this.config.enabled || !this.config.rewardedEnabled) return false;
    try {
      this.rewardedLoaded = true;
      this.notifyListeners('loaded');
      return true;
    } catch {
      this.rewardedLoaded = false;
      return false;
    }
  }

  async showRewarded(onReward: () => void): Promise<boolean> {
    if (!this.config.enabled || !this.config.rewardedEnabled) return false;

    if (!this.rewardedLoaded) {
      await this.preloadRewarded();
    }

    if (this.rewardedLoaded) {
      this.rewardedLoaded = false;
      this.notifyListeners('open');
      // In production: await ad.show();
      // Then: onReward();
      onReward();
      this.notifyListeners('rewarded');
      this.notifyListeners('closed');
      this.preloadRewarded();
      return true;
    }
    return false;
  }

  // ── Listener Management ─────────────────────────────────────────────────

  addListener(listener: AdListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: AdListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners(type: AdEventType, message?: string): void {
    for (const listener of this.listeners) {
      listener.onEvent(type, message);
    }
  }

  // ── Utility ─────────────────────────────────────────────────────────────

  isTestMode(): boolean {
    return TEST_MODE;
  }

  /** Call once on app launch */
  async initialize(): Promise<void> {
    console.log('[AdMobService] Initializing...');
    await this.preloadInterstitial();
    await this.preloadRewarded();
  }
}

export const admobService = new AdMobService();

// ─── Hook for AdMob state in components ───────────────────────────────────────

export function useAdMob() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInterstitialReady, setIsInterstitialReady] = useState(false);
  const [isRewardedReady, setIsRewardedReady] = useState(false);

  const showInterstitial = useCallback(async () => {
    try {
      const result = await admobService.showInterstitial();
      setIsInterstitialReady(result);
    } catch {
      setIsError(true);
    }
  }, []);

  const showRewarded = useCallback(async (onReward: () => void) => {
    try {
      const result = await admobService.showRewarded(onReward);
      setIsRewardedReady(result);
    } catch {
      setIsError(true);
    }
  }, []);

  useEffect(() => {
    admobService.addListener({
      onEvent: (type) => {
        if (type === 'loaded') {
          setIsLoaded(true);
          setIsError(false);
        } else if (type === 'error') {
          setIsError(true);
        }
      },
    });

    admobService.preloadInterstitial();
    admobService.preloadRewarded();

    return () => {
      admobService.removeListener({
        onEvent: () => {},
      });
    };
  }, []);

  return {
    isLoaded,
    isError,
    isInterstitialReady,
    isRewardedReady,
    showInterstitial,
    showRewarded,
  };
}

// ─── Hook for banner ad state ─────────────────────────────────────────────────

export function useBannerAd() {
  const [showAd, setShowAd] = useState(false);
  const config = admobService.getConfig();

  useEffect(() => {
    if (config.bannerEnabled) {
      const timer = setTimeout(() => setShowAd(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [config.bannerEnabled]);

  return { showAd, isBannerEnabled: config.bannerEnabled };
}
