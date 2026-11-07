import { vi } from 'vitest';

export interface MediaQueryController {
  setMatches: (matches: boolean) => void;
}

export type ReducedMotionController = MediaQueryController;

/** Stub matchMedia for one query with a live `matches` value and working change listeners. */
export function installMediaQuery(query: string, matches: boolean): MediaQueryController {
  let currentMatches = matches;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();

  const mediaQueryList = {
    get matches(): boolean {
      return currentMatches;
    },
    media: query,
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

/** Stub the reduced-motion media query. */
export function installReducedMotion(matches: boolean): ReducedMotionController {
  return installMediaQuery('(prefers-reduced-motion: reduce)', matches);
}
