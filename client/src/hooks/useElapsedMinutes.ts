import { useEffect, useState } from 'react';

export function useElapsedMinutes(since: string | null): number | null {
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    if (!since) {
      setMinutes(null);
      return;
    }
    const calc = () => {
      const diff = Date.now() - new Date(since).getTime();
      setMinutes(Math.floor(diff / 60000));
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [since]);

  return minutes;
}
