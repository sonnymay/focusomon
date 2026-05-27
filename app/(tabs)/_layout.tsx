import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function Icon({ char, color }: { char: string; color: string | unknown }) {
  return <Text style={{ fontSize: 20, color: color as string }}>{char}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0A1A',
          borderTopColor: '#1F2240',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#22D3EE',
        tabBarInactiveTintColor: '#475569',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'HOME', tabBarIcon: ({ color }) => <Icon char="🏠" color={color} /> }} />
      <Tabs.Screen name="quests" options={{ title: 'QUESTS', tabBarIcon: ({ color }) => <Icon char="🗡️" color={color} /> }} />
      <Tabs.Screen name="journal" options={{ title: 'JOURNAL', tabBarIcon: ({ color }) => <Icon char="📖" color={color} /> }} />
      <Tabs.Screen name="vault" options={{ title: 'VAULT', tabBarIcon: ({ color }) => <Icon char="🥚" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'PROFILE', tabBarIcon: ({ color }) => <Icon char="👤" color={color} /> }} />
    </Tabs>
  );
}
