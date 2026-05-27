export const XP_TABLE: number[] = [
  0, 300, 700, 1200, 2000, 3000, 4500, 6500, 9000, 12000,
  16000, 21000, 28000, 37000, 48000, 62000, 80000, 102000, 130000, 165000,
];

export const MAX_LEVEL = XP_TABLE.length;

export type SessionDuration = 15 | 30 | 45 | 60;

const SESSION_REWARDS: Record<SessionDuration, { xp: number; coins: number }> = {
  15: { xp: 100, coins: 10 },
  30: { xp: 250, coins: 25 },
  45: { xp: 400, coins: 40 },
  60: { xp: 600, coins: 60 },
};

export function xpForDuration(minutes: SessionDuration): { xp: number; coins: number } {
  return SESSION_REWARDS[minutes];
}

export function applyDailyGoalBonus(xp: number, hitGoal: boolean): number {
  return hitGoal ? Math.round(xp * 1.25) : xp;
}

export function penaltyXp(sessionXp: number): number {
  return Math.floor(sessionXp * 0.2);
}

export function levelFromXp(totalXp: number): {
  level: number;
  xpIntoLevel: number;
  xpToNext: number;
  progress: number;
} {
  let level = 1;
  for (let i = 0; i < XP_TABLE.length; i++) {
    if (totalXp >= XP_TABLE[i]) level = i + 1;
    else break;
  }
  const floor = XP_TABLE[level - 1];
  const ceil = XP_TABLE[level] ?? floor;
  const xpIntoLevel = totalXp - floor;
  const xpToNext = Math.max(0, ceil - floor);
  const progress = xpToNext === 0 ? 1 : xpIntoLevel / xpToNext;
  return { level, xpIntoLevel, xpToNext, progress };
}

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type EggTier = 'Common' | 'Rare' | 'Legendary';

export const EGG_COSTS: Record<EggTier, number> = {
  Common: 50,
  Rare: 150,
  Legendary: 500,
};

const RARITY_ODDS: Record<EggTier, Array<[Rarity, number]>> = {
  Common: [
    ['Common', 0.75],
    ['Rare', 0.22],
    ['Epic', 0.025],
    ['Legendary', 0.005],
  ],
  Rare: [
    ['Common', 0.45],
    ['Rare', 0.40],
    ['Epic', 0.12],
    ['Legendary', 0.03],
  ],
  Legendary: [
    ['Common', 0.20],
    ['Rare', 0.40],
    ['Epic', 0.30],
    ['Legendary', 0.10],
  ],
};

export function pullEgg(tier: EggTier): Rarity {
  const roll = Math.random();
  let acc = 0;
  for (const [rarity, p] of RARITY_ODDS[tier]) {
    acc += p;
    if (roll <= acc) return rarity;
  }
  return 'Common';
}

export const RARITY_COLORS: Record<Rarity, string> = {
  Common: '#94A3B8',
  Rare: '#22D3EE',
  Epic: '#A855F7',
  Legendary: '#F59E0B',
};

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function dayDiff(a: Date, b: Date): number {
  const ms = 24 * 60 * 60 * 1000;
  const da = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const db = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((db - da) / ms);
}

export function computeStreak(
  lastSessionISO: string | null,
  currentStreak: number,
  now: Date = new Date(),
): number {
  if (!lastSessionISO) return 1;
  const last = new Date(lastSessionISO);
  const diff = dayDiff(last, now);
  if (diff === 0) return Math.max(currentStreak, 1);
  if (diff === 1) return currentStreak + 1;
  return 1;
}

export function streakBroken(lastSessionISO: string | null, now: Date = new Date()): boolean {
  if (!lastSessionISO) return false;
  return dayDiff(new Date(lastSessionISO), now) > 1;
}

export const LINEAGES = ['Fire', 'Water', 'Shadow', 'Nature'] as const;
export type Lineage = (typeof LINEAGES)[number];

export const LINEAGE_ACCENTS: Record<Lineage, string> = {
  Fire: '#EF4444',
  Water: '#22D3EE',
  Shadow: '#7C3AED',
  Nature: '#22C55E',
};

export function statsForLevel(level: number, lineage: Lineage): {
  atk: number;
  def: number;
  hp: number;
  focusPower: number;
  discipline: number;
  intensity: number;
} {
  const base = {
    Fire: { atk: 12, def: 8, hp: 40 },
    Water: { atk: 9, def: 11, hp: 45 },
    Shadow: { atk: 13, def: 7, hp: 38 },
    Nature: { atk: 10, def: 10, hp: 50 },
  }[lineage];
  const k = level - 1;
  return {
    atk: base.atk + k * 3,
    def: base.def + k * 2,
    hp: base.hp + k * 8,
    focusPower: Math.min(100, 20 + k * 4),
    discipline: Math.min(100, 15 + k * 4),
    intensity: Math.min(100, 25 + k * 4),
  };
}
