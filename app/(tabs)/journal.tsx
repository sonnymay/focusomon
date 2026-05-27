import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/GlassCard';
import { useUserStore } from '@/store/useUserStore';

export default function Journal() {
  const user = useUserStore();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ color: '#F8FAFC', fontSize: 28, fontWeight: '900', letterSpacing: 3, marginBottom: 4 }}>JOURNAL</Text>
        <Text style={{ color: '#94A3B8', marginBottom: 24 }}>Your focus history.</Text>
        <GlassCard style={{ marginBottom: 12 }}>
          <Text style={{ color: '#94A3B8', fontSize: 11, letterSpacing: 2 }}>TOTAL HOURS</Text>
          <Text style={{ color: '#F8FAFC', fontSize: 26, fontWeight: '900' }}>{user.totalFocusHours.toFixed(2)}h</Text>
        </GlassCard>
        <GlassCard style={{ marginBottom: 12 }}>
          <Text style={{ color: '#94A3B8', fontSize: 11, letterSpacing: 2 }}>CURRENT STREAK</Text>
          <Text style={{ color: '#F59E0B', fontSize: 26, fontWeight: '900' }}>{user.currentStreak} 🔥</Text>
        </GlassCard>
        <GlassCard>
          <Text style={{ color: '#94A3B8', fontSize: 11, letterSpacing: 2 }}>LONGEST STREAK</Text>
          <Text style={{ color: '#F8FAFC', fontSize: 26, fontWeight: '900' }}>{user.longestStreak}</Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}
