import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';

function Particle({ angle, color, distance, delay }: { angle: number; color: string; distance: number; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) }));
  }, [t, delay]);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(angle) * distance * t.value },
      { translateY: Math.sin(angle) * distance * t.value },
      { scale: 1 - t.value * 0.5 },
    ],
    opacity: 1 - t.value,
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 1,
          shadowRadius: 8,
        },
        style,
      ]}
    />
  );
}

export function ParticleBurst({ count = 20, colors = ['#F59E0B', '#22D3EE', '#7C3AED'] }: { count?: number; colors?: string[] }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Particle
          key={i}
          angle={(i / count) * Math.PI * 2}
          color={colors[i % colors.length]}
          distance={120 + Math.random() * 80}
          delay={Math.random() * 200}
        />
      ))}
    </View>
  );
}
