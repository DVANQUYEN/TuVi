import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Sticky positioning cannot be observed in jsdom (no layout engine), so this
 * suite guards the source-level contract that keeps the header sticky.
 */
const SCROLL_CONTAINER_ANCESTOR = /\boverflow-(?:y-(?:auto|scroll)|hidden)\b/;

function readSource(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), 'utf8');
}

describe('sticky navbar contract', () => {
  it('keeps the root <body> from creating a horizontal scroll container', (): void => {
    const layout = readSource('app/layout.tsx');
    const bodyTag = layout.match(/<body\b[^>]*>/)?.[0] ?? '';

    expect(bodyTag).not.toBe('');
    expect(bodyTag).toContain('overflow-x-clip');
    expect(bodyTag).not.toContain('overflow-x-hidden');
  });

  it('keeps the content wrapper on overflow-x-clip', (): void => {
    const layout = readSource('app/layout.tsx');
    const contentWrapper = layout.match(/<div className="([^"]*)">\{children\}<\/div>/);

    expect(contentWrapper).not.toBeNull();
    expect(contentWrapper?.[1]).toContain('overflow-x-clip');
    expect(contentWrapper?.[1]).not.toContain('overflow-x-hidden');
  });

  it('never reintroduces the retired overflow-x-hidden utility in the root layout', (): void => {
    const layout = readSource('app/layout.tsx');

    expect(layout).not.toContain('overflow-x-hidden');
  });

  it('does not put a scroll-container ancestor around the header content', (): void => {
    const layout = readSource('app/layout.tsx');
    const bodyTag = layout.match(/<body\b[^>]*>/)?.[0] ?? '';
    const contentWrapper = layout.match(/<div className="([^"]*)">\{children\}<\/div>/);

    expect(bodyTag).not.toMatch(SCROLL_CONTAINER_ANCESTOR);
    expect(contentWrapper?.[1]).not.toMatch(SCROLL_CONTAINER_ANCESTOR);
  });

  it('keeps the header itself sticky at the top with the expected z-index', (): void => {
    const header = readSource('components/layout/Header.tsx');
    const headerTag = header.match(/<header\b[^>]*>/)?.[0] ?? '';

    expect(headerTag).not.toBe('');
    expect(headerTag).toContain('sticky');
    expect(headerTag).toContain('top-0');
    expect(headerTag).toContain('z-40');
  });
});
