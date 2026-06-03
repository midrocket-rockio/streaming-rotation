import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRotationStore } from '@/stores/rotationStore';

// Prevent splash from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Initialize store data
    const store = useRotationStore.getState();
    if (store.rotationPlan.length === 0) {
      store.buildRotationPlan();
    }
    store.calculateSavings();

    // Hide splash after initialization
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      />
    </GestureHandlerRootView>
  );
}
