import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, withDelay } from 'react-native-reanimated';
import { GlassCard } from '@/components/GlassCard';
import { NeonButton } from '@/components/NeonButton';
import { RarityBadge } from '@/components/RarityBadge';
import { ParticleBurst } from '@/components/ParticleBurst';
import { useUserStore } from '@/store/useUserStore';
import { useCreatureStore } from '@/store/useCreatureStore';
import { EGG_COSTS, EggTier, RARITY_COLORS, pullEgg, Rarity } from '@/lib/gameLogic';
import { randomName } from '@/lib/utils';

const EGGS: { tier: EggTier; emoji: string; subtitle: string }[] = [
  { tier: 'Common', emoji: '🥚', subtitle: 'A standard egg.' },
  { tier: 'Rare', emoji: '🪺', subtitle: 'Better odds. Shinier.' },
  { tier: 'Legendary', emoji: '✨', subtitle: 'A myth in your hand.' },
];

export default function Vault() {
  const coins = useUserStore((s) => s.focusCoins);
  const spend = useUserStore((s) => s.spendCoins);
  const lineage = useUserStore((s) => s.lineage);
  const addCreature = useCreatureStore((s) => s.addCreature);

  const [result, setResult] = useState<{ rarity: Rarity; name: string } | null>(null);
  const [cracking, setCracking] = useState(false);
  const shake = useSharedValue(0);
  const scale = useSharedValue(1);

  const eggStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: scale.value }],
  }));

  const openEgg = async (tier: EggTier) => {
    const cost = EGG_COSTS[tier];
    if (!spend(cost)) return;
    setCracking(true);
    shake.value = withSequence(
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(0, { duration: 80 }),
    );
    scale.value = withSequence(withTiming(1.2, { duration: 400 }), withDelay(200, withTiming(0, { duration: 300 })));
    const rarity = pullEgg(tier);
    const name = randomName(lineage);
    setTimeout(async () => {
      await addCreature({ name, lineage, rarity, level: 1 });
      setResult({ rarity, name });
      setCracking(false);
      scale.value = 1;
    }, 1100);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#F8FAFC', fontSize: 26, fontWeight: '900', letterSpacing: 3 }}>EGG VAULT</Text>
          <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(245,158,11,0.15)', borderWidth: 1, borderColor: '#F59E0B' }}>
            <Text style={{ color: '#F59E0B', fontWeight: '800' }}>💰 {coins}</Text>
          </View>
        </View>
        <Text style={{ color: '#94A3B8', marginVertical: 8, marginBottom: 24 }}>Summon companions. Power your journey.</Text>

        {EGGS.map((e) => {
          const cost = EGG_COSTS[e.tier];
          const canAfford = coins >= cost;
          return (
            <GlassCard key={e.tier} glow={RARITY_COLORS[e.tier === 'Legendary' ? 'Legendary' : e.tier === 'Rare' ? 'Rare' : 'Common']} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <Text style={{ fontSize: 48 }}>{e.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#F8FAFC', fontWeight: '800', fontSize: 16, letterSpacing: 2 }}>{e.tier.toUpperCase()} EGG</Text>
                  <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 4 }}>{e.subtitle}</Text>
                  <Text style={{ color: '#F59E0B', fontSize: 13, marginTop: 6, fontWeight: '700' }}>{cost} 💰</Text>
                </View>
              </View>
              <View style={{ marginTop: 12 }}>
                <NeonButton label={canAfford ? 'OPEN EGG' : 'NOT ENOUGH COINS'} variant={canAfford ? 'primary' : 'ghost'} disabled={!canAfford} onPress={() => openEgg(e.tier)} fullWidth />
              </View>
            </GlassCard>
          );
        })}
      </ScrollView>

      <Modal visible={cracking || !!result} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', alignItems: 'center', justifyContent: 'center' }}>
          {cracking ? (
            <Animated.Text style={[{ fontSize: 120 }, eggStyle]}>🥚</Animated.Text>
          ) : result ? (
            <View style={{ alignItems: 'center' }}>
              <ParticleBurst colors={[RARITY_COLORS[result.rarity], '#F8FAFC']} />
              <Text style={{ fontSize: 80 }}>{result.rarity === 'Legendary' ? '👑' : '✨'}</Text>
              <Text style={{ color: RARITY_COLORS[result.rarity], fontWeight: '900', fontSize: 28, letterSpacing: 4, marginTop: 12 }}>
                {result.rarity.toUpperCase()}
              </Text>
              <Text style={{ color: '#F8FAFC', fontSize: 20, fontWeight: '700', marginTop: 8 }}>{result.name}</Text>
              <View style={{ marginTop: 32 }}>
                <NeonButton label="ADD TO COLLECTION" variant="cta" onPress={() => setResult(null)} />
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
