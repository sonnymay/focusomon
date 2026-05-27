import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { GlassCard } from '@/components/GlassCard';
import { NeonButton } from '@/components/NeonButton';
import { LevelBadge } from '@/components/LevelBadge';
import { RarityBadge } from '@/components/RarityBadge';
import { CreatureImage } from '@/components/CreatureImage';
import { StatBar } from '@/components/StatBar';
import { useUserStore, useDerivedLevel, useDerivedStats } from '@/store/useUserStore';

const LORES = [
  'Born from a meteor that struck a forgotten temple, your companion harbors ancient discipline.',
  'Forged in the fires of countless focus sessions, its will mirrors yours.',
  'Whispers say its bloodline traces to the first mortal who chose effort over comfort.',
];

const ACHIEVEMENTS = [
  { key: 'first-session', label: 'First Focus', icon: '🔥' },
  { key: 'streak-3', label: '3-Day Streak', icon: '⚡' },
  { key: 'level-5', label: 'Reached Lv.5', icon: '⭐' },
  { key: 'egg-pull', label: 'First Egg', icon: '🥚' },
];

export default function Creature() {
  const user = useUserStore();
  const { level } = useDerivedLevel();
  const stats = useDerivedStats();
  const [loreOpen, setLoreOpen] = useState(false);
  const lore = LORES[Math.abs(user.trainerId.length) % LORES.length];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: '#22D3EE', fontWeight: '800', fontSize: 16 }}>← BACK</Text>
          </Pressable>
          <RarityBadge rarity={user.rarityTier} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <LevelBadge level={level} size="lg" />
          <Text style={{ color: '#F8FAFC', fontSize: 22, fontWeight: '900', letterSpacing: 2 }}>
            {(user.username || 'Companion').toUpperCase()}
          </Text>
        </View>
        <Text style={{ color: '#94A3B8', fontSize: 12 }}>{user.trainerId}</Text>

        <View style={{ alignItems: 'center', marginVertical: 24 }}>
          <View
            style={{
              width: 220,
              height: 24,
              borderRadius: 200,
              backgroundColor: 'rgba(124,58,237,0.2)',
              shadowColor: '#7C3AED',
              shadowOpacity: 0.6,
              shadowRadius: 14,
              transform: [{ translateY: 110 }, { scaleX: 1.2 }],
            }}
          />
          <CreatureImage level={level} lineage={user.lineage} size={200} />
        </View>

        <GlassCard>
          <Text style={{ color: '#94A3B8', fontSize: 11, letterSpacing: 3, fontWeight: '800', marginBottom: 8 }}>STATS</Text>
          <StatBar label="Focus Power" value={stats.focusPower} color="#22D3EE" />
          <StatBar label="Discipline" value={stats.discipline} color="#7C3AED" />
          <StatBar label="Intensity" value={stats.intensity} color="#EF4444" />
          <StatBar label="Rarity Score" value={user.rarityScore ?? 50} color="#F59E0B" />
        </GlassCard>

        <GlassCard style={{ marginTop: 16 }}>
          <Text style={{ color: '#94A3B8', fontSize: 11, letterSpacing: 3, fontWeight: '800', marginBottom: 12 }}>ACHIEVEMENTS</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {ACHIEVEMENTS.map((a) => (
              <View key={a.key} style={{ alignItems: 'center', width: 70 }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: 'rgba(34,211,238,0.15)',
                    borderWidth: 1,
                    borderColor: '#22D3EE',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{a.icon}</Text>
                </View>
                <Text style={{ color: '#94A3B8', fontSize: 9, letterSpacing: 1, marginTop: 6, textAlign: 'center' }}>
                  {a.label}
                </Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <View style={{ marginTop: 24 }}>
          <NeonButton label="VIEW LORE" variant="ghost" fullWidth onPress={() => setLoreOpen(true)} />
        </View>
      </ScrollView>

      <Modal visible={loreOpen} transparent animationType="fade" onRequestClose={() => setLoreOpen(false)}>
        <Pressable onPress={() => setLoreOpen(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 }}>
          <GlassCard>
            <Text style={{ color: '#F59E0B', fontWeight: '900', fontSize: 18, letterSpacing: 3, marginBottom: 12 }}>LORE</Text>
            <Text style={{ color: '#F8FAFC', fontSize: 16, lineHeight: 24, fontStyle: 'italic' }}>{lore}</Text>
          </GlassCard>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
