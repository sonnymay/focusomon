import '../global.css';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useUserStore } from '@/store/useUserStore';

export default function RootLayout() {
  const hydrate = useUserStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#0A0A1A' },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="focus" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="level-up" options={{ presentation: 'transparentModal', animation: 'fade' }} />
            <Stack.Screen name="creature" options={{ presentation: 'card' }} />
            <Stack.Screen name="leaderboard" options={{ presentation: 'card' }} />
            <Stack.Screen name="share-card" options={{ presentation: 'transparentModal' }} />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
