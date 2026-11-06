'use client';

import { useSyncExternalStore } from 'react';

export const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

function getMediaQueryList(): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return null;
  }

  return window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);
}

function subscribe(onStoreChange: () => void): () => void {
  const mediaQuery = getMediaQueryList();
  if (!mediaQuery) return () => {};

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', onStoreChange);
    return (): void => mediaQuery.removeEventListener('change', onStoreChange);
  }

  // Safari <= 13 only implements the deprecated listener API.
  mediaQuery.addListener(onStoreChange);
  return (): void => mediaQuery.removeListener(onStoreChange);
}

function getSnapshot(): boolean {
  return getMediaQueryList()?.matches ?? false;
}

/**
 * Animations are decorative, so the server and hydration snapshot deliberately
 * assumes reduced motion is on. That keeps SSR markup identical to the first
 * client render and avoids a burst of motion for users who asked for less.
 * `getSnapshot` then reads the live media query once hydrated and the
 * `change` listener keeps the value in sync for the lifetime of the page.
 */
function getServerSnapshot(): boolean {
  return true;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
