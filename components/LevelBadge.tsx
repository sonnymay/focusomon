import React from 'react';
import { Text, View } from 'react-native';

export function LevelBadge({ level, size = 'md' }: { level: number; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'lg' ? { px: 14, py: 6, fs: 16 } : size === 'sm' ? { px: 8, py: 3, fs: 11 } : { px: 10, py: 4, fs: 13 };
  return (
    <View
      style={{
        paddingHorizontal: dims.px,
        paddingVertical: dims.py,
        borderRadius: 999,
        backgroundColor: 'rgba(124,58,237,0.25)',
        borderWidth: 1,
        borderColor: '#7C3AED',
      }}
    >
      <Text style={{ color: '#F8FAFC', fontWeight: '800', fontSize: dims.fs, letterSpacing: 1 }}>
        LV.{level}
      </Text>
    </View>
  );
}
