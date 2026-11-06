'use client';

import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/hooks/use-prefers-reduced-motion';

/**
 * Lớp trang trí nền cho hero trang chủ: nền vũ trụ tím-midnight (#171330), ảnh thiên hà,
 * tinh vân mờ, sao lấp lánh và mây vân cổ điển ở góc dưới-trái.
 *
 * Ảnh: ESO "The Milky Way panorama" (GigaGalaxy Zoom, eso0932a) của Serge Brunier.
 * Trang nguồn: https://www.eso.org/public/images/eso0932a/
 * Giấy phép: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/), ghi công ESO/S. Brunier.
 * Tệp gốc: https://cdn.eso.org/images/large/eso0932a.jpg (6000x3000).
 * Tệp cục bộ: public/images/milky-way-eso0932a.webp (2400x960, ~455 KB), giữ nguyên toàn bộ
 * 360° theo chiều ngang, chỉ cắt bớt khoảng trời trống trên/dưới, tăng nhẹ tương phản/độ bão
 * hòa rồi nén WebP quality 82 bằng sharp. Ghi công hiển thị nằm ngoài cây aria-hidden trong
 * app/page.tsx.
 * Không fetch URL bên ngoài lúc runtime. Toàn bộ lớp được ẩn khỏi công nghệ hỗ trợ (aria-hidden).
 */

const GALAXY_IMAGE = '/images/milky-way-eso0932a.webp';
const GALAXY_PAN_DURATION = 26;

/** Những hạt sao tĩnh rải rác trong hero. Vị trí cố định để tránh lệch hydration. */
const HERO_STARS = [
  'radial-gradient(circle at 7% 17%, rgba(255,250,232,0.88) 0 0.9px, transparent 2.4px)',
  'radial-gradient(circle at 14% 34%, rgba(255,246,214,0.70) 0 0.7px, transparent 2px)',
  'radial-gradient(circle at 19% 9%, rgba(232,228,255,0.78) 0 0.8px, transparent 2.2px)',
  'radial-gradient(circle at 25% 26%, rgba(255,255,255,0.82) 0 0.6px, transparent 1.8px)',
  'radial-gradient(circle at 31% 13%, rgba(255,242,200,0.72) 0 0.7px, transparent 2px)',
  'radial-gradient(circle at 37% 39%, rgba(214,206,255,0.62) 0 0.6px, transparent 1.8px)',
  'radial-gradient(circle at 43% 8%, rgba(255,255,255,0.80) 0 0.8px, transparent 2.2px)',
  'radial-gradient(circle at 49% 22%, rgba(255,238,190,0.68) 0 0.6px, transparent 1.8px)',
  'radial-gradient(circle at 56% 11%, rgba(240,236,255,0.82) 0 0.9px, transparent 2.4px)',
  'radial-gradient(circle at 61% 33%, rgba(255,250,230,0.74) 0 0.7px, transparent 2px)',
  'radial-gradient(circle at 68% 15%, rgba(255,247,214,0.95) 0 1.2px, rgba(255,210,110,0.35) 1.2px 4px, transparent 7px)',
  'radial-gradient(circle at 74% 29%, rgba(226,222,255,0.72) 0 0.7px, transparent 2px)',
  'radial-gradient(circle at 81% 10%, rgba(255,255,255,0.84) 0 0.8px, transparent 2.2px)',
  'radial-gradient(circle at 87% 41%, rgba(255,242,204,0.68) 0 0.6px, transparent 1.8px)',
  'radial-gradient(circle at 93% 20%, rgba(244,240,255,0.80) 0 0.9px, transparent 2.4px)',
  'radial-gradient(circle at 12% 62%, rgba(255,235,180,0.90) 0 1.1px, rgba(255,205,105,0.28) 1.1px 3.6px, transparent 6px)',
  'radial-gradient(circle at 22% 78%, rgba(238,234,255,0.62) 0 0.7px, transparent 2px)',
  'radial-gradient(circle at 34% 58%, rgba(255,255,255,0.72) 0 0.6px, transparent 1.8px)',
  'radial-gradient(circle at 47% 81%, rgba(228,222,255,0.58) 0 0.7px, transparent 2px)',
  'radial-gradient(circle at 59% 67%, rgba(255,244,206,0.74) 0 0.8px, transparent 2.2px)',
  'radial-gradient(circle at 71% 84%, rgba(255,250,232,0.70) 0 0.6px, transparent 1.8px)',
  'radial-gradient(circle at 83% 63%, rgba(222,216,255,0.64) 0 0.8px, transparent 2.2px)',
  'radial-gradient(circle at 95% 73%, rgba(255,240,196,0.72) 0 0.7px, transparent 2px)',
  'radial-gradient(circle at 40% 92%, rgba(255,255,255,0.60) 0 0.6px, transparent 1.8px)',
  'radial-gradient(circle at 78% 94%, rgba(230,224,255,0.62) 0 0.7px, transparent 2px)',
];

const NEBULA_LAYERS = [
  'radial-gradient(ellipse 48% 40% at 23% 57%, rgba(118,74,196,0.26) 0%, rgba(84,52,148,0.10) 42%, transparent 72%)',
  'radial-gradient(ellipse 42% 34% at 73% 29%, rgba(54,92,190,0.20) 0%, transparent 70%)',
  'radial-gradient(ellipse 36% 30% at 57% 79%, rgba(156,78,154,0.13) 0%, transparent 74%)',
  'radial-gradient(ellipse 64% 48% at 50% 49%, rgba(186,164,255,0.07) 0%, transparent 70%)',
];

interface CloudOrnamentProps {
  className?: string;
  flip?: boolean;
  decorId?: string;
}

function CloudOrnament({
  className,
  flip = false,
  decorId,
}: CloudOrnamentProps): React.ReactElement {
  return (
    <svg
      viewBox="0 0 220 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      focusable="false"
      aria-hidden="true"
      data-decor={decorId}
    >
      <path d="M4 70 C 26 70 34 50 56 52 C 74 54 70 36 88 36 C 104 36 102 56 118 54 C 136 52 138 20 160 22 C 178 24 176 46 192 46 C 204 46 210 58 216 56" />
      <path d="M56 52 C 50 44 58 38 64 42 C 68 46 62 50 58 47" />
      <path d="M160 22 C 154 14 162 8 168 12 C 172 16 166 20 162 17" />
      <path d="M88 36 C 82 28 90 24 96 28" />
    </svg>
  );
}

export function HeroSkyDecor(): React.ReactElement {
  const shouldReduceMotion = usePrefersReducedMotion();

  return (
    <div
      data-testid="hero-sky-decor"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Nền vũ trụ tím-midnight, đậm ở cả hai theme vì hero luôn tối. */}
      <div
        data-decor="sky-wash"
        className="absolute inset-0"
        style={{
          backgroundColor: '#171330',
          backgroundImage: [
            'radial-gradient(ellipse 94% 82% at 36% 18%, rgba(64,44,126,0.56) 0%, rgba(38,26,82,0.30) 42%, transparent 76%)',
            'radial-gradient(ellipse 72% 70% at 86% 34%, rgba(31,58,116,0.38) 0%, transparent 72%)',
            'linear-gradient(158deg, rgba(10,8,24,0.76) 0%, rgba(23,19,48,0.18) 42%, rgba(11,8,26,0.82) 100%)',
          ].join(', '),
        }}
      />

      {/* Ảnh Dải Ngân Hà thật (cục bộ, CC BY 4.0) làm nền chính. Toàn bộ chiều ngang
          panorama (2400x960) luôn hiển thị: `100% auto` giữ đúng tỉ lệ 2.5:1, phần
          chênh lệch trên/dưới được lấp bằng nền tối cùng tông. Chuyển động chỉ đổi độ
          mờ rất nhẹ nên không cắt mất hai đầu panorama. Nếu ảnh không tải được, lớp
          sky-wash phía dưới vẫn là fallback tĩnh. */}
      <motion.div
        key={shouldReduceMotion ? 'galaxy-static' : 'galaxy-animated'}
        data-decor="galaxy-field"
        data-pan-duration={GALAXY_PAN_DURATION}
        data-fit="full-width"
        className="absolute inset-0 bg-center bg-no-repeat will-change-[opacity]"
        style={{
          backgroundColor: '#050414',
          backgroundImage: `url('${GALAXY_IMAGE}')`,
          backgroundSize: '100% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.94) contrast(112%) saturate(110%)',
        }}
        initial={shouldReduceMotion ? false : { opacity: 0.92 }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: [0.92, 1, 0.92],
              }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: GALAXY_PAN_DURATION, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Lớp phủ rất nhẹ: chỉ giữ không khí tím-midnight, không bóp tối toàn bộ thiên hà. */}
      <div
        data-decor="galaxy-overlay"
        className="absolute inset-0"
        style={{
          background: [
            'linear-gradient(180deg, rgba(6,4,18,0.30) 0%, rgba(23,19,48,0.04) 42%, rgba(8,6,22,0.30) 100%)',
            'radial-gradient(ellipse 104% 88% at 66% 38%, transparent 36%, rgba(5,4,18,0.24) 100%)',
            'linear-gradient(118deg, rgba(23,19,48,0.22) 0%, rgba(18,16,52,0.04) 44%, transparent 68%)',
          ].join(', '),
        }}
      />

      {/* Scrim cục bộ ngay dưới khối chữ bên trái (desktop) để giữ tương phản mà không làm tối ảnh. */}
      <div
        data-decor="hero-copy-scrim"
        className="absolute inset-0 hidden lg:block"
        style={{
          background: [
            'linear-gradient(90deg, rgba(5,3,16,0.78) 0%, rgba(5,3,16,0.58) 26%, rgba(5,3,16,0.20) 52%, transparent 74%)',
            'radial-gradient(ellipse 58% 66% at 26% 49%, rgba(5,3,16,0.44) 0%, transparent 78%)',
          ].join(', '),
        }}
      />

      {/* Trên mobile khối chữ nằm giữa, nên scrim ôm vùng tiêu đề thay vì phủ tối cả ảnh. */}
      <div
        data-decor="hero-copy-scrim-mobile"
        className="absolute inset-x-0 top-0 h-[58%] lg:hidden"
        style={{
          background:
            'radial-gradient(ellipse 88% 82% at 50% 24%, rgba(5,3,16,0.72) 0%, rgba(5,3,16,0.42) 48%, transparent 82%)',
        }}
      />

      {/* Tinh vân tím/xanh mờ, tạo chiều sâu mà không lấn át nội dung. */}
      <div
        data-decor="nebula"
        className="absolute inset-0"
        style={{
          background: NEBULA_LAYERS.join(', '),
          filter: 'blur(18px)',
        }}
      />

      {/* Quầng sáng mềm của dải thiên hà, tách lớp để có cảm giác chiều sâu. */}
      <div
        data-decor="galaxy-core"
        className="absolute left-1/2 top-[44%] h-[38%] w-[92%] -translate-x-1/2 -translate-y-1/2 -rotate-[8deg]"
        style={{
          background:
            'radial-gradient(ellipse 46% 24% at 50% 50%, rgba(246,244,255,0.18) 0%, rgba(196,186,255,0.10) 42%, transparent 76%)',
          filter: 'blur(24px)',
        }}
      />

      {/* Sao tĩnh lấp lánh, bổ sung cho canvas starfield phía sau toàn trang. */}
      <div
        data-decor="hero-stars"
        className="absolute inset-0 opacity-90 mix-blend-screen"
        style={{ backgroundImage: HERO_STARS.join(', ') }}
      />

      {/* Quầng vàng phải + vignette tối để cân bằng vòng tròn, giảm cảm giác phẳng. */}
      <div
        data-decor="gold-haze"
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 38% 48% at 76% 46%, rgba(255,196,92,0.16) 0%, rgba(212,175,55,0.06) 44%, transparent 72%)',
            'radial-gradient(ellipse 84% 74% at 50% 45%, transparent 46%, rgba(4,2,12,0.44) 100%)',
          ].join(', '),
        }}
      />

      {/* Lớp tối ở đáy giữ vòng địa chi và nhãn trên nền đậm ở cả hai theme.
          Không dùng var(--bg-primary): theme sáng sẽ làm nhạt chân hero và phá contrast. */}
      <div
        data-decor="bottom-scrim"
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            'linear-gradient(to top, rgba(6,4,18,0.92) 0%, rgba(8,6,22,0.70) 34%, rgba(10,8,26,0.34) 66%, transparent 100%)',
        }}
      />

      {/* Vân mây truyền thống: điểm nhấn mờ ở góc dưới-trái, không tranh chấp với vòng địa chi. */}
      <CloudOrnament
        decorId="cloud-lower-left"
        className="absolute -bottom-5 -left-6 w-56 text-[#cbb06a]/22 sm:w-72 lg:bottom-0 lg:left-0 lg:w-96"
      />
      <CloudOrnament
        decorId="cloud-lower-left-echo"
        flip
        className="absolute bottom-10 left-28 w-32 text-[#9fb4d8]/14 sm:left-40 sm:w-44 lg:bottom-16 lg:left-52 lg:w-56"
      />
    </div>
  );
}
