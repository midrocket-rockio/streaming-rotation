// ─── AdMob Service ──────────────────────────────────────────────

import { Platform } from 'react-native';

// AdMob unit IDs — replace with real ones before production
const BANNER_UNIT_ID = Platform.OS === 'android'
  ? 'ca-app-pub-3940256099942544/6300978111'
  : 'ca-app-pub-3940256099942544/2934735716';

const INTERSTITIAL_UNIT_ID = Platform.OS === 'android'
  ? 'ca-app-pub-3940256099942544/1033173712'
  : 'ca-app-pub-3940256099942544/4419464969';

const REWARDED_UNIT_ID = Platform.OS === 'android'
  ? 'ca-app-pub-3940256099942544/5224354917'
  : 'ca-app-pub-3940256099942544/1712485313';

const TEST_MODE = __DEV__;

type AdEventType = 'loaded' | 'error' | 'closed' | 'open' | 'failedToLoad';

interface AdListener {
  onEvent: (type: AdEventType, message?: string) => void;
}

// ─── AdMob Service Singleton ────────────────────────────────────

class AdMobService {
  private listeners: AdListener[] = [];
  private interstitialLoaded = false;
  private rewardedLoaded = false;

  // Banner
  getBannerAdUnitId(): string {
    return TEST_MODE ? 'ca-app-pub-3940256099942544/2934735716' : BANNER_UNIT_ID;
  }

  // Interstitial
  async preloadInterstitial(): Promise<boolean> {
    try {
      // In a real app, use react-native-google-mobile-ads
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
    if (!this.interstitialLoaded) {
      await this.preloadInterstitial();
    }
    if (this.interstitialLoaded) {
      this.interstitialLoaded = false;
      this.notifyListeners('open');
      // Show ad logic here
      this.notifyListeners('closed');
      // Preload next
      this.preloadInterstitial();
      return true;
    }
    this.notifyListeners('failedToLoad');
    return false;
  }

  // Rewarded
  async preloadRewarded(): Promise<boolean> {
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
    if (!this.rewardedLoaded) {
      await this.preloadRewarded();
    }
    if (this.rewardedLoaded) {
      this.rewardedLoaded = false;
      this.notifyListeners('open');
      // Show rewarded ad
      onReward();
      this.notifyListeners('closed');
      this.preloadRewarded();
      return true;
    }
    return false;
  }

  // Listener management
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

  // Utility
  isTestMode(): boolean {
    return TEST_MODE;
  }

  getInterstitialUnitId(): string {
    return TEST_MODE ? 'ca-app-pub-3940256099942544/4419464969' : INTERSTITIAL_UNIT_ID;
  }

  getRewardedUnitId(): string {
    return TEST_MODE ? 'ca-app-pub-3940256099942544/1712485313' : REWARDED_UNIT_ID;
  }
}

export const admobService = new AdMobService();

// ─── Hook for AdMob state in components ─────────────────────────

import { useState, useEffect, useCallback } from 'react';

export function useAdMob() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const showInterstitial = useCallback(async () => {
    try {
      const result = await admobService.showInterstitial();
      setIsLoaded(result);
    } catch {
      setIsError(true);
    }
  }, []);

  const showRewarded = useCallback(async (onReward: () => void) => {
    try {
      await admobService.showRewarded(onReward);
    } catch {
      setIsError(true);
    }
  }, []);

  useEffect(() => {
    admobService.preloadInterstitial();
    admobService.preloadRewarded();
  }, []);

  return { isLoaded, isError, showInterstitial, showRewarded };
}
