import React from 'react';
import { Text, View } from 'react-native';

export function StatBar({ label, value, max = 100, color = '#22D3EE' }: { label: string; value: number; max?: number; color?: string }) {
  const pct = Math.min(1, value / max);
  return (
    <View style={{ marginVertical: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
        <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>{label}</Text>
        <Text style={{ color: '#F8FAFC', fontSize: 12, fontWeight: '700' }}>{value}</Text>
      </View>
      <View style={{ height: 8, backgroundColor: '#1F2240', borderRadius: 999, overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%`, height: '100%', backgroundColor: color, shadowColor: color, shadowOpacity: 0.8, shadowRadius: 8 }} />
      </View>
    </View>
  );
}
