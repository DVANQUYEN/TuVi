import { vi } from 'vitest';

export interface ReducedMotionController {
  setMatches: (matches: boolean) => void;
}

/** Stub matchMedia with a live `matches` value and working change listeners. */
export function installReducedMotion(matches: boolean): ReducedMotionController {
  let currentMatches = matches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const mediaQueryList = {
    get matches(): boolean {
      return currentMatches;
    },
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (type === 'change') listeners.add(listener);
    }),
    removeEventListener: vi.fn((type: string, listener: (event: MediaQueryListEvent) => void) => {
      if (type === 'change') listeners.delete(listener);
    }),
    addListener: vi.fn((listener: (event: MediaQueryListEvent) => void) => listeners.add(listener)),
    removeListener: vi.fn((listener: (event: MediaQueryListEvent) => void) =>
      listeners.delete(listener)
    ),
    dispatchEvent: vi.fn(() => false),
  } as unknown as MediaQueryList;

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQueryList)
  );

  return {
    setMatches: (nextMatches: boolean): void => {
      currentMatches = nextMatches;
      const event = {
        matches: currentMatches,
        media: mediaQueryList.media,
      } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}
