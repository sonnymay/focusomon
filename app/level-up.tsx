import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { CreatureImage } from '@/components/CreatureImage';
import { ParticleBurst } from '@/components/ParticleBurst';
import { useUserStore } from '@/store/useUserStore';
import { statsForLevel } from '@/lib/gameLogic';

export default function LevelUp() {
  const { oldLevel: oldStr, newLevel: newStr } = useLocalSearchParams<{ oldLevel: string; newLevel: string }>();
  const oldLevel = Number(oldStr) || 1;
  const newLevel = Number(newStr) || oldLevel + 1;
  const lineage = useUserStore((s) => s.lineage);
  const titleScale = useSharedValue(0);
  const oldOpacity = useSharedValue(1);
  const newOpacity = useSharedValue(0);

  const oldStats = statsForLevel(oldLevel, lineage);
  const newStats = statsForLevel(newLevel, lineage);

  useEffect(() => {
    titleScale.value = withSequence(withTiming(1.2, { duration: 400, easing: Easing.out(Easing.cubic) }), withTiming(1, { duration: 200 }));
    oldOpacity.value = withDelay(900, withTiming(0.3, { duration: 600 }));
    newOpacity.value = withDelay(900, withTiming(1, { duration: 800 }));
    const t = setTimeout(() => router.replace('/(tabs)'), 3500);
    return () => clearTimeout(t);
  }, [oldOpacity, newOpacity, titleScale]);

  const titleStyle = useAnimatedStyle(() => ({ transform: [{ scale: titleScale.value }] }));
  const oldStyle = useAnimatedStyle(() => ({ opacity: oldOpacity.value }));
  const newStyle = useAnimatedStyle(() => ({ opacity: newOpacity.value, transform: [{ scale: 0.8 + newOpacity.value * 0.4 }] }));

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(10,10,26,0.97)', alignItems: 'center', justifyContent: 'center', padding: 24 }} onTouchEnd={() => router.replace('/(tabs)')}>
      <ParticleBurst count={28} colors={['#F59E0B', '#22D3EE', '#A855F7', '#22C55E']} />
      <Animated.Text style={[{ color: '#F59E0B', fontSize: 44, fontWeight: '900', letterSpacing: 6, textShadowColor: '#F59E0B', textShadowRadius: 20 }, titleStyle]}>
        LEVEL UP
      </Animated.Text>
      <Text style={{ color: '#F8FAFC', fontSize: 14, letterSpacing: 4, marginTop: 4 }}>LV.{oldLevel} → LV.{newLevel}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 40, gap: 20 }}>
        <Animated.View style={oldStyle}>
          <CreatureImage level={oldLevel} lineage={lineage} size={110} />
        </Animated.View>
        <Text style={{ color: '#22D3EE', fontSize: 28 }}>→</Text>
        <Animated.View style={newStyle}>
          <CreatureImage level={newLevel} lineage={lineage} size={130} />
        </Animated.View>
      </View>

      <View style={{ marginTop: 40, width: '80%' }}>
        <StatDelta label="ATK" oldVal={oldStats.atk} newVal={newStats.atk} />
        <StatDelta label="DEF" oldVal={oldStats.def} newVal={newStats.def} />
        <StatDelta label="HP" oldVal={oldStats.hp} newVal={newStats.hp} />
      </View>

      <Text style={{ color: '#22C55E', fontSize: 14, marginTop: 40, letterSpacing: 4, fontWeight: '800' }}>EVOLUTION COMPLETE!</Text>
      <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 8 }}>Tap anywhere to continue</Text>
    </View>
  );
}

function StatDelta({ label, oldVal, newVal }: { label: string; oldVal: number; newVal: number }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ color: '#94A3B8', fontWeight: '800', letterSpacing: 2 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ color: '#475569', fontWeight: '700' }}>{oldVal}</Text>
        <Text style={{ color: '#22D3EE' }}>→</Text>
        <Text style={{ color: '#22C55E', fontWeight: '900', fontSize: 16 }}>{newVal}</Text>
      </View>
    </View>
  );
}
