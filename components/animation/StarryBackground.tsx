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

const SHOOTING_STAR_LIFE_FRAMES = 50;
const SHOOTING_STAR_TAIL_LENGTH = 16;

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

export function StarryBackground(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const colorsRef = useRef<string[]>([]);
  const animationRef = useRef<number>(0);
  const isActiveRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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
      return window.innerWidth < 768 ? 60 : 100;
    };

    const initParticles = (): void => {
      const count = getParticleCount();
      const colors = colorsRef.current;
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1, // 1-4px
          alpha: Math.random() * 0.7 + 0.3, // 0.3-1.0
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: (Math.random() - 0.5) * 0.2,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          colorIndex: Math.floor(Math.random() * colors.length),
        });
      }
      particlesRef.current = particles;
    };

    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateThemeColors();
      initParticles();
    };

    const handleVisibilityChange = (): void => {
      isActiveRef.current = document.visibilityState === 'visible';
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isActiveRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    const themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          updateThemeColors();
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true });

    const shootingStars: ShootingStar[] = [];
    let nextShootingStarAt = performance.now() + randomBetween(1500, 4000);

    const animate = (): void => {
      if (!ctx || !canvas) return;

      if (!isActiveRef.current || document.visibilityState === 'hidden') {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const colors = colorsRef.current;
      const particles = particlesRef.current;

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.twinkle += particle.twinkleSpeed;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        const twinkleAlpha = particle.alpha * (0.5 + 0.5 * Math.sin(particle.twinkle));
        const color = colors[particle.colorIndex];
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(color, twinkleAlpha);
        ctx.fill();
      });

      // Sao băng: xuất hiện ngẫu nhiên, bay chéo và mờ dần
      const now = performance.now();
      if (now >= nextShootingStarAt) {
        shootingStars.push({
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * canvas.height * 0.4,
          vx: randomBetween(6, 9),
          vy: randomBetween(3, 5),
          life: 0,
        });
        nextShootingStarAt = now + randomBetween(4000, 9000);
      }

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

        if (
          star.life >= SHOOTING_STAR_LIFE_FRAMES ||
          star.x > canvas.width ||
          star.y > canvas.height
        ) {
          shootingStars.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationRef.current = requestAnimationFrame(animate);

    return (): void => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />
  );
}
