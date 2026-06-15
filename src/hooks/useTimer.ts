import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(active: boolean) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const startRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      startRef.current = Date.now() - elapsedSec * 1000;
      intervalRef.current = setInterval(() => {
        if (startRef.current !== null) {
          setElapsedSec(Math.floor((Date.now() - startRef.current) / 1000));
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const reset = useCallback(() => {
    setElapsedSec(0);
    startRef.current = Date.now();
  }, []);

  return { elapsedSec, reset };
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
