import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/GlassCard';

const QUESTS = [
  { title: 'Complete 3 focus sessions', reward: '+100 XP', done: false },
  { title: 'Hit your daily goal', reward: '+50 Coins', done: false },
  { title: 'Maintain a 7-day streak', reward: 'Rare Egg', done: false },
];

export default function Quests() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ color: '#F8FAFC', fontSize: 28, fontWeight: '900', letterSpacing: 3, marginBottom: 4 }}>QUESTS</Text>
        <Text style={{ color: '#94A3B8', marginBottom: 24 }}>Daily missions. Earn rewards.</Text>
        {QUESTS.map((q, i) => (
          <GlassCard key={i} style={{ marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#F8FAFC', fontWeight: '700', fontSize: 14 }}>{q.title}</Text>
              <Text style={{ color: '#22D3EE', fontSize: 12, marginTop: 4 }}>{q.reward}</Text>
            </View>
            <Text style={{ fontSize: 18 }}>{q.done ? '✅' : '⏳'}</Text>
          </GlassCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
