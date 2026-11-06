import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';
import { installReducedMotion } from './helpers/match-media';

function MotionProbe(): React.ReactElement {
  const shouldReduceMotion = usePrefersReducedMotion();
  return <span data-testid="motion-probe" data-reduced={String(shouldReduceMotion)} />;
}

function probeReduced(container: ParentNode): string | null {
  return container.querySelector('[data-testid="motion-probe"]')?.getAttribute('data-reduced') ?? null;
}

afterEach((): void => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('usePrefersReducedMotion', (): void => {
  it('uses a reduced-motion-safe snapshot during SSR', (): void => {
    // The user has motion enabled, but the server cannot know that yet.
    installReducedMotion(false);

    const html = renderToString(<MotionProbe />);

    expect(html).toContain('data-reduced="true"');
  });

  it('hydrates without mismatch and then follows live media-query changes', async (): Promise<void> => {
    const media = installReducedMotion(false);
    const html = renderToString(<MotionProbe />);
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    let root: Root | undefined;

    await act(async (): Promise<void> => {
      root = hydrateRoot(container, <MotionProbe />);
    });

    const hydrationWarnings = consoleError.mock.calls
      .flat()
      .filter((message) => typeof message === 'string' && /hydrat|did not match/i.test(message));
    expect(hydrationWarnings).toEqual([]);

    // Hydration starts from the server snapshot (reduced), then the live
    // client snapshot switches the animations on.
    expect(probeReduced(container)).toBe('false');

    act((): void => media.setMatches(true));
    expect(probeReduced(container)).toBe('true');

    act((): void => media.setMatches(false));
    expect(probeReduced(container)).toBe('false');

    await act(async (): Promise<void> => {
      root?.unmount();
    });
    container.remove();
  });

  it('updates when the media query changes while the component is mounted', (): void => {
    const media = installReducedMotion(false);
    render(<MotionProbe />);

    expect(screen.getByTestId('motion-probe')).toHaveAttribute('data-reduced', 'false');

    act((): void => media.setMatches(true));
    expect(screen.getByTestId('motion-probe')).toHaveAttribute('data-reduced', 'true');

    act((): void => media.setMatches(false));
    expect(screen.getByTestId('motion-probe')).toHaveAttribute('data-reduced', 'false');
  });

  it('treats a missing matchMedia implementation as motion enabled', (): void => {
    vi.stubGlobal('matchMedia', undefined);

    render(<MotionProbe />);

    expect(screen.getByTestId('motion-probe')).toHaveAttribute('data-reduced', 'false');
  });
});
