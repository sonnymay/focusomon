import React from 'react';
import { Text, View } from 'react-native';
import { streakBroken } from '@/lib/gameLogic';

export function StreakFlame({ streak, lastSessionAt }: { streak: number; lastSessionAt: string | null }) {
  const broken = streakBroken(lastSessionAt);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: broken ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)',
        borderWidth: 1,
        borderColor: broken ? '#EF4444' : '#F59E0B',
      }}
    >
      <Text style={{ fontSize: 14 }}>{broken ? '💔' : '🔥'}</Text>
      <Text style={{ color: '#F8FAFC', fontWeight: '700', fontSize: 13 }}>{streak}</Text>
    </View>
  );
}
