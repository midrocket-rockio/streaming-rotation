import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { usePremiumStore } from '@/stores/premiumStore';
import {
  AdBanner,
  TestAdTypes,
} from 'react-native-admob-native-ads';

// Production Ad Unit IDs — replace with your real AdMob IDs
const AD_UNIT_ID =
  Platform.OS === 'android'
    ? 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'
    : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';

// Test Ad Unit IDs (Google's test IDs — safe to use in development)
const TEST_AD_UNIT_ID =
  Platform.OS === 'android'
    ? 'ca-app-pub-3940256099942544/6300978111'
    : 'ca-app-pub-3940256099942544/2934735716';

// Use test IDs in dev, real IDs in production
const IS_PRODUCTION = process.env.EXPO_PUBLIC_ADMOB_ENABLED === 'true';

/**
 * AdMobBanner — Real AdMob banner ad component.
 * Premium users see no ads. Free users see a banner at the bottom.
 */
export default function AdMobBanner() {
  const adsEnabled = usePremiumStore((s) => s.adsEnabled);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsVisible(adsEnabled);
  }, [adsEnabled]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AdBanner
        adUnitID={IS_PRODUCTION ? AD_UNIT_ID : TEST_AD_UNIT_ID}
        adType={TestAdTypes.Banner}
        size={{ width: 320, height: 50 }}
        onAdLoaded={() => {
          setIsLoaded(true);
        }}
        onAdFailedToLoad={() => {
          setIsVisible(false);
          setIsLoaded(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    backgroundColor: '#0a0a0a',
  },
});
