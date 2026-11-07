import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { ZodiacWheel } from '@/components/animation/ZodiacWheel';
import { installReducedMotion } from './helpers/match-media';

/** Cold plasma palette from the old animated wheel; it must no longer appear. */
const COOL_PLASMA_PATTERN =
  /#(?:5ef2ff|eafcff|3d8bff|1b3cff|9ff6ff|b7ccff|cfe8ff)|rgb\(\s*(?:94,\s*242,\s*255|234,\s*252,\s*255|61,\s*139,\s*255|27,\s*60,\s*255|159,\s*246,\s*255|183,\s*204,\s*255|207,\s*232,\s*255)\s*\)/i;

const SPIN_DURATION_SECONDS = 90;
const SPIN_CLASS = 'motion-safe:animate-[spin_90s_linear_infinite]';
const COUNTER_SPIN_CLASS = 'motion-safe:animate-[spin_90s_linear_infinite_reverse]';

const FIXED_POSITIONS = [
  ['50%', '10%'],
  ['70%', '15.359%'],
  ['84.641%', '30%'],
  ['90%', '50%'],
  ['84.641%', '70%'],
  ['70%', '84.641%'],
  ['50%', '90%'],
  ['30%', '84.641%'],
  ['15.359%', '70%'],
  ['10%', '50%'],
  ['15.359%', '30%'],
  ['30%', '15.359%'],
] as const;

beforeEach((): void => {
  installReducedMotion(false);
});

afterEach((): void => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('ZodiacWheel rotating reference layout', () => {
  it('uses CSS-only motion-safe spin classes without Motion imports, hooks, timers, or state', (): void => {
    const source = readFileSync(
      path.join(process.cwd(), 'components/animation/ZodiacWheel.tsx'),
      'utf8'
    );

    expect(source).not.toContain("from 'motion/react'");
    expect(source).not.toContain('usePrefersReducedMotion');
    expect(source).not.toMatch(/\b(?:setInterval|setTimeout|requestAnimationFrame)\s*\(/);
    expect(source).toContain(SPIN_CLASS);
    expect(source).toContain(COUNTER_SPIN_CLASS);
  });

  it('renders 12 round medallions at fixed, evenly spaced positions', (): void => {
    render(<ZodiacWheel />);

    const nodes = screen.getAllByTestId('branch-node');
    expect(nodes).toHaveLength(12);

    nodes.forEach((node, index) => {
      const [left, top] = FIXED_POSITIONS[index];
      expect(node).toHaveStyle({ left, top });
      expect(node).toHaveClass('absolute', '-translate-x-1/2', '-translate-y-1/2');

      const medallion = within(node).getByTestId('branch-medallion');
      expect(medallion).toHaveClass('rounded-full');
      expect(within(medallion).getByTestId('branch-glyph')).not.toBeNull();
    });

    // The orbit layer rotates while every node's inner content counter-rotates upright.
    expect(screen.queryByTestId('branch-orbit')).toBeNull();
    const orbit = screen.getByTestId('branch-nodes');
    expect(orbit).toHaveAttribute('data-spin-duration', String(SPIN_DURATION_SECONDS));
    expect(orbit.getAttribute('class')).toContain(SPIN_CLASS);

    const contents = screen.getAllByTestId('branch-content');
    expect(contents).toHaveLength(12);
    contents.forEach((content) => {
      expect(content).toHaveAttribute(
        'data-counter-spin-duration',
        String(SPIN_DURATION_SECONDS)
      );
      expect(content.getAttribute('class')).toContain(COUNTER_SPIN_CLASS);
    });

    expect(screen.getByTestId('zodiac-wheel').querySelector('[data-motion-state]')).toBeNull();
  });

  it('renders each branch with the Han glyph above a no-pill italic silver label', (): void => {
    render(<ZodiacWheel />);

    const branches = [
      ['子', 'Tý'],
      ['丑', 'Sửu'],
      ['寅', 'Dần'],
      ['卯', 'Mão'],
      ['辰', 'Thìn'],
      ['巳', 'Tỵ'],
      ['午', 'Ngọ'],
      ['未', 'Mùi'],
      ['申', 'Thân'],
      ['酉', 'Dậu'],
      ['戌', 'Tuất'],
      ['亥', 'Hợi'],
    ] as const;

    const nodes = screen.getAllByTestId('branch-node');
    expect(nodes).toHaveLength(12);

    nodes.forEach((node, index) => {
      const [han, label] = branches[index];
      const stack = node.firstElementChild as HTMLElement | null;
      const medallion = node.querySelector<HTMLElement>('[data-testid="branch-medallion"]');
      const glyph = node.querySelector<HTMLElement>('[data-testid="branch-glyph"]');
      const branchLabel = node.querySelector<HTMLElement>('[data-testid="branch-label"]');

      expect(stack).not.toBeNull();
      expect(stack).toHaveClass('flex', 'flex-col', 'items-center');
      expect(stack).toHaveAttribute('data-testid', 'branch-content');
      expect(stack).toHaveAttribute(
        'data-counter-spin-duration',
        String(SPIN_DURATION_SECONDS)
      );
      expect(stack?.getAttribute('class')).toContain(COUNTER_SPIN_CLASS);
      expect(stack?.children).toHaveLength(2);

      expect(medallion).not.toBeNull();
      expect(medallion).toHaveClass('rounded-full');
      expect(glyph).not.toBeNull();
      expect(glyph?.textContent).toBe(han);
      expect(medallion?.nextElementSibling).toBe(branchLabel);
      expect(branchLabel?.textContent).toBe(label);

      // Plain italic silver text directly below the glyph: no pill, background, or border.
      expect(branchLabel).toHaveClass(
        'font-serif',
        'italic',
        'text-[11px]',
        'sm:text-xs',
        'text-[#d8ccae]'
      );
      expect(branchLabel).not.toHaveClass('rounded-full');
      expect(branchLabel?.style.background).toBe('');
      expect(branchLabel?.style.border).toBe('');

      // Round halo + thin gold rim + dark core, never the old clipped star polygons.
      const decorativeLayers = Array.from(
        medallion?.querySelectorAll<HTMLElement>('span[aria-hidden="true"]') ?? []
      );
      expect(decorativeLayers.length).toBeGreaterThanOrEqual(2);
      decorativeLayers.forEach((layer) => {
        expect(layer.style.clipPath).not.toContain('polygon');
      });
    });

    expect(screen.getAllByTestId('branch-label')).toHaveLength(12);
    // The full Vietnamese branch list stays available to screen readers.
    expect(screen.getByRole('img')).toHaveAttribute(
      'aria-label',
      'Vòng tròn 12 con giáp: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi'
    );
  });

  it('renders a jade/gold Tai Chi inside slowly rotating delicate gold rings', (): void => {
    render(<ZodiacWheel />);

    // Tai Chi: jade and gold fills, opposing dots, and a thin gold rim.
    const jadeHalf = screen.getByTestId('yin-yang-white');
    const goldHalf = screen.getByTestId('yin-yang-black');
    expect(jadeHalf).toHaveAttribute('fill', 'url(#yin-yang-jade)');
    expect(jadeHalf).toHaveAttribute('data-tone', 'jade');
    expect(goldHalf).toHaveAttribute('fill', 'url(#yin-yang-gold)');
    expect(goldHalf).toHaveAttribute('data-tone', 'gold');

    const goldDot = screen.getByTestId('yin-yang-black-dot');
    expect(goldDot).toHaveAttribute('fill', 'url(#yin-yang-gold)');
    expect(goldDot).toHaveAttribute('data-tone', 'gold');
    const jadeDot = screen.getByTestId('yin-yang-white-dot');
    expect(jadeDot).toHaveAttribute('fill', 'url(#yin-yang-jade)');
    expect(jadeDot).toHaveAttribute('data-tone', 'jade');
    expect(screen.getByTestId('yin-yang-rim')).toHaveAttribute('stroke', '#d4af37');

    const yinYangStops = Array.from(
      screen.getByTestId('yin-yang').querySelectorAll('stop')
    ).map((stop) => stop.getAttribute('stop-color') ?? '');
    expect(yinYangStops).toEqual(
      expect.arrayContaining(['#6ef0bd', '#1fae7d', '#0a5c43', '#fff3b0', '#d4af37', '#7a5a12'])
    );

    // Gold rings/ticks/spokes remain, rotating slowly through reduced-motion-safe CSS.
    const rings = screen.getByTestId('wheel-rings');
    expect(rings.querySelectorAll('circle').length).toBeGreaterThanOrEqual(6);
    expect(rings.querySelectorAll('line').length).toBeGreaterThanOrEqual(60);
    expect(rings.querySelectorAll('[style*="animation"]')).toHaveLength(0);
    expect(rings).toHaveAttribute('data-spin-duration', String(SPIN_DURATION_SECONDS));
    expect(rings.getAttribute('class')).toContain(SPIN_CLASS);

    const shell = screen.getByTestId('yin-yang-shell');
    expect(shell).toHaveAttribute('data-spin-duration', String(SPIN_DURATION_SECONDS));
    expect(shell.getAttribute('class')).toContain(SPIN_CLASS);
    expect(shell.className).not.toContain('will-change-transform');
    expect(screen.getByTestId('zodiac-wheel').className).not.toContain('will-change-transform');
  });

  it('renders no plasma, corona, particle, trail, or aura layers', (): void => {
    render(<ZodiacWheel />);

    const wheel = screen.getByTestId('zodiac-wheel');

    [
      'solar-corona',
      'solar-sparks',
      'solar-spark',
      'orbit-energy-ring',
      'orbit-energy-stream',
      'orbit-particles',
      'orbit-particle',
      'orbit-aura',
      'energy-trail-left',
      'energy-trail-right',
      'energy-trail-particle',
      'ring-spin-outer',
      'ring-spin-inner',
      'bagua-halo',
    ].forEach((testId) => {
      expect(within(wheel).queryAllByTestId(testId)).toHaveLength(0);
    });

    expect(wheel.innerHTML).not.toMatch(COOL_PLASMA_PATTERN);
  });

  it('gates every wheel animation behind motion-safe so reduced motion disables it', (): void => {
    const { container, unmount } = render(<ZodiacWheel />);

    const spinning = Array.from(container.querySelectorAll('[data-spin-duration]'));
    expect(spinning).toHaveLength(3);
    spinning.forEach((element) => {
      expect(element).toHaveAttribute('data-spin-duration', String(SPIN_DURATION_SECONDS));
      const classes = element.getAttribute('class') ?? '';
      expect(classes).toContain(SPIN_CLASS);
      // No unconditional animation class can bypass prefers-reduced-motion.
      expect(classes).not.toMatch(/(?:^|\s)animate-\[spin/);
    });

    const counterSpinning = Array.from(
      container.querySelectorAll('[data-counter-spin-duration]')
    );
    expect(counterSpinning).toHaveLength(12);
    counterSpinning.forEach((element) => {
      expect(element).toHaveAttribute(
        'data-counter-spin-duration',
        String(SPIN_DURATION_SECONDS)
      );
      const classes = element.getAttribute('class') ?? '';
      expect(classes).toContain(COUNTER_SPIN_CLASS);
      expect(classes).not.toMatch(/(?:^|\s)animate-\[spin/);
    });

    const standardMarkup = container.innerHTML;
    unmount();
    installReducedMotion(true);

    const { container: reducedContainer } = render(<ZodiacWheel />);
    // The markup is CSS-driven: no JS media-query state changes the DOM.
    expect(reducedContainer.innerHTML).toBe(standardMarkup);
    expect(reducedContainer.querySelectorAll('[data-motion-state]')).toHaveLength(0);
  });

  it('no longer disables the wheel spin below the mobile breakpoint', (): void => {
    const css = readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');

    // The old mobile-only override forced `animation: none !important` on both
    // rotating layers. Mobile now keeps the same motion-safe spin as desktop.
    expect(css).not.toMatch(
      /@media\s*\(max-width:\s*639\.98px\)\s*\{[\s\S]*?\.zodiac-wheel\s+\[data-spin-duration\][\s\S]*?animation:\s*none\s*!important/
    );
    expect(css).not.toMatch(
      /\.zodiac-wheel\s+\[data-spin-duration\][^{]*\{[^}]*animation:\s*none/
    );
    expect(css).not.toMatch(
      /\.zodiac-wheel\s+\[data-counter-spin-duration\][^{]*\{[^}]*animation:\s*none/
    );
  });
});
