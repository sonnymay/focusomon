import React, { useState } from 'react';
import { Text, TextInput, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { GlassCard } from '@/components/GlassCard';
import { NeonButton } from '@/components/NeonButton';
import { LINEAGES, LINEAGE_ACCENTS, Lineage } from '@/lib/gameLogic';
import { useUserStore } from '@/store/useUserStore';

const LINEAGE_ICONS: Record<Lineage, string> = { Fire: '🔥', Water: '💧', Shadow: '🌑', Nature: '🌿' };

export default function Onboarding() {
  const [username, setUsername] = useState('');
  const [lineage, setLineage] = useState<Lineage>('Fire');
  const start = useUserStore((s) => s.startOnboarding);

  const onBegin = async () => {
    if (!username.trim()) return;
    await start({ username: username.trim(), lineage });
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={['#1A0A3A', '#0A0A1A', '#0A0A1A']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Text style={{ fontSize: 56 }}>⚔️</Text>
            <Text style={{ color: '#F8FAFC', fontSize: 34, fontWeight: '900', letterSpacing: 3, marginTop: 8 }}>FOCUSMON</Text>
            <Text style={{ color: '#22D3EE', fontSize: 13, letterSpacing: 4, marginTop: 6, fontWeight: '700' }}>
              FOCUS · EVOLVE · DOMINATE
            </Text>
          </View>

          <Text style={{ color: '#94A3B8', fontSize: 12, letterSpacing: 2, marginBottom: 10, fontWeight: '700' }}>
            CHOOSE YOUR LINEAGE
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
            {LINEAGES.map((l) => (
              <GlassCard
                key={l}
                glow={LINEAGE_ACCENTS[l]}
                selected={lineage === l}
                style={{ width: '47%', alignItems: 'center', paddingVertical: 22 }}
                onTouchEnd={() => setLineage(l)}
              >
                <Text style={{ fontSize: 36 }}>{LINEAGE_ICONS[l]}</Text>
                <Text style={{ color: '#F8FAFC', marginTop: 8, fontWeight: '800', letterSpacing: 2 }}>{l.toUpperCase()}</Text>
              </GlassCard>
            ))}
          </View>

          <Text style={{ color: '#94A3B8', fontSize: 12, letterSpacing: 2, marginBottom: 10, fontWeight: '700' }}>
            TRAINER NAME
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your name"
            placeholderTextColor="#475569"
            autoCapitalize="none"
            style={{
              backgroundColor: 'rgba(30,30,60,0.55)',
              borderWidth: 1,
              borderColor: '#7C3AED',
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: '#F8FAFC',
              fontSize: 16,
              marginBottom: 32,
            }}
          />

          <NeonButton
            label="Begin Your Journey"
            variant="cta"
            fullWidth
            disabled={!username.trim()}
            onPress={onBegin}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
