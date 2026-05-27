import React from 'react';
import { Text, View } from 'react-native';
import { RARITY_COLORS, Rarity } from '@/lib/gameLogic';

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  const color = RARITY_COLORS[rarity];
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        backgroundColor: `${color}22`,
        borderWidth: 1,
        borderColor: color,
      }}
    >
      <Text style={{ color, fontWeight: '800', fontSize: 11, letterSpacing: 1.5 }}>{rarity.toUpperCase()}</Text>
    </View>
  );
}
