import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { GlassCard } from '@/components/GlassCard';
import { NeonButton } from '@/components/NeonButton';
import { LevelBadge } from '@/components/LevelBadge';
import { CreatureImage } from '@/components/CreatureImage';
import { RarityBadge } from '@/components/RarityBadge';
import { useUserStore, useDerivedLevel } from '@/store/useUserStore';

export default function Profile() {
  const user = useUserStore();
  const setUsername = useUserStore((s) => s.setUsername);
  const setTitle = useUserStore((s) => s.setTitle);
  const { level } = useDerivedLevel();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(user.username);
  const [draftTitle, setDraftTitle] = useState(user.title);
  const cardRef = useRef<View>(null);

  const share = async () => {
    try {
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch {}
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ color: '#F8FAFC', fontSize: 28, fontWeight: '900', letterSpacing: 3, marginBottom: 16 }}>PROFILE</Text>

        <ViewShot ref={cardRef as any} options={{ format: 'png', quality: 1 }}>
          <View style={{ backgroundColor: '#0A0A1A', padding: 20 }}>
            <GlassCard glow="#22D3EE">
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <CreatureImage level={level} lineage={user.lineage} size={140} />
              </View>
              <Text style={{ color: '#F8FAFC', fontSize: 24, fontWeight: '900', textAlign: 'center', letterSpacing: 2 }}>
                {user.username.toUpperCase() || 'TRAINER'}
              </Text>
              <Text style={{ color: '#22D3EE', fontSize: 12, textAlign: 'center', letterSpacing: 2, marginTop: 4 }}>
                {user.title.toUpperCase()}
              </Text>
              <Text style={{ color: '#94A3B8', fontSize: 11, textAlign: 'center', marginTop: 6 }}>{user.trainerId}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                <StatCol label="HOURS" value={user.totalFocusHours.toFixed(1)} />
                <StatCol label="STREAK" value={user.currentStreak.toString()} />
                <StatCol label="LEVEL" value={level.toString()} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 8 }}>
                <RarityBadge rarity={user.rarityTier} />
                <LevelBadge level={level} />
              </View>
            </GlassCard>
          </View>
        </ViewShot>

        <View style={{ marginTop: 16 }}>
          <NeonButton label="SHARE CARD" variant="primary" fullWidth onPress={share} />
        </View>

        <GlassCard style={{ marginTop: 24 }}>
          <Text style={{ color: '#94A3B8', fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>EDIT</Text>
          {editing ? (
            <>
              <TextInput
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Username"
                placeholderTextColor="#475569"
                style={inputStyle}
              />
              <TextInput
                value={draftTitle}
                onChangeText={setDraftTitle}
                placeholder="Title"
                placeholderTextColor="#475569"
                style={inputStyle}
              />
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable onPress={() => setEditing(false)} style={{ flex: 1 }}>
                  <View style={{ paddingVertical: 12, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#475569' }}>
                    <Text style={{ color: '#94A3B8', fontWeight: '700' }}>CANCEL</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setUsername(draftName);
                    setTitle(draftTitle);
                    setEditing(false);
                  }}
                  style={{ flex: 1 }}
                >
                  <View style={{ paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#22C55E' }}>
                    <Text style={{ color: '#04210E', fontWeight: '800' }}>SAVE</Text>
                  </View>
                </Pressable>
              </View>
            </>
          ) : (
            <Pressable onPress={() => setEditing(true)}>
              <Text style={{ color: '#22D3EE', fontWeight: '700' }}>Edit name & title →</Text>
            </Pressable>
          )}
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const inputStyle = {
  backgroundColor: 'rgba(30,30,60,0.55)',
  borderWidth: 1,
  borderColor: '#7C3AED',
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 10,
  color: '#F8FAFC',
  marginBottom: 10,
} as const;

function StatCol({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: '#F8FAFC', fontSize: 20, fontWeight: '900' }}>{value}</Text>
      <Text style={{ color: '#94A3B8', fontSize: 10, letterSpacing: 2, marginTop: 2 }}>{label}</Text>
    </View>
  );
}
