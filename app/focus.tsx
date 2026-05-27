import React, { useState, useCallback } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ProgressRing } from '@/components/ProgressRing';
import { NeonButton } from '@/components/NeonButton';
import { GlassCard } from '@/components/GlassCard';
import { CreatureImage } from '@/components/CreatureImage';
import { useSessionStore } from '@/store/useSessionStore';
import { useUserStore, useDerivedLevel } from '@/store/useUserStore';
import { useCountdown } from '@/hooks/useTimer';
import { formatTime } from '@/lib/utils';

export default function Focus() {
  const session = useSessionStore();
  const { level } = useDerivedLevel();
  const lineage = useUserStore((s) => s.lineage);
  const complete = useUserStore((s) => s.completeFocusSession);
  const giveUp = useUserStore((s) => s.giveUpSession);

  const durationMs = session.durationMinutes * 60 * 1000;
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [resultModal, setResultModal] = useState<null | { xp: number; coins: number; leveledUp: boolean; newLevel: number; oldLevel: number; lost?: number }>(null);

  const onComplete = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const r = await complete(session.durationMinutes);
    session.clear();
    if (r.leveledUp) {
      router.replace({ pathname: '/level-up', params: { oldLevel: String(r.oldLevel), newLevel: String(r.newLevel) } });
    } else {
      setResultModal({ xp: r.xpEarned, coins: r.coinsEarned, leveledUp: false, newLevel: r.newLevel, oldLevel: r.oldLevel });
    }
  }, [complete, session]);

  const { remaining, progress } = useCountdown(durationMs, session.startedAtMs, onComplete);

  const onQuit = async () => {
    const { xpLost } = await giveUp(session.durationMinutes);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    session.clear();
    setConfirmQuit(false);
    setResultModal({ xp: 0, coins: 0, leveledUp: false, newLevel: level, oldLevel: level, lost: xpLost });
  };

  const closeResult = () => {
    setResultModal(null);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', padding: 24 }}>
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#94A3B8', fontSize: 12, letterSpacing: 3 }}>FOCUS SESSION</Text>
          <Text style={{ color: '#22D3EE', fontSize: 22, fontWeight: '900', letterSpacing: 4, marginTop: 4 }}>
            {session.type.toUpperCase()}
          </Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <ProgressRing size={300} strokeWidth={16} progress={progress} color="#22D3EE">
            <CreatureImage level={level} lineage={lineage} size={140} mood="meditate" />
            <Text style={{ color: '#F8FAFC', fontSize: 38, fontWeight: '900', letterSpacing: 2, marginTop: 12 }}>
              {formatTime(remaining / 1000)}
            </Text>
          </ProgressRing>
          <Text style={{ color: '#94A3B8', fontSize: 13, marginTop: 18, fontStyle: 'italic' }}>
            Don't quit. Your creature is watching.
          </Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <NeonButton label="GIVE UP" variant="danger" onPress={() => setConfirmQuit(true)} />
        </View>
      </View>

      <Modal visible={confirmQuit} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 }}>
          <GlassCard glow="#EF4444" style={{ padding: 24 }}>
            <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 20, letterSpacing: 2, textAlign: 'center' }}>WARNING</Text>
            <Text style={{ color: '#F8FAFC', fontSize: 16, textAlign: 'center', marginTop: 12 }}>
              Your creature will be weakened. Are you sure?
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
              <View style={{ flex: 1 }}>
                <NeonButton label="STAY" variant="cta" fullWidth onPress={() => setConfirmQuit(false)} />
              </View>
              <View style={{ flex: 1 }}>
                <NeonButton label="QUIT" variant="danger" fullWidth onPress={onQuit} />
              </View>
            </View>
          </GlassCard>
        </View>
      </Modal>

      <Modal visible={!!resultModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 24 }}>
          {resultModal && (
            <GlassCard glow={resultModal.lost ? '#EF4444' : '#22C55E'} style={{ padding: 24, alignItems: 'center' }}>
              {resultModal.lost ? (
                <>
                  <Text style={{ fontSize: 64 }}>😢</Text>
                  <Text style={{ color: '#EF4444', fontSize: 24, fontWeight: '900', marginTop: 12, letterSpacing: 2 }}>WEAKENED</Text>
                  <Text style={{ color: '#F8FAFC', marginTop: 8 }}>-{resultModal.lost} XP</Text>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 64 }}>✨</Text>
                  <Text style={{ color: '#22C55E', fontSize: 24, fontWeight: '900', marginTop: 12, letterSpacing: 2 }}>SESSION COMPLETE</Text>
                  <Text style={{ color: '#F8FAFC', fontSize: 18, marginTop: 8 }}>+{resultModal.xp} XP</Text>
                  <Text style={{ color: '#F59E0B', fontSize: 16, marginTop: 4 }}>+{resultModal.coins} 💰</Text>
                </>
              )}
              <View style={{ marginTop: 24 }}>
                <NeonButton label="CONTINUE" variant="cta" onPress={closeResult} />
              </View>
            </GlassCard>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
