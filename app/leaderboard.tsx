import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LevelBadge } from '@/components/LevelBadge';
import { GlassCard } from '@/components/GlassCard';
import { useUserStore, useDerivedLevel } from '@/store/useUserStore';

const MOCK = [
  { rank: 1, name: 'ShadowReaper', level: 19, hours: 42.5, avatar: '👹' },
  { rank: 2, name: 'AquaSenpai', level: 16, hours: 36.1, avatar: '🐉' },
  { rank: 3, name: 'IronMonk', level: 14, hours: 31.4, avatar: '🦎' },
  { rank: 4, name: 'NyxWanderer', level: 12, hours: 24.8, avatar: '🦇' },
  { rank: 5, name: 'GreenLeaf', level: 9, hours: 18.0, avatar: '🌿' },
];

export default function Leaderboard() {
  const me = useUserStore();
  const { level: myLevel } = useDerivedLevel();
  const myEntry = { rank: 99, name: me.username || 'You', level: myLevel, hours: me.totalFocusHours, avatar: '⚔️', isMe: true };

  const rows = [...MOCK.map((m) => ({ ...m, isMe: false })), myEntry];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Text style={{ color: '#22D3EE', fontWeight: '800', fontSize: 16 }}>← BACK</Text>
        </Pressable>
        <Text style={{ color: '#F8FAFC', fontSize: 28, fontWeight: '900', letterSpacing: 3 }}>THIS WEEK'S GRIND</Text>
        <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 4, marginBottom: 24 }}>Compete. Focus. Level up.</Text>

        {rows.map((r, i) => {
          const gold = r.rank === 1;
          const isMe = r.isMe;
          const glow = gold ? '#F59E0B' : isMe ? '#22D3EE' : '#7C3AED';
          return (
            <GlassCard key={i} glow={glow} selected={gold || isMe} style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ color: gold ? '#F59E0B' : '#F8FAFC', fontSize: 20, fontWeight: '900', width: 36 }}>
                {gold ? '👑' : `#${r.rank}`}
              </Text>
              <Text style={{ fontSize: 28 }}>{r.avatar}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F8FAFC', fontWeight: '800', fontSize: 15 }}>{r.name}</Text>
                <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>{r.hours.toFixed(1)}h focused</Text>
              </View>
              <LevelBadge level={r.level} />
            </GlassCard>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
