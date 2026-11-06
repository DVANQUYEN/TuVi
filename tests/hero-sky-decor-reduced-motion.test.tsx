import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';

vi.mock('motion/react', async () => {
  const React = await import('react');

  const MotionDiv = React.forwardRef<HTMLDivElement, Record<string, unknown>>((props, ref) => {
    const { animate, transition, initial, ...rest } = props;

    return React.createElement('div', {
      ...(rest as React.HTMLAttributes<HTMLDivElement>),
      ref,
      'data-motion-state': animate === undefined ? 'static' : 'animated',
      'data-motion-transition': transition === undefined ? 'static' : 'animated',
      'data-motion-initial': initial === undefined || initial === false ? 'static' : 'animated',
    });
  });
  MotionDiv.displayName = 'MotionDivMock';

  return {
    motion: { div: MotionDiv },
  };
});

import { HeroSkyDecor } from '@/components/home/HeroSkyDecor';
import { installReducedMotion } from './helpers/match-media';

function getGalaxyField(container: ParentNode): HTMLElement | null {
  return container.querySelector<HTMLElement>('[data-decor="galaxy-field"]');
}

beforeEach((): void => {
  installReducedMotion(false);
});

afterEach((): void => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('HeroSkyDecor reduced motion', (): void => {
  it('uses the local ESO Milky Way panorama, full-width framing, and 26s motion without remote URLs', (): void => {
    const { container } = render(<HeroSkyDecor />);
    const galaxyField = getGalaxyField(container);

    expect(galaxyField).not.toBeNull();
    expect(galaxyField?.style.backgroundImage).toContain('/images/milky-way-eso0932a.webp');
    expect(galaxyField?.style.backgroundImage).not.toContain('http');
    expect(galaxyField).toHaveAttribute('data-pan-duration', '26');

    // Entire panorama width stays visible with its 2.5:1 aspect ratio intact.
    expect(galaxyField).toHaveAttribute('data-fit', 'full-width');
    expect(galaxyField?.style.backgroundSize).toMatch(/^100%( auto)?$/);
    expect(galaxyField?.style.backgroundPosition).toBe('center center');
    expect(galaxyField?.style.backgroundColor).toMatch(/rgb\(5,\s*4,\s*20\)/);
    expect(galaxyField?.className).not.toContain('bg-cover');
  });

  it('runs the subtle background motion when reduced motion is off', (): void => {
    const { container } = render(<HeroSkyDecor />);
    const galaxyField = getGalaxyField(container);

    expect(galaxyField).toHaveAttribute('data-motion-state', 'animated');
    expect(galaxyField).toHaveAttribute('data-motion-transition', 'animated');
    expect(galaxyField).toHaveAttribute('data-motion-initial', 'animated');
  });

  it('renders no zoom/pan motion on a reduced-motion client', (): void => {
    installReducedMotion(true);

    const { container } = render(<HeroSkyDecor />);
    const galaxyField = getGalaxyField(container);

    expect(galaxyField).toHaveAttribute('data-motion-state', 'static');
    expect(galaxyField).toHaveAttribute('data-motion-transition', 'static');
    // No `initial={{ scale: 1.06 }}` either, so hydration stays in sync.
    expect(galaxyField).toHaveAttribute('data-motion-initial', 'static');
  });

  it('stops and restarts the pan/zoom when the preference changes while mounted', (): void => {
    const media = installReducedMotion(false);
    const { container } = render(<HeroSkyDecor />);

    expect(getGalaxyField(container)).toHaveAttribute('data-motion-state', 'animated');

    act((): void => media.setMatches(true));
    expect(getGalaxyField(container)).toHaveAttribute('data-motion-state', 'static');
    expect(getGalaxyField(container)).toHaveAttribute('data-motion-initial', 'static');

    act((): void => media.setMatches(false));
    expect(getGalaxyField(container)).toHaveAttribute('data-motion-state', 'animated');
    expect(getGalaxyField(container)).toHaveAttribute('data-motion-initial', 'animated');
  });
});
