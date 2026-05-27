import React from 'react';
import { Text, View } from 'react-native';
import { Lineage, LINEAGE_ACCENTS } from '@/lib/gameLogic';

type Props = {
  level: number;
  lineage: Lineage;
  size?: number;
  mood?: 'happy' | 'meditate' | 'sad';
};

const EMOJI: Record<Lineage, string[]> = {
  Fire: ['🥚', '🔥', '🦎', '🐲', '👹'],
  Water: ['🥚', '💧', '🐟', '🐉', '🌊'],
  Shadow: ['🥚', '🌑', '👻', '🦇', '😈'],
  Nature: ['🥚', '🌱', '🐛', '🌳', '🧚'],
};

const MOOD_FACE: Record<NonNullable<Props['mood']>, string> = {
  happy: '',
  meditate: '🧘',
  sad: '😢',
};

export function CreatureImage({ level, lineage, size = 160, mood = 'happy' }: Props) {
  const stage = Math.min(4, Math.floor((level - 1) / 5));
  const emoji = mood === 'meditate' ? MOOD_FACE.meditate : mood === 'sad' ? MOOD_FACE.sad : EMOJI[lineage][stage];
  const color = LINEAGE_ACCENTS[lineage];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${color}1A`,
        borderWidth: 2,
        borderColor: color,
        shadowColor: color,
        shadowOpacity: 0.7,
        shadowRadius: 20,
      }}
    >
      <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
      <Text
        style={{
          position: 'absolute',
          bottom: 6,
          color: '#F8FAFC',
          fontSize: 10,
          fontWeight: '800',
          letterSpacing: 1,
          opacity: 0.7,
        }}
      >
        LV.{level}
      </Text>
    </View>
  );
}
