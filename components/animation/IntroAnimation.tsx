'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/Button';

type Phase = 'scroll' | 'stars' | 'fadeout' | 'done';

function subscribeToStorage(callback: () => void): () => void {
  window.addEventListener('storage', callback);
  return (): void => window.removeEventListener('storage', callback);
}

function getIntroSeen(): boolean {
  try {
    return localStorage.getItem('introSeen') === 'true';
  } catch {
    return false;
  }
}

function getServerIntroSeen(): boolean {
  return false;
}

export function IntroAnimation(): React.ReactElement | null {
  const introSeen = useSyncExternalStore(subscribeToStorage, getIntroSeen, getServerIntroSeen);
  const [phase, setPhase] = useState<Phase>('scroll');

  const skipIntro = useCallback((): void => {
    setPhase('done');
    try {
      localStorage.setItem('introSeen', 'true');
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (introSeen || phase === 'done') return undefined;

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase('stars'), 1200));
    timers.push(window.setTimeout(() => setPhase('fadeout'), 2800));
    timers.push(window.setTimeout(() => skipIntro(), 3500));

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        skipIntro();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      timers.forEach(window.clearTimeout);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [introSeen, phase, skipIntro]);

  if (introSeen || phase === 'done') return null;

  return (
    <div
      role="presentation"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ${
        phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div
          className={`flex h-64 w-[300px] origin-left flex-col items-center justify-center rounded-lg border-y-2 border-gold bg-surface px-8 shadow-2xl transition-transform duration-[1200ms] ease-out md:h-80 md:w-[600px] ${
            phase === 'scroll' ? 'scale-x-0' : 'scale-x-100'
          }`}
        >
          <h1 className="font-serif text-3xl font-bold text-gold md:text-5xl">Sao Mệnh</h1>
          <p className="mt-2 text-sm text-muted md:text-base">Tử Vi Đẩu Số Việt Nam</p>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 7 }).map((_, index) => {
            const angle = (index / 7) * Math.PI * 2;
            const radius = 120;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <div
                key={index}
                className={`absolute h-2 w-2 rounded-full bg-gold-bright shadow-[0_0_10px_var(--accent-gold-bright)] transition-opacity duration-700 ${
                  phase === 'scroll' ? 'opacity-0' : 'opacity-100'
                }`}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  transitionDelay: `${1200 + index * 200}ms`,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-8">
        <Button variant="ghost" size="sm" onClick={skipIntro}>
          Bỏ qua
        </Button>
      </div>
    </div>
  );
}
