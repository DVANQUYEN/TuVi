import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { GlobalSkyBackdrop } from '@/components/layout/GlobalSkyBackdrop';
import { installReducedMotion } from './helpers/match-media';

function createContextStub(): CanvasRenderingContext2D {
  return {
    arc: vi.fn(),
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    fill: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    stroke: vi.fn(),
    setTransform: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
  } as unknown as CanvasRenderingContext2D;
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: readonly number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

beforeEach((): void => {
  // Reduced motion keeps StarryBackground in its static single-frame path.
  installReducedMotion(true);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    () => createContextStub()
  );
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach((): void => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('GlobalSkyBackdrop', (): void => {
  it('renders an aria-hidden fixed backdrop with nebula gradients, the starfield, and a vignette', (): void => {
    const { container } = render(<GlobalSkyBackdrop />);
    const backdrop = container.firstElementChild as HTMLElement | null;

    expect(backdrop).not.toBeNull();
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop?.className).toContain('pointer-events-none');
    expect(backdrop?.className).toContain('fixed');
    expect(backdrop?.className).toContain('inset-0');
    expect(backdrop?.className).toContain('z-0');
    expect(backdrop?.className).toContain('overflow-hidden');

    // One StarryBackground canvas is mounted inside the decorative wrapper.
    const canvas = backdrop?.querySelector('canvas');
    expect(canvas).not.toBeNull();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(canvas?.className).toContain('pointer-events-none');

    const layers = Array.from(backdrop?.children ?? []).filter(
      (child): child is HTMLElement => child instanceof HTMLElement && child.tagName === 'DIV'
    );
    expect(layers).toHaveLength(3);

    // Base midnight purple/blue nebula: radial washes over a linear gradient.
    const base = layers[0];
    expect(base.style.backgroundColor).toMatch(/rgb\(\s*7,\s*9,\s*18\s*\)/);
    expect(base.style.backgroundImage).toContain('radial-gradient');
    expect(base.style.backgroundImage).toContain('linear-gradient');
    expect(base.style.backgroundImage).toMatch(/rgba\(\s*64,\s*44,\s*126/);
    expect(base.style.backgroundImage).toMatch(/rgba\(\s*31,\s*58,\s*116/);

    // Faint gold halo plus a broad edge vignette.
    const goldVignette = layers[1];
    expect(goldVignette.style.backgroundImage).toMatch(/rgba\(\s*212,\s*175,\s*55/);
    expect(goldVignette.style.backgroundImage).toContain('radial-gradient');

    // Bottom vignette keeps footer content legible.
    const bottomVignette = layers[2];
    expect(bottomVignette.className).toContain('bottom-0');
    expect(bottomVignette.style.backgroundImage).toContain('linear-gradient');
  });

  it('is mounted exactly once in the root layout behind the z-10 content wrapper', (): void => {
    const layout = readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');

    expect(layout).toContain(
      "import { GlobalSkyBackdrop } from '@/components/layout/GlobalSkyBackdrop'"
    );
    expect(layout.match(/<GlobalSkyBackdrop \/>/g)).toHaveLength(1);
    const contentWrapper = layout.match(/<div className="([^"]*)">\{children\}<\/div>/);
    expect(contentWrapper).not.toBeNull();
    expect(contentWrapper?.[1]).toContain('relative');
    expect(contentWrapper?.[1]).toContain('z-10');
    expect(layout).not.toContain(
      "import { StarryBackground } from '@/components/animation/StarryBackground'"
    );
  });
});
