import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import UpgradeModal from '@/components/UpgradeModal';
import { usePremiumStore } from '@/stores/premiumStore';

export default function TabLayout() {
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const tier = usePremiumStore((s) => s.tier);
  const isPremium = usePremiumStore((s) => s.isPremium);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4ADE80',
          tabBarInactiveTintColor: '#555555',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarBackground: () => <View style={styles.tabBarBackground} />,
          contentStyle: { backgroundColor: '#0a0a0a' },
          headerStyle: {
            backgroundColor: '#1a1a2e',
            borderBottomWidth: 1,
            borderBottomColor: '#2a2a3e',
          },
          headerTitleStyle: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: '700',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setUpgradeVisible(true)}
              style={styles.proBadge}
            >
              <Text style={styles.proBadgeIcon}>
                {isPremium ? '⭐' : '👑'}
              </Text>
              <Text style={styles.proBadgeText}>
                {isPremium ? tier.toUpperCase() : 'PRO'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Rotación',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>🔄</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="services"
          options={{
            title: 'Servicios',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>📺</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="savings"
          options={{
            title: 'Ahorro',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size }}>💰</Text>
            ),
          }}
        />
      </Tabs>

      <UpgradeModal
        visible={upgradeVisible}
        onClose={() => setUpgradeVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabBarBackground: () => (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e' }} />
  ),
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isPremium ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  proBadgeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
  },
});
