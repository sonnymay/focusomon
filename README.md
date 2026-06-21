# FocusMon

![React Native](https://img.shields.io/badge/React_Native-0.85-61DAFB?style=flat-square&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-56-000020?style=flat-square&logo=expo&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-optional-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

FocusMon is an offline-first focus timer with RPG progression. Complete Pomodoro-style sessions to earn XP, collect focus coins, level up a monster companion, and optionally sync progress through Supabase.

## Features

- Pomodoro-style focus sessions with completion and give-up outcomes
- XP, levels, focus coins, streaks, and total focus-hour tracking
- Monster companion progression with level-based evolution art
- Quest, journal, profile, creature, vault, and leaderboard screens
- Offline persistence with AsyncStorage, with optional Supabase Auth/Postgres sync
- Animated timer, XP, level-up, and creature moments powered by Reanimated

## Tech Stack

| Library | Purpose |
|---|---|
| React Native | Cross-platform mobile UI |
| Expo 56 + Expo Router | App runtime, routing, native plugins, and Expo Go workflow |
| TypeScript | Typed application code and route safety |
| Supabase JS | Optional Auth and Postgres sync |
| AsyncStorage | Offline-first local persistence |
| Zustand | User, creature, and session state stores |
| NativeWind + Tailwind CSS | Utility-first styling for React Native |
| Reanimated | Smooth timer, XP, and level-up animations |

## What This Code Shows

- Mobile app structure with Expo Router and typed React Native screens
- Offline-first state design with an optional backend sync path
- Small, testable game logic for XP, levels, streaks, and creature stats
- Clean separation between UI components, stores, and shared logic
- Practical product thinking around retention loops, rewards, and progress feedback

## Getting Started

```bash
git clone https://github.com/sonnymay/focusomon.git
cd focusomon
npm install
cp .env.example .env
npm start
```

Scan the QR code with Expo Go, or run a platform target:

```bash
npm run ios
npm run android
npm run web
```

Supabase is optional for local use. With blank `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`, the app stores progress locally with AsyncStorage. To enable sync, create a Supabase project, run `supabase/schema.sql`, enable anonymous auth, and add the project URL and anon key to `.env`.

