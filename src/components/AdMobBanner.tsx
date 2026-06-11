// ─── AdMob Banner Component ─────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAdMob } from '@/services/admobService';

interface AdMobBannerProps {
  size?: 'banner' | 'large';
  onPress?: () => void;
}

export default function AdMobBanner({ size = 'banner', onPress }: AdMobBannerProps) {
  const { isLoaded, showInterstitial } = useAdMob();
  const [showAd, setShowAd] = React.useState(false);

  React.useEffect(() => {
    // Simulate ad loading delay
    const timer = setTimeout(() => setShowAd(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!showAd) return null;

  const handlePress = () => {
    if (onPress) onPress();
    showInterstitial();
  };

  return (
    <TouchableOpacity style={[styles.container, size === 'large' && styles.large]} onPress={handlePress}>
      <Text style={styles.adLabel}>AD</Text>
      <Text style={styles.adText}>
        {size === 'large'
          ? 'Upgrade to Premium for an ad-free experience!'
          : 'Try Premium — No Ads!'}
      </Text>
      <View style={styles.ctaButton}>
        <Text style={styles.ctaText}>Upgrade</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  large: {
    padding: 16,
    marginHorizontal: 16,
  },
  adLabel: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 2,
    marginRight: 8,
  },
  adText: {
    flex: 1,
    fontSize: 14,
    color: '#ccc',
  },
  ctaButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});
