import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePremiumStore } from '@/stores/premiumStore';

/**
 * AdMobBanner — Banner ad component.
 * In production, replace with `react-native-google-mobile-ads`.
 * This is a placeholder that shows a mock ad banner for free users.
 * Premium users see no ads.
 */
export default function AdMobBanner() {
  const adsEnabled = usePremiumStore((s) => s.adsEnabled);

  if (!adsEnabled) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => {
        // In production: AdMob ad tap handler
      }}
    >
      <View style={styles.adBadge}>
        <Text style={styles.adText}>AD</Text>
      </View>
      <View style={styles.adContent}>
        <Text style={styles.adTitle}>🚀 Elimina los anuncios y desbloquea IA</Text>
        <Text style={styles.adSubtitle}>
          Streaming Rotation Pro desde $2.99/mes
        </Text>
      </View>
      <View style={styles.upgradeBtn}>
        <Text style={styles.upgradeBtnText}>Mejorar</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  adBadge: {
    backgroundColor: '#333344',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
  },
  adText: {
    color: '#888888',
    fontSize: 10,
    fontWeight: '700',
  },
  adContent: {
    flex: 1,
  },
  adTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  adSubtitle: {
    color: '#888888',
    fontSize: 12,
    marginTop: 2,
  },
  upgradeBtn: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  upgradeBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
  },
});
