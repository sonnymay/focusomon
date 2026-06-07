# FocusMon

Focus-timer × RPG mobile app. React Native + Expo + Supabase + NativeWind + Zustand + Reanimated.

## Setup

```bash
cd focusmon
cp .env.example .env   # then paste your Supabase URL + anon key (optional for MVP — app works offline)
npm start              # scan QR with Expo Go
```

If Supabase env vars are blank, the app runs entirely on local AsyncStorage. Wire Supabase by:
1. Create a project at supabase.com.
2. Enable anonymous sign-ins in Auth settings.
3. Run `supabase/schema.sql` in the SQL editor.
4. Paste the URL + anon key into `.env`.

## Stack

- Expo SDK 56, Expo Router (file-based), TypeScript.
- NativeWind 4 + Tailwind 3 (design tokens in `tailwind.config.js`).
- Zustand stores in `store/` with persistence via AsyncStorage.
- Reanimated 3 for smooth animations and transitions.
- Supabase Auth + Postgres (optional; falls back to AsyncStorage offline).

## Features

- Pomodoro-style focus sessions with RPG progression
- Earn XP and level up your monster companion as you stay focused
- Unlock new monster evolutions at milestone levels
- Session history and streak tracking
- Offline-first — works without Supabase configured
- React Native Reanimated for XP ring, timer ring, level-up particles, egg crack.
- Supabase JS client + anon auth (`lib/supabase.ts`).

## Game logic

All XP/level/streak/rarity formulas live in `lib/gameLogic.ts` (single source of truth).
