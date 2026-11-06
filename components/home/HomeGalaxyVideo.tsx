'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';
const GALAXY_VIDEO_SRC = '/video/galaxy.mp4';
const GALAXY_POSTER_SRC = '/video/galaxy-poster.webp';

interface GalaxyVideoProps {
  onError: () => void;
}

/**
 * The video lives in its own component so readiness is reset naturally when
 * the clip unmounts (mobile, reduced motion, or after an error).
 */
function GalaxyVideo({ onError }: GalaxyVideoProps): React.ReactElement {
  const [isReady, setIsReady] = useState(false);

  return (
    <video
      data-testid="home-galaxy-video"
      src={GALAXY_VIDEO_SRC}
          poster={GALAXY_POSTER_SRC}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      tabIndex={-1}
      disablePictureInPicture
      aria-hidden="true"
      onCanPlay={(): void => setIsReady(true)}
      onError={onError}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
        isReady ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}

/**
 * Hero background video for the landing page.
 *
 * The 14.7 MB clip is only mounted on desktop when the visitor has not asked
 * for reduced motion. Server rendering (and the first client render) always
 * shows the static gradient so there is no hydration mismatch and mobile
 * devices never request the file. Any playback/decoding error falls back to
 * the same static sky.
 */
export function HomeGalaxyVideo(): React.ReactElement {
  const shouldReduceMotion = usePrefersReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect((): (() => void) => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return () => {};
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const updateMatch = (): void => setIsDesktop(mediaQuery.matches);

    updateMatch();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMatch);
      return (): void => mediaQuery.removeEventListener('change', updateMatch);
    }

    // Safari <= 13 only implements the deprecated listener API.
    mediaQuery.addListener(updateMatch);
    return (): void => mediaQuery.removeListener(updateMatch);
  }, []);

  const showVideo = isDesktop && !shouldReduceMotion && !hasError;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Static sky: the visible layer on mobile, with reduced motion, while the
          video loads, and after a playback error. */}
      <div
        data-testid="home-galaxy-fallback"
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundColor: '#0a0818',
          backgroundImage: [
            'radial-gradient(ellipse 84% 64% at 28% 30%, rgba(78,60,158,0.55) 0%, rgba(40,29,88,0.30) 44%, transparent 78%)',
            'radial-gradient(ellipse 72% 56% at 79% 26%, rgba(38,74,152,0.42) 0%, transparent 72%)',
            'radial-gradient(ellipse 52% 42% at 56% 78%, rgba(152,78,162,0.20) 0%, transparent 74%)',
            'linear-gradient(160deg, #0a0a1e 0%, #171330 46%, #080a18 100%)',
          ].join(', '),
        }}
      />

      {showVideo ? <GalaxyVideo onError={(): void => setHasError(true)} /> : null}

      {/* Dark gradient above the video so the gold hero copy keeps its contrast. */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(180deg, rgba(6,4,18,0.62) 0%, rgba(9,7,22,0.34) 38%, rgba(10,8,24,0.28) 62%, rgba(5,3,16,0.78) 100%)',
            'radial-gradient(ellipse 78% 66% at 50% 42%, rgba(6,4,18,0.40) 0%, rgba(10,8,24,0.22) 55%, transparent 100%)',
          ].join(', '),
        }}
      />

      {/* Extra scrim behind the left-aligned copy on desktop. */}
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,3,16,0.52) 0%, rgba(5,3,16,0.26) 30%, transparent 62%)',
        }}
      />
    </div>
  );
}
