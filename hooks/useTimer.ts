import { useEffect, useRef, useState } from 'react';

export function useCountdown(durationMs: number, startedAtMs: number | null, onComplete?: () => void) {
  const [now, setNow] = useState(Date.now());
  const doneRef = useRef(false);

  useEffect(() => {
    if (!startedAtMs) return;
    doneRef.current = false;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startedAtMs]);

  const elapsed = startedAtMs ? Math.max(0, now - startedAtMs) : 0;
  const remaining = Math.max(0, durationMs - elapsed);
  const progress = Math.min(1, durationMs > 0 ? elapsed / durationMs : 0);

  useEffect(() => {
    if (startedAtMs && remaining === 0 && !doneRef.current) {
      doneRef.current = true;
      onComplete?.();
    }
  }, [remaining, startedAtMs, onComplete]);

  return { remaining, elapsed, progress };
}
