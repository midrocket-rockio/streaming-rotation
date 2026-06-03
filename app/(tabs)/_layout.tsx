import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4ADE80',
        tabBarInactiveTintColor: '#555555',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
        contentStyle: { backgroundColor: '#0a0a0a' },
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
});
