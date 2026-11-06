import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { StarryBackground } from '@/components/animation/StarryBackground';

interface ContextStub {
  context: CanvasRenderingContext2D;
  arc: ReturnType<typeof vi.fn>;
  setTransform: ReturnType<typeof vi.fn>;
}

function createContextStub(): ContextStub {
  const arc = vi.fn();
  const setTransform = vi.fn();
  const context = {
    arc,
    beginPath: vi.fn(),
    clearRect: vi.fn(),
    createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    fill: vi.fn(),
    lineTo: vi.fn(),
    moveTo: vi.fn(),
    stroke: vi.fn(),
    setTransform,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
  };

  return { context: context as unknown as CanvasRenderingContext2D, arc, setTransform };
}

function stubReducedMotion(matches: boolean): void {
  const mediaQueryList = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  } as unknown as MediaQueryList;

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQueryList)
  );
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

describe('StarryBackground', (): void => {
  let canvasStub: ContextStub;

  beforeEach((): void => {
    canvasStub = createContextStub();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () => canvasStub.context
    );
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 2 });
  });

  afterEach((): void => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 1 });
  });

  it('draws a static starfield when reduced motion is requested', (): void => {
    stubReducedMotion(true);
    const requestFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', requestFrame);
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const { container } = render(<StarryBackground />);
    const canvas = container.querySelector('canvas');

    expect(canvas).not.toBeNull();
    expect(canvas?.width).toBe(Math.round(window.innerWidth * 2));
    expect(canvas?.height).toBe(Math.round(window.innerHeight * 2));
    expect(canvasStub.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);

    // Stars are still painted once, despite no animation loop.
    expect(canvasStub.arc.mock.calls.length).toBeGreaterThanOrEqual(50);
    expect(requestFrame).not.toHaveBeenCalled();
  });
});
