import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressRing } from '@/components/ProgressRing';
import { NeonButton } from '@/components/NeonButton';
import { GlassCard } from '@/components/GlassCard';
import { LevelBadge } from '@/components/LevelBadge';
import { StreakFlame } from '@/components/StreakFlame';
import { CreatureImage } from '@/components/CreatureImage';
import { useUserStore, useDerivedLevel } from '@/store/useUserStore';
import { useSessionStore, SessionType } from '@/store/useSessionStore';
import { SessionDuration } from '@/lib/gameLogic';

const SESSION_TYPES: SessionType[] = ['Study', 'Work', 'Exercise', 'Meditation'];
const DURATIONS: SessionDuration[] = [15, 30, 45, 60];

export default function Home() {
  const user = useUserStore();
  const { level, xpIntoLevel, xpToNext, progress } = useDerivedLevel();
  const setup = useSessionStore((s) => s.setup);
  const start = useSessionStore((s) => s.start);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [chosenType, setChosenType] = useState<SessionType>('Study');
  const [chosenMinutes, setChosenMinutes] = useState<SessionDuration>(25 as SessionDuration);

  const dailyPct = Math.min(100, Math.round((user.dailyMinutesToday / user.dailyGoalMinutes) * 100));

  const beginSession = () => {
    setup(chosenType, chosenMinutes);
    start();
    setPickerOpen(false);
    router.push('/focus');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View>
            <Text style={{ color: '#94A3B8', fontSize: 12, letterSpacing: 2 }}>TRAINER</Text>
            <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '800' }}>{user.username || 'Anon'}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <LevelBadge level={level} />
            <StreakFlame streak={user.currentStreak} lastSessionAt={user.lastSessionAt} />
          </View>
        </View>

        <LinearGradient
          colors={['rgba(124,58,237,0.18)', 'transparent']}
          style={{ borderRadius: 200, alignItems: 'center', paddingVertical: 24, marginBottom: 8 }}
        >
          <Pressable onPress={() => router.push('/creature')}>
            <CreatureImage level={level} lineage={user.lineage} size={180} />
          </Pressable>
        </LinearGradient>

        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <ProgressRing size={200} progress={progress} color="#22D3EE">
            <Text style={{ color: '#F8FAFC', fontSize: 22, fontWeight: '900' }}>{xpIntoLevel} / {xpToNext}</Text>
            <Text style={{ color: '#94A3B8', fontSize: 11, letterSpacing: 2, marginTop: 4 }}>XP</Text>
            <Text style={{ color: '#22D3EE', fontSize: 11, marginTop: 8, letterSpacing: 1 }}>
              DAILY GOAL: {dailyPct}%
            </Text>
          </ProgressRing>
        </View>

        <GlassCard style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 }}>
          <Stat label="COINS" value={user.focusCoins} />
          <Stat label="HOURS" value={user.totalFocusHours.toFixed(1)} />
          <Stat label="BEST" value={user.longestStreak} />
        </GlassCard>

        <NeonButton label="START FOCUS" variant="cta" fullWidth onPress={() => setPickerOpen(true)} />

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
          <Pressable onPress={() => router.push('/leaderboard')} style={{ flex: 1 }}>
            <GlassCard style={{ alignItems: 'center', paddingVertical: 16 }}>
              <Text style={{ fontSize: 22 }}>🏆</Text>
              <Text style={{ color: '#F8FAFC', fontSize: 11, letterSpacing: 1.5, marginTop: 4, fontWeight: '700' }}>LEADERBOARD</Text>
            </GlassCard>
          </Pressable>
          <Pressable onPress={() => router.push('/creature')} style={{ flex: 1 }}>
            <GlassCard style={{ alignItems: 'center', paddingVertical: 16 }}>
              <Text style={{ fontSize: 22 }}>🛡️</Text>
              <Text style={{ color: '#F8FAFC', fontSize: 11, letterSpacing: 1.5, marginTop: 4, fontWeight: '700' }}>CREATURE</Text>
            </GlassCard>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => setPickerOpen(false)} />
        <View style={{ backgroundColor: '#13132A', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '800', marginBottom: 16, letterSpacing: 2 }}>SESSION TYPE</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SESSION_TYPES.map((t) => (
              <Pressable key={t} onPress={() => setChosenType(t)} style={{ flexBasis: '47%' }}>
                <GlassCard selected={chosenType === t} style={{ alignItems: 'center', paddingVertical: 14 }}>
                  <Text style={{ color: '#F8FAFC', fontWeight: '700', letterSpacing: 1 }}>{t.toUpperCase()}</Text>
                </GlassCard>
              </Pressable>
            ))}
          </View>
          <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '800', marginVertical: 16, letterSpacing: 2 }}>DURATION</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {DURATIONS.map((m) => (
              <Pressable key={m} onPress={() => setChosenMinutes(m)} style={{ flex: 1 }}>
                <GlassCard selected={chosenMinutes === m} glow="#22D3EE" style={{ alignItems: 'center', paddingVertical: 14 }}>
                  <Text style={{ color: '#F8FAFC', fontWeight: '800' }}>{m}m</Text>
                </GlassCard>
              </Pressable>
            ))}
          </View>
          <View style={{ marginTop: 24, marginBottom: 24 }}>
            <NeonButton label="LET'S GO" variant="cta" fullWidth onPress={beginSession} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '900' }}>{value}</Text>
      <Text style={{ color: '#94A3B8', fontSize: 10, letterSpacing: 1.5, marginTop: 2 }}>{label}</Text>
    </View>
  );
}
