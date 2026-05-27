import React from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

type Variant = 'cta' | 'primary' | 'danger' | 'ghost' | 'gold';

const COLORS: Record<Variant, { bg: string; text: string; glow: string }> = {
  cta: { bg: '#22C55E', text: '#04210E', glow: '#22C55E' },
  primary: { bg: '#7C3AED', text: '#F8FAFC', glow: '#7C3AED' },
  danger: { bg: '#EF4444', text: '#FFF', glow: '#EF4444' },
  ghost: { bg: 'transparent', text: '#F8FAFC', glow: '#22D3EE' },
  gold: { bg: '#F59E0B', text: '#1A1300', glow: '#F59E0B' },
};

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function NeonButton({ label, onPress, variant = 'primary', disabled, fullWidth, style }: Props) {
  const c = COLORS[variant];
  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'center',
        },
        style,
      ]}
    >
      <View
        style={{
          backgroundColor: c.bg,
          borderColor: variant === 'ghost' ? c.glow : 'transparent',
          borderWidth: variant === 'ghost' ? 1 : 0,
          paddingHorizontal: 28,
          paddingVertical: 16,
          borderRadius: 999,
          shadowColor: c.glow,
          shadowOpacity: 0.6,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 0 },
          elevation: 8,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: c.text,
            fontWeight: '800',
            letterSpacing: 1.5,
            fontSize: 16,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
