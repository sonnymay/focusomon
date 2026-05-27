-- FocusMon Supabase schema
-- Paste into the SQL editor at https://supabase.com/dashboard

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default '',
  trainer_id text not null default '',
  lineage text not null default 'Fire',
  level int not null default 1,
  current_xp int not null default 0,
  xp_to_next_level int not null default 300,
  focus_coins int not null default 0,
  total_focus_hours numeric not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  focus_power int not null default 20,
  discipline int not null default 15,
  intensity int not null default 25,
  rarity_score int not null default 50,
  rarity_tier text not null default 'Common',
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_type text not null,
  duration_minutes int not null,
  xp_earned int not null default 0,
  coins_earned int not null default 0,
  completed boolean not null default false,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists public.creatures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lineage text not null,
  level int not null default 1,
  name text not null,
  is_active boolean not null default false,
  obtained_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_key)
);

-- RLS
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.creatures enable row level security;
alter table public.achievements enable row level security;

create policy "users self" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "sessions self" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "creatures self" on public.creatures
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "achievements self" on public.achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
