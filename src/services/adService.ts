// ─── Ad Service — Rewarded Video Ads ───
//
// Stack: Expo Router + Zustand + MMKV + react-native-google-mobile-ads + EAS Build (iOS-first)

import { Platform } from 'react-native';
import {
  RewardedAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';

// Test Ad Unit IDs (Google's official test IDs)
const REWARDED_AD_UNIT_ID =
  Platform.OS === 'android'
    ? TestIds.REWARDED
    : 'ca-app-pub-3940256099942544/1712485313';

let rewardedAd: RewardedAd | null = null;
let isRewardedAdReady = false;

/**
 * Load a rewarded video ad. Call early so it's ready when the user opts in.
 */
export async function loadRewardedAd(): Promise<void> {
  try {
    rewardedAd = RewardedAd.createForAdRequest({
      adUnitID: REWARDED_AD_UNIT_ID,
      requestNonPersonalizedAdsOnly: true,
    });

    rewardedAd.addAdEventListener(AdEventType.LOADED, () => {
      isRewardedAdReady = true;
      console.log('[StreamingRotation AdService] Rewarded ad loaded');
    });

    rewardedAd.addAdEventListener(AdEventType.FAILED_TO_LOAD, () => {
      isRewardedAdReady = false;
      console.warn('[StreamingRotation AdService] Rewarded ad failed to load');
    });

    rewardedAd.addAdEventListener(AdEventType.OPENED, () => {
      console.log('[StreamingRotation AdService] Rewarded ad opened');
    });

    rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[StreamingRotation AdService] Rewarded ad closed');
      isRewardedAdReady = false;
      // Preload next rewarded ad
      loadRewardedAd();
    });

    rewardedAd.addAdEventListener(AdEventType.EARNED_REWARD, () => {
      console.log('[StreamingRotation AdService] User earned reward');
      isRewardedAdReady = false;
    });

    await rewardedAd.load();
  } catch (err) {
    console.warn('[StreamingRotation AdService] Failed to load rewarded ad:', err);
  }
}

/**
 * Show a rewarded video ad. Only call if the ad is ready.
 * Returns true if the ad was shown and user earned the reward, false otherwise.
 */
export async function showRewardedAd(): Promise<boolean> {
  try {
    if (!isRewardedAdReady || !rewardedAd) {
      console.log('[StreamingRotation AdService] Rewarded ad not ready, loading first');
      await loadRewardedAd();
      return false;
    }
    await rewardedAd.show();
    return true;
  } catch (err) {
    console.warn('[StreamingRotation AdService] Failed to show rewarded ad:', err);
    isRewardedAdReady = false;
    return false;
  }
}

/**
 * Check if a rewarded ad is currently ready to show.
 */
export function isRewardedAdReady(): boolean {
  return isRewardedAdReady;
}

/**
 * Initialize all ad services. Call once on app launch.
 */
export function initAdService(): void {
  console.log('[StreamingRotation AdService] Initializing ad services');
  loadRewardedAd();
}
