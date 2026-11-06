'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speedX: number;
  speedY: number;
  twinkle: number;
  twinkleSpeed: number;
  colorIndex: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Viewport {
  width: number;
  height: number;
}

const SHOOTING_STAR_LIFE_FRAMES = 50;
const SHOOTING_STAR_TAIL_LENGTH = 16;
const MAX_DEVICE_PIXEL_RATIO = 2;

function hexToRgba(hex: string, alpha: number): string {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getDevicePixelRatio(): number {
  return Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
}

export function StarryBackground(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const colorsRef = useRef<string[]>([]);
  const animationRef = useRef<number>(0);
  const isActiveRef = useRef(true);
  const viewportRef = useRef<Viewport>({ width: 0, height: 0 });
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = motionQuery.matches;

    const getThemeColors = (): string[] => {
      const root = getComputedStyle(document.documentElement);
      const gold = root.getPropertyValue('--accent-gold').trim() || '#d4af37';
      const goldBright = root.getPropertyValue('--accent-gold-bright').trim() || '#ffd700';
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        return [gold, goldBright, '#e2e8f0'];
      }
      const water = root.getPropertyValue('--el-thuy').trim() || '#38bdf8';
      return ['#ffffff', gold, water];
    };

    const updateThemeColors = (): void => {
      colorsRef.current = getThemeColors();
    };

    const getParticleCount = (): number => {
      return window.innerWidth < 768 ? 60 : 110;
    };

    const initParticles = (width: number, height: number): void => {
      const count = getParticleCount();
      const colors = colorsRef.current;
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: randomBetween(0.4, 1.8),
          alpha: randomBetween(0.25, 0.9),
          speedX: (Math.random() - 0.5) * 0.14,
          speedY: (Math.random() - 0.5) * 0.14,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.018 + 0.008,
          colorIndex: Math.floor(Math.random() * colors.length),
        });
      }
      particlesRef.current = particles;
    };

    const drawStars = (): void => {
      const { width, height } = viewportRef.current;
      ctx.clearRect(0, 0, width, height);

      const colors = colorsRef.current;
      particlesRef.current.forEach((particle) => {
        const twinkleAlpha = particle.alpha * (0.55 + 0.45 * Math.sin(particle.twinkle));
        const color = colors[particle.colorIndex % colors.length] ?? '#ffffff';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, Math.min(1, twinkleAlpha));
        ctx.fill();
      });
    };

    const resizeCanvas = (): void => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = getDevicePixelRatio();

      viewportRef.current = { width, height };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      updateThemeColors();
      initParticles(width, height);

      // Reduced motion: vẽ một khung tĩnh thay vì bỏ trống bầu trời.
      if (reducedMotionRef.current) {
        drawStars();
      }
    };

    const handleVisibilityChange = (): void => {
      isActiveRef.current = document.visibilityState === 'visible';
    };

    const intersectionObserver =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            (entries) => {
              isActiveRef.current = entries[0]?.isIntersecting ?? true;
            },
            { threshold: 0 }
          );
    intersectionObserver?.observe(canvas);

    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          updateThemeColors();
          if (reducedMotionRef.current) {
            drawStars();
          }
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    const shootingStars: ShootingStar[] = [];
    let nextShootingStarAt = performance.now() + randomBetween(1500, 4000);

    const animate = (): void => {
      if (reducedMotionRef.current) return;

      const { width, height } = viewportRef.current;

      if (!isActiveRef.current || document.visibilityState === 'hidden') {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.twinkle += particle.twinkleSpeed;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;
      });

      drawStars();

      // Sao băng: xuất hiện ngẫu nhiên, bay chéo và mờ dần
      const now = performance.now();
      if (now >= nextShootingStarAt) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          vx: randomBetween(6, 9),
          vy: randomBetween(3, 5),
          life: 0,
        });
        nextShootingStarAt = now + randomBetween(4000, 9000);
      }

      const colors = colorsRef.current;
      const streakColor = colors[0] ?? '#ffffff';
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        star.x += star.vx;
        star.y += star.vy;
        star.life += 1;

        const fade = 1 - star.life / SHOOTING_STAR_LIFE_FRAMES;
        const tailX = star.x - star.vx * SHOOTING_STAR_TAIL_LENGTH;
        const tailY = star.y - star.vy * SHOOTING_STAR_TAIL_LENGTH;
        const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        gradient.addColorStop(0, hexToRgba(streakColor, fade));
        gradient.addColorStop(1, hexToRgba(streakColor, 0));

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (star.life >= SHOOTING_STAR_LIFE_FRAMES || star.x > width || star.y > height) {
          shootingStars.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMotionChange = (event: MediaQueryListEvent): void => {
      reducedMotionRef.current = event.matches;
      if (event.matches) {
        cancelAnimationFrame(animationRef.current);
        drawStars();
      } else {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    motionQuery.addEventListener?.('change', handleMotionChange);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (!reducedMotionRef.current) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return (): void => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      motionQuery.removeEventListener?.('change', handleMotionChange);
      intersectionObserver?.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
