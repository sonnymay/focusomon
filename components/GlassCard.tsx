import React from 'react';
import { View, ViewProps } from 'react-native';

type Props = ViewProps & {
  glow?: string;
  selected?: boolean;
};

export function GlassCard({ children, style, glow = '#7C3AED', selected, ...rest }: Props) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: 'rgba(30, 30, 60, 0.55)',
          borderRadius: 20,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? glow : 'rgba(124,58,237,0.35)',
          padding: 16,
          shadowColor: glow,
          shadowOpacity: selected ? 0.6 : 0.25,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
