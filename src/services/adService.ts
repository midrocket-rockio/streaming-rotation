import { Platform } from 'react-native';
import {
  RewardedAd,
  TestAdTypes,
} from 'react-native-admob-native-ads';

// Test Ad Unit IDs (Google's test IDs — safe to use in development)
const REWARDED_AD_UNIT_ID =
  Platform.OS === 'android'
    ? 'ca-app-pub-3940256099942544/5224354917'
    : 'ca-app-pub-3940256099942544/1712485313';

let rewardedAd: RewardedAd | null = null;
let isRewardedAdReady = false;

/**
 * Load a rewarded video ad. Call early so it's ready when the user opts in.
 */
export async function loadRewardedAd(): Promise<void> {
  try {
    rewardedAd = new RewardedAd({
      adUnitID: REWARDED_AD_UNIT_ID,
      adType: TestAdTypes.Rewarded,
      onAdLoaded: () => {
        isRewardedAdReady = true;
        console.log('[StreamingRotation AdService] Rewarded ad loaded');
      },
      onAdFailedToLoad: (error) => {
        isRewardedAdReady = false;
        console.warn('[StreamingRotation AdService] Rewarded ad failed to load:', error);
      },
      onAdOpened: () => {
        console.log('[StreamingRotation AdService] Rewarded ad opened');
      },
      onAdClosed: () => {
        console.log('[StreamingRotation AdService] Rewarded ad closed');
        isRewardedAdReady = false;
        // Preload next rewarded ad
        loadRewardedAd();
      },
      onUserEarnedReward: () => {
        console.log('[StreamingRotation AdService] User earned reward');
        isRewardedAdReady = false;
      },
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
