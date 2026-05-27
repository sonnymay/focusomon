import { create } from 'zustand';
import { SessionDuration } from '@/lib/gameLogic';

export type SessionType = 'Study' | 'Work' | 'Exercise' | 'Meditation';

type SessionState = {
  type: SessionType;
  durationMinutes: SessionDuration;
  startedAtMs: number | null;
  setup: (type: SessionType, minutes: SessionDuration) => void;
  start: () => void;
  clear: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  type: 'Study',
  durationMinutes: 25 as SessionDuration,
  startedAtMs: null,
  setup: (type, durationMinutes) => set({ type, durationMinutes, startedAtMs: null }),
  start: () => set({ startedAtMs: Date.now() }),
  clear: () => set({ startedAtMs: null }),
}));
