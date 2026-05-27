export function formatTime(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.floor(Math.max(0, seconds) % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function randomName(lineage: string): string {
  const prefixes = ['Ryu', 'Kai', 'Zor', 'Nyx', 'Aeg', 'Vex', 'Pyr', 'Lux'];
  const suffixes = ['mon', 'rax', 'gax', 'shi', 'kor', 'lyn', 'vex'];
  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const s = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${p}${s}`;
}
