import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rarity, Lineage } from '@/lib/gameLogic';
import { supabase } from '@/lib/supabase';
import { useUserStore } from './useUserStore';

export type Creature = {
  id: string;
  name: string;
  lineage: Lineage;
  rarity: Rarity;
  level: number;
  obtainedAt: string;
  isActive: boolean;
};

type CreatureState = {
  collection: Creature[];
  addCreature: (c: Omit<Creature, 'id' | 'obtainedAt' | 'isActive'>) => Promise<Creature>;
  setActive: (id: string) => void;
};

export const useCreatureStore = create<CreatureState>()(
  persist(
    (set, get) => ({
      collection: [],
      addCreature: async (c) => {
        const creature: Creature = {
          ...c,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          obtainedAt: new Date().toISOString(),
          isActive: get().collection.length === 0,
        };
        set({ collection: [...get().collection, creature] });
        const userId = useUserStore.getState().id;
        if (supabase && userId) {
          try {
            await supabase.from('creatures').insert({
              user_id: userId,
              lineage: creature.lineage,
              level: creature.level,
              name: creature.name,
              is_active: creature.isActive,
            });
          } catch {}
        }
        return creature;
      },
      setActive: (id) =>
        set({
          collection: get().collection.map((c) => ({ ...c, isActive: c.id === id })),
        }),
    }),
    {
      name: 'focusmon-creatures',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
