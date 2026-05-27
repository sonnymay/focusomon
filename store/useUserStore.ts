import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Lineage,
  Rarity,
  applyDailyGoalBonus,
  computeStreak,
  levelFromXp,
  penaltyXp,
  statsForLevel,
  streakBroken,
  xpForDuration,
  SessionDuration,
} from '@/lib/gameLogic';
import { generateTrainerId } from '@/lib/trainerId';
import { ensureAnonSession, supabase } from '@/lib/supabase';

export type UserProfile = {
  id: string | null;
  username: string;
  title: string;
  trainerId: string;
  lineage: Lineage;
  totalXp: number;
  focusCoins: number;
  totalFocusHours: number;
  currentStreak: number;
  longestStreak: number;
  lastSessionAt: string | null;
  rarityTier: Rarity;
  rarityScore: number;
  onboarded: boolean;
  dailyGoalMinutes: number;
  dailyMinutesToday: number;
  dailyDate: string | null;
};

type SessionResult = {
  xpEarned: number;
  coinsEarned: number;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
};

type UserState = UserProfile & {
  hydrate: () => Promise<void>;
  startOnboarding: (data: { username: string; lineage: Lineage }) => Promise<void>;
  completeFocusSession: (minutes: SessionDuration) => Promise<SessionResult>;
  giveUpSession: (minutes: SessionDuration) => Promise<{ xpLost: number }>;
  spendCoins: (amount: number) => boolean;
  setUsername: (u: string) => void;
  setTitle: (t: string) => void;
  reset: () => void;
};

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const defaults = (): UserProfile => ({
  id: null,
  username: '',
  title: 'Aspiring Trainer',
  trainerId: generateTrainerId(),
  lineage: 'Fire',
  totalXp: 0,
  focusCoins: 0,
  totalFocusHours: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionAt: null,
  rarityTier: 'Common',
  rarityScore: 50,
  onboarded: false,
  dailyGoalMinutes: 60,
  dailyMinutesToday: 0,
  dailyDate: null,
});

async function syncUserRow(state: UserProfile) {
  if (!supabase || !state.id) return;
  try {
    await supabase.from('users').upsert({
      id: state.id,
      username: state.username,
      trainer_id: state.trainerId,
      lineage: state.lineage,
      level: levelFromXp(state.totalXp).level,
      current_xp: state.totalXp,
      xp_to_next_level: levelFromXp(state.totalXp).xpToNext,
      focus_coins: state.focusCoins,
      total_focus_hours: state.totalFocusHours,
      current_streak: state.currentStreak,
      longest_streak: state.longestStreak,
      rarity_tier: state.rarityTier,
    });
  } catch {}
}

async function insertSessionRow(opts: {
  userId: string | null;
  type: string;
  minutes: number;
  xp: number;
  coins: number;
  completed: boolean;
  startedAt: string;
}) {
  if (!supabase || !opts.userId) return;
  try {
    await supabase.from('sessions').insert({
      user_id: opts.userId,
      session_type: opts.type,
      duration_minutes: opts.minutes,
      xp_earned: opts.xp,
      coins_earned: opts.coins,
      completed: opts.completed,
      started_at: opts.startedAt,
      ended_at: new Date().toISOString(),
    });
  } catch {}
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...defaults(),
      hydrate: async () => {
        const id = await ensureAnonSession();
        if (id) set({ id });
        if (streakBroken(get().lastSessionAt)) {
          set({ currentStreak: 0 });
        }
        if (get().dailyDate !== todayKey()) {
          set({ dailyDate: todayKey(), dailyMinutesToday: 0 });
        }
      },
      startOnboarding: async ({ username, lineage }) => {
        const id = (await ensureAnonSession()) ?? get().id;
        const next: UserProfile = {
          ...defaults(),
          id,
          username,
          lineage,
          onboarded: true,
          dailyDate: todayKey(),
        };
        set(next);
        await syncUserRow(next);
      },
      completeFocusSession: async (minutes) => {
        const state = get();
        const oldLevel = levelFromXp(state.totalXp).level;
        const base = xpForDuration(minutes);
        const willHitGoal =
          state.dailyMinutesToday + minutes >= state.dailyGoalMinutes &&
          state.dailyMinutesToday < state.dailyGoalMinutes;
        const xpEarned = applyDailyGoalBonus(base.xp, willHitGoal);
        const coinsEarned = base.coins + (willHitGoal ? Math.round(base.coins * 0.25) : 0);
        const newTotalXp = state.totalXp + xpEarned;
        const newLevel = levelFromXp(newTotalXp).level;
        const newStreak = computeStreak(state.lastSessionAt, state.currentStreak);
        const updated: Partial<UserProfile> = {
          totalXp: newTotalXp,
          focusCoins: state.focusCoins + coinsEarned,
          totalFocusHours: state.totalFocusHours + minutes / 60,
          currentStreak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          lastSessionAt: new Date().toISOString(),
          dailyMinutesToday: state.dailyMinutesToday + minutes,
          dailyDate: todayKey(),
        };
        set(updated);
        const finalState = get();
        await Promise.all([
          syncUserRow(finalState),
          insertSessionRow({
            userId: finalState.id,
            type: 'Focus',
            minutes,
            xp: xpEarned,
            coins: coinsEarned,
            completed: true,
            startedAt: new Date(Date.now() - minutes * 60_000).toISOString(),
          }),
        ]);
        return { xpEarned, coinsEarned, leveledUp: newLevel > oldLevel, oldLevel, newLevel };
      },
      giveUpSession: async (minutes) => {
        const state = get();
        const base = xpForDuration(minutes);
        const xpLost = penaltyXp(base.xp);
        const newTotalXp = Math.max(0, state.totalXp - xpLost);
        set({ totalXp: newTotalXp });
        const finalState = get();
        await Promise.all([
          syncUserRow(finalState),
          insertSessionRow({
            userId: finalState.id,
            type: 'Focus',
            minutes,
            xp: -xpLost,
            coins: 0,
            completed: false,
            startedAt: new Date().toISOString(),
          }),
        ]);
        return { xpLost };
      },
      spendCoins: (amount) => {
        const state = get();
        if (state.focusCoins < amount) return false;
        set({ focusCoins: state.focusCoins - amount });
        syncUserRow(get());
        return true;
      },
      setUsername: (u) => {
        set({ username: u });
        syncUserRow(get());
      },
      setTitle: (t) => {
        set({ title: t });
        syncUserRow(get());
      },
      reset: () => set(defaults()),
    }),
    {
      name: 'focusmon-user',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function useDerivedLevel() {
  const totalXp = useUserStore((s) => s.totalXp);
  return levelFromXp(totalXp);
}

export function useDerivedStats() {
  const lineage = useUserStore((s) => s.lineage);
  const totalXp = useUserStore((s) => s.totalXp);
  return statsForLevel(levelFromXp(totalXp).level, lineage);
}
