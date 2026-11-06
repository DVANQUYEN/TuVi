import { StarryBackground } from '@/components/animation/StarryBackground';

/**
 * Global decorative backdrop shared by every route. CSS gradients only: a
 * midnight purple/blue nebula wash, a faint gold halo, the animated starfield,
 * and a bottom vignette that keeps page content grounded.
 */
export function GlobalSkyBackdrop(): React.ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base midnight wash. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#070912',
          backgroundImage: [
            'radial-gradient(ellipse 90% 70% at 22% 18%, rgba(64,44,126,0.34) 0%, rgba(38,26,82,0.18) 46%, transparent 78%)',
            'radial-gradient(ellipse 76% 62% at 82% 22%, rgba(31,58,116,0.30) 0%, transparent 74%)',
            'radial-gradient(ellipse 70% 58% at 58% 78%, rgba(88,46,116,0.20) 0%, transparent 78%)',
            'linear-gradient(158deg, #060813 0%, #0e0c20 44%, #0a0e1a 100%)',
          ].join(', '),
        }}
      />

      {/* Faint gold vignette to echo the brand accent without competing with copy. */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 52% 44% at 74% 10%, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.03) 46%, transparent 76%)',
            'radial-gradient(ellipse 120% 96% at 50% 46%, transparent 52%, rgba(3,4,10,0.42) 100%)',
          ].join(', '),
        }}
      />

      <StarryBackground />

      {/* Bottom vignette keeps footers and lower page content legible. */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            'linear-gradient(to top, rgba(4,5,12,0.72) 0%, rgba(6,7,16,0.42) 38%, rgba(8,9,20,0.16) 70%, transparent 100%)',
        }}
      />
    </div>
  );
}
