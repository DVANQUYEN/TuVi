import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import Home from '@/app/page';
import { HomeGalaxyVideo } from '@/components/home/HomeGalaxyVideo';

const HERO_BACKGROUND = '#171330';
const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)';

/** Cold plasma palette: cyan, electric blue, deep blue, and white accents. */
const COOL_PLASMA_PATTERN =
  /#(?:5ef2ff|eafcff|3d8bff|1b3cff|9ff6ff|b7ccff|cfe8ff)|rgb\(\s*(?:94,\s*242,\s*255|234,\s*252,\s*255|61,\s*139,\s*255|27,\s*60,\s*255|159,\s*246,\s*255|183,\s*204,\s*255|207,\s*232,\s*255)\s*\)/i;

/** CSSOM serializes hex colors as `rgb(...)`, so accept both forms. */
function parseColor(color: string): [number, number, number] {
  const hex = color.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    return [0, 2, 4].map((offset) => parseInt(hex[1].slice(offset, offset + 2), 16) / 255) as [
      number,
      number,
      number,
    ];
  }

  const rgb = color.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgb) {
    throw new Error(`Unsupported color: ${color}`);
  }

  const channels = rgb[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((channel) => Number.parseFloat(channel) / 255);

  return [channels[0], channels[1], channels[2]];
}

function relativeLuminance(color: string): number {
  const channels = parseColor(color).map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function extractColors(backgroundImage: string): string[] {
  return backgroundImage.match(/#[0-9a-f]{6}|rgba?\([^)]+\)/gi) ?? [];
}

/** Stub matchMedia with a distinct, cached list per media query. */
function stubMediaQueries(matchesByQuery: Record<string, boolean>): void {
  const lists = new Map<string, MediaQueryList>();

  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string): MediaQueryList => {
      const existing = lists.get(query);
      if (existing) return existing;

      const listeners = new Set<(event: MediaQueryListEvent) => void>();
      const list = {
        get matches(): boolean {
          return matchesByQuery[query] ?? false;
        },
        media: query,
        onchange: null,
        addEventListener: vi.fn(
          (type: string, listener: (event: MediaQueryListEvent) => void) => {
            if (type === 'change') listeners.add(listener);
          }
        ),
        removeEventListener: vi.fn(
          (type: string, listener: (event: MediaQueryListEvent) => void) => {
            if (type === 'change') listeners.delete(listener);
          }
        ),
        addListener: vi.fn((listener: (event: MediaQueryListEvent) => void) =>
          listeners.add(listener)
        ),
        removeListener: vi.fn((listener: (event: MediaQueryListEvent) => void) =>
          listeners.delete(listener)
        ),
        dispatchEvent: vi.fn(() => false),
      } as unknown as MediaQueryList;

      lists.set(query, list);
      return list;
    })
  );
}

vi.mock('@/lib/supabase/use-auth', () => ({
  useAuth: (): { user: null; loading: boolean; signOut: () => Promise<void> } => ({
    user: null,
    loading: false,
    signOut: async (): Promise<void> => {},
  }),
}));

afterEach((): void => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

describe('Homepage hero', () => {
  it('renders the gold-foil two-line headline as the page h1 inside a labelled hero section', (): void => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Khám phá vận mệnh theo Tử Vi Đẩu Số');
    expect(heading).toHaveClass('hero-title-foil');
    expect(heading.style.backgroundImage).toContain('linear-gradient');
    expect(heading.style.filter).toContain('drop-shadow');

    const lines = heading.querySelectorAll(':scope > span');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveTextContent('Khám phá vận mệnh theo');
    expect(lines[1]).toHaveTextContent('Tử Vi Đẩu Số');

    const hero = screen.getByRole('region', { name: 'Khám phá vận mệnh theo Tử Vi Đẩu Số' });
    expect(hero).toContainElement(heading);
  });

  it('keeps every gold-foil stop at least 3:1 against the dark hero', (): void => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });
    const stops = extractColors(heading.style.backgroundImage);

    expect(stops.length).toBeGreaterThanOrEqual(5);
    stops.forEach((stop) => {
      expect(contrastRatio(stop, HERO_BACKGROUND)).toBeGreaterThanOrEqual(3);
    });
  });

  it('drops the clip/filter foil treatment for forced-colors and print', (): void => {
    const css = readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');
    const forcedColors = css.match(/@media \(forced-colors: active\) \{[\s\S]*?\n\}/)?.[0] ?? '';
    const print = css.match(/@media print \{[\s\S]*?\n\}/)?.[0] ?? '';

    [forcedColors, print].forEach((fallback) => {
      expect(fallback).toContain('.hero-title-foil');
      expect(fallback).toContain('CanvasText');
      expect(fallback).toContain('background-image: none');
      expect(fallback).toMatch(/-webkit-background-clip:\s*border-box/);
      expect(fallback).toMatch(/-webkit-text-fill-color:\s*CanvasText/);
      expect(fallback).toMatch(/filter:\s*none/);
    });
  });

  it('renders the subtitle beneath the headline', (): void => {
    render(<Home />);

    expect(
      screen.getByText('Lập lá số chính xác theo trường phái Việt Nam, lịch âm UTC+7.')
    ).toBeInTheDocument();
  });

  it('keeps the zodiac wheel from collapsing by giving its wrapper and wheel explicit widths', (): void => {
    render(<Home />);

    const wheel = screen.getByTestId('zodiac-wheel');
    const wrapper = wheel.parentElement;

    expect(wrapper).not.toBeNull();
    expect(wrapper).toHaveClass('w-full');

    // Default mobile/desktop sizes stay explicit; the old cyclic min() width
    // resolved against the wheel itself and could shrink it to ~120px.
    expect(wheel).toHaveClass('w-[22rem]', 'md:w-[26rem]');
    expect(wheel.className).not.toContain('w-[min(22rem,100%)]');
  });

  it('keeps hero copy on fixed light colors independent of theme', (): void => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });
    const subtitle = screen.getByText(
      'Lập lá số chính xác theo trường phái Việt Nam, lịch âm UTC+7.'
    );
    const divider = screen.getByTestId('hero-divider');

    // Hero sits on a night-sky backdrop in both themes, so it must not inherit
    // theme-scoped text tokens that turn dark in light mode.
    const themeScopedText = /(?:^|\s)text-(?:gold|gold-bright|muted|foreground)(?:\s|$)/;
    [heading, subtitle].forEach((element) => {
      expect(element.className).not.toMatch(themeScopedText);
    });

    // Foil gradient + warm halo, with a fixed silver-gold subtitle and divider.
    expect(heading.style.backgroundImage).toContain('linear-gradient');
    expect(heading.style.filter).toContain('drop-shadow');
    expect(subtitle).toHaveClass('text-[#d8ccae]');
    expect(divider).toHaveClass('via-[#d4af37]');
  });

  it('renders 12 round branch medallions at fixed positions, with the Han glyph above an italic silver label and full branch names in the aria label', (): void => {
    render(<Home />);

    const ariaLabel =
      'Vòng tròn 12 con giáp: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi';
    const wheel = screen.getByRole('img', { name: ariaLabel });
    expect(wheel).toBeInTheDocument();
    expect(wheel).toHaveAttribute('aria-label', ariaLabel);

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
    ];

    // Tý at 12 o'clock, then every 30° clockwise around a fixed 40% orbit.
    const fixedPositions = [
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
    ];

    const nodes = within(wheel).getAllByTestId('branch-node');
    expect(nodes).toHaveLength(12);

    nodes.forEach((node, index) => {
      const [han, label] = branches[index];
      const [left, top] = fixedPositions[index];
      const medallion = within(node).getByTestId('branch-medallion');
      const glyph = within(node).getByTestId('branch-glyph');
      const branchLabel = within(node).getByTestId('branch-label');

      // Stable, evenly arranged node positions inside the rotating orbit layer.
      expect(node).toHaveStyle({ left, top });

      // One round medallion per branch, with the Han glyph above the Vietnamese label.
      expect(medallion).toHaveClass('rounded-full');
      expect(medallion).toContainElement(glyph);
      expect(glyph).toHaveTextContent(han);
      expect(medallion.nextElementSibling).toBe(branchLabel);
      expect(branchLabel).toHaveTextContent(label);
      expect(node.textContent).toContain(han);
      expect(node.textContent).toContain(label);

      // The label is plain italic silver text directly below the glyph: no pill,
      // background, or border.
      expect(branchLabel).toHaveClass(
        'font-serif',
        'italic',
        'text-[11px]',
        'sm:text-xs',
        'text-[#d8ccae]'
      );
      expect(branchLabel).not.toHaveClass('rounded-full');
      expect(branchLabel.style.background).toBe('');
      expect(branchLabel.style.border).toBe('');

      // Round halo + outline + dark core; the old clipped star polygons are gone.
      const decorativeLayers = Array.from(
        medallion.querySelectorAll<HTMLElement>('span[aria-hidden="true"]')
      );
      expect(decorativeLayers.length).toBeGreaterThanOrEqual(2);
      decorativeLayers.forEach((layer) => {
        expect(layer.style.clipPath).not.toContain('polygon');
      });
    });

    // The orbit layer spins while the inner content counter-spins to keep labels upright.
    expect(within(wheel).queryByTestId('branch-orbit')).toBeNull();

    const orbit = within(wheel).getByTestId('branch-nodes');
    expect(orbit).toHaveAttribute('data-spin-duration', '90');
    expect(orbit.getAttribute('class')).toContain(
      'motion-safe:animate-[spin_90s_linear_infinite]'
    );

    const contents = within(wheel).getAllByTestId('branch-content');
    expect(contents).toHaveLength(12);
    contents.forEach((content) => {
      expect(content).toHaveAttribute('data-counter-spin-duration', '90');
      expect(content.getAttribute('class')).toContain(
        'motion-safe:animate-[spin_90s_linear_infinite_reverse]'
      );
    });

    expect(wheel.querySelector('[data-motion-state]')).toBeNull();
  });

  it('renders a jade/gold Tai Chi with slowly rotating delicate gold rings and no plasma/corona/particle layers', (): void => {
    render(<Home />);

    const wheel = screen.getByTestId('zodiac-wheel');

    // Tai Chi: jade and gold fills, opposing dots, and a thin gold rim.
    const jadeHalf = within(wheel).getByTestId('yin-yang-white');
    const goldHalf = within(wheel).getByTestId('yin-yang-black');
    expect(jadeHalf).toHaveAttribute('fill', 'url(#yin-yang-jade)');
    expect(jadeHalf).toHaveAttribute('data-tone', 'jade');
    expect(goldHalf).toHaveAttribute('fill', 'url(#yin-yang-gold)');
    expect(goldHalf).toHaveAttribute('data-tone', 'gold');

    const goldDot = within(wheel).getByTestId('yin-yang-black-dot');
    expect(goldDot).toHaveAttribute('fill', 'url(#yin-yang-gold)');
    expect(goldDot).toHaveAttribute('data-tone', 'gold');
    const jadeDot = within(wheel).getByTestId('yin-yang-white-dot');
    expect(jadeDot).toHaveAttribute('fill', 'url(#yin-yang-jade)');
    expect(jadeDot).toHaveAttribute('data-tone', 'jade');
    expect(within(wheel).getByTestId('yin-yang-rim')).toHaveAttribute('stroke', '#d4af37');

    // The gradient definitions actually carry jade and gold stops.
    const yinYangStops = Array.from(
      within(wheel).getByTestId('yin-yang').querySelectorAll('stop')
    ).map((stop) => stop.getAttribute('stop-color') ?? '');
    expect(yinYangStops).toEqual(
      expect.arrayContaining(['#6ef0bd', '#1fae7d', '#0a5c43', '#fff3b0', '#d4af37', '#7a5a12'])
    );

    // Delicate concentric gold rings, ticks, and spokes remain.
    const rings = within(wheel).getByTestId('wheel-rings');
    expect(rings.querySelectorAll('circle').length).toBeGreaterThanOrEqual(6);
    expect(rings.querySelectorAll('line').length).toBeGreaterThanOrEqual(60);
    const ringStops = Array.from(rings.querySelectorAll('stop')).map(
      (stop) => stop.getAttribute('stop-color') ?? ''
    );
    expect(ringStops).toEqual(expect.arrayContaining(['#ffe9a8', '#d4af37', '#8a6a1a', '#f0d089']));
    expect(rings).toHaveAttribute('data-spin-duration', '90');
    expect(rings.getAttribute('class')).toContain(
      'motion-safe:animate-[spin_90s_linear_infinite]'
    );

    // Every plasma/corona/particle layer and legacy spin wrapper has been removed.
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

  it('keeps wheel geometry stable while motion-safe CSS rotates decorative layers and counter-rotates labels', (): void => {
    render(<Home />);

    const wheel = screen.getByTestId('zodiac-wheel');

    expect(wheel.className).not.toContain('zodiac-float');
    expect(wheel.className).not.toContain('will-change-transform');
    expect(wheel.querySelectorAll('[data-motion-state]')).toHaveLength(0);

    // The Tai Chi and rings share the slow 90s spin.
    const yinYangShell = within(wheel).getByTestId('yin-yang-shell');
    expect(yinYangShell).toHaveAttribute('data-spin-duration', '90');
    expect(yinYangShell.getAttribute('class')).toContain(
      'motion-safe:animate-[spin_90s_linear_infinite]'
    );
    expect(yinYangShell.className).not.toContain('will-change-transform');

    const rings = within(wheel).getByTestId('wheel-rings');
    expect(rings).toHaveAttribute('data-spin-duration', '90');
    expect(rings.getAttribute('class')).toContain(
      'motion-safe:animate-[spin_90s_linear_infinite]'
    );

    // The orbit layer spins while node contents counter-spin to stay upright.
    const orbit = within(wheel).getByTestId('branch-nodes');
    expect(orbit).toHaveAttribute('data-spin-duration', '90');
    expect(orbit.getAttribute('class')).toContain(
      'motion-safe:animate-[spin_90s_linear_infinite]'
    );

    const contents = within(wheel).getAllByTestId('branch-content');
    expect(contents).toHaveLength(12);
    contents.forEach((content) => {
      expect(content).toHaveAttribute('data-counter-spin-duration', '90');
      expect(content.getAttribute('class')).toContain(
        'motion-safe:animate-[spin_90s_linear_infinite_reverse]'
      );
    });

    // No animation may bypass prefers-reduced-motion.
    wheel
      .querySelectorAll('[data-spin-duration], [data-counter-spin-duration]')
      .forEach((layer) => {
        const animations =
          (layer.getAttribute('class') ?? '').match(/\S*animate-\[spin[^\s]*/g) ?? [];
        expect(animations.length).toBeGreaterThan(0);
        animations.forEach((animation) => {
          expect(animation).toMatch(/^motion-safe:/);
        });
      });

    // All 12 labels and glyphs remain visible and upright.
    expect(within(wheel).getAllByTestId('branch-medallion')).toHaveLength(12);
    expect(within(wheel).getAllByTestId('branch-glyph')).toHaveLength(12);
    expect(within(wheel).getAllByTestId('branch-label')).toHaveLength(12);
  });

  it('keeps wheel medallion glyphs on fixed light colors independent of theme', (): void => {
    render(<Home />);

    const wheel = screen.getByTestId('zodiac-wheel');
    const themeScopedColor =
      /(?:^|\s)(?:text-(?:gold|gold-bright|muted|foreground)|bg-(?:background|surface|elevated)|border-gold)(?:\s|$)/;

    const nodes = within(wheel).getAllByTestId('branch-node');
    expect(nodes).toHaveLength(12);

    nodes.forEach((node) => {
      const medallion = node.querySelector<HTMLElement>('[data-testid="branch-medallion"]');
      const han = node.querySelector<HTMLElement>('[data-testid="branch-glyph"]');
      if (!medallion || !han) {
        throw new Error('Expected every branch node to render a medallion and a Han glyph');
      }

      // The Han glyph and the Vietnamese label use fixed inline colors.
      expect(han.style.color).toBe('rgb(255, 226, 122)');
      expect(han.className).not.toMatch(themeScopedColor);
      expect(medallion.className).not.toMatch(themeScopedColor);

      const branchLabel = node.querySelector<HTMLElement>('[data-testid="branch-label"]');
      expect(branchLabel).not.toBeNull();
      expect(branchLabel?.className).toContain('text-[#d8ccae]');
      expect(branchLabel?.className).not.toMatch(themeScopedColor);
      expect(branchLabel?.style.background).toBe('');
      expect(branchLabel?.style.border).toBe('');
    });

    const motto = screen.getByText('Sao Mệnh', { selector: 'p' });
    expect(motto).toHaveClass('text-[#e8cf87]');
    expect(motto.className).not.toMatch(themeScopedColor);
  });

  it('does not render the intro overlay on the landing page', (): void => {
    render(<Home />);

    expect(screen.queryByRole('button', { name: 'Bỏ qua' })).not.toBeInTheDocument();
  });
});

describe('Homepage galaxy video', (): void => {
  it('mounts the local galaxy video on desktop only after effects when motion is allowed', (): void => {
    stubMediaQueries({
      [DESKTOP_MEDIA_QUERY]: true,
      [REDUCED_MOTION_MEDIA_QUERY]: false,
    });

    // Server rendering and the first client render always show the static sky.
    const serverHtml = renderToString(<HomeGalaxyVideo />);
    expect(serverHtml).not.toContain('home-galaxy-video');

    render(<HomeGalaxyVideo />);

    const fallback = screen.getByTestId('home-galaxy-fallback');
    expect(fallback).toBeInTheDocument();

    const video = screen.getByTestId('home-galaxy-video') as HTMLVideoElement;
    expect(video.getAttribute('src')).toBe('/video/galaxy.mp4');
    expect(video.autoplay).toBe(true);
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video.preload).toBe('metadata');
    expect(video.tabIndex).toBe(-1);
    expect(video).toHaveAttribute('disablepictureinpicture');
    expect(video).toHaveAttribute('aria-hidden', 'true');

    // The clip is local: no remote source or <source> children.
    expect(video.querySelectorAll('source')).toHaveLength(0);
    expect(video.getAttribute('src')).not.toMatch(/^https?:/i);
    expect(video.outerHTML).not.toMatch(/https?:\/\//i);
  });

  it('uses the static fallback with no video when reduced motion is requested', (): void => {
    stubMediaQueries({
      [DESKTOP_MEDIA_QUERY]: true,
      [REDUCED_MOTION_MEDIA_QUERY]: true,
    });

    render(<HomeGalaxyVideo />);

    expect(screen.getByTestId('home-galaxy-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('home-galaxy-video')).not.toBeInTheDocument();
  });

  it('uses the static fallback with no video on mobile widths', (): void => {
    stubMediaQueries({
      [DESKTOP_MEDIA_QUERY]: false,
      [REDUCED_MOTION_MEDIA_QUERY]: false,
    });

    render(<HomeGalaxyVideo />);

    expect(screen.getByTestId('home-galaxy-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('home-galaxy-video')).not.toBeInTheDocument();
  });

  it('returns to the static fallback after a video error', (): void => {
    stubMediaQueries({
      [DESKTOP_MEDIA_QUERY]: true,
      [REDUCED_MOTION_MEDIA_QUERY]: false,
    });

    render(<HomeGalaxyVideo />);

    const video = screen.getByTestId('home-galaxy-video');
    fireEvent.error(video);

    expect(screen.getByTestId('home-galaxy-fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('home-galaxy-video')).not.toBeInTheDocument();
  });
});

describe('Homepage sections below the hero', () => {
  it('keeps the feature cards and footer', (): void => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: 'Lá số chi tiết' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tử vi hàng ngày' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Hợp tuổi' })).toBeInTheDocument();

    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Giới thiệu' })).toHaveAttribute(
      'href',
      '/about'
    );

    // Footer surfaces the site owner's contact channels.
    expect(within(footer).getByRole('heading', { name: 'Chủ sở hữu' })).toBeInTheDocument();
    expect(
      within(footer).getByRole('link', { name: 'daovanquyen26@gmail.com' })
    ).toHaveAttribute('href', 'mailto:daovanquyen26@gmail.com');

    const facebook = within(footer).getByRole('link', { name: /Facebook/ });
    expect(facebook).toHaveAttribute('href', 'https://www.facebook.com/van.quyen.822065');
    expect(facebook).toHaveAttribute('target', '_blank');
    expect(facebook).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('mounts GlobalSkyBackdrop in the root layout instead of the homepage', (): void => {
    const layout = readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');
    const page = readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf8');

    expect(layout).toContain(
      "import { GlobalSkyBackdrop } from '@/components/layout/GlobalSkyBackdrop'"
    );
    expect(layout).toContain('<GlobalSkyBackdrop />');
    expect(layout).not.toContain(
      "import { StarryBackground } from '@/components/animation/StarryBackground'"
    );
    expect(page).not.toContain('StarryBackground');
    expect(page).toContain('<HomeGalaxyVideo />');
  });

  it('does not bring back the retired quick chart or photo credit', (): void => {
    render(<Home />);

    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/quick chart/i);
    expect(text).not.toMatch(/eso/i);
    expect(text).not.toMatch(/credit/i);
    expect(document.body.innerHTML).not.toMatch(/eso\.org|milky-way/i);
  });

  it('keeps primary navigation links in the header', (): void => {
    render(<Home />);

    const header = screen.getByRole('banner');
    expect(within(header).getByRole('link', { name: 'Lập lá số' })).toHaveAttribute(
      'href',
      '/lap-la-so'
    );
  });
});
