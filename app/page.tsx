import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ZodiacWheel } from '@/components/animation/ZodiacWheel';
import { HomeGalaxyVideo } from '@/components/home/HomeGalaxyVideo';

/** Gold-foil treatment for the hero title. Keeps the copy readable while adding
 * a metallic sheen and a soft warm halo that works on the dark hero in both themes.
 * Every stop stays at >= 3:1 on the hero's #171330 backdrop for large text. */
const HERO_TITLE_FOIL: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(104deg, #d8a93a 0%, #e8c25a 16%, #f7e7a2 34%, #fff7d0 48%, #f2d675 62%, #f6dd8a 78%, #d9ad45 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  filter: 'drop-shadow(0 0 16px rgba(212,175,55,0.30)) drop-shadow(0 0 40px rgba(255,183,77,0.18))',
};

export default function Home(): React.ReactElement {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section
          aria-labelledby="home-hero-title"
          className="relative isolate overflow-hidden px-4 pb-12 pt-10 sm:px-6 md:pt-14 lg:flex lg:min-h-[calc(100svh_-_4rem)] lg:items-center lg:px-8 lg:py-8"
        >
          {/* Video thiên hà (desktop) hoặc nền tinh vân tĩnh, kèm lớp phủ tối giữ
              tương phản cho chữ hero. Chỉ phủ trong phạm vi hero. */}
          <HomeGalaxyVideo />
          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
            <div className="relative isolate mx-auto w-full max-w-2xl min-w-0 text-center lg:mx-0 lg:text-left">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-8 -top-14 -z-10 h-[145%] blur-3xl"
                style={{
                  background:
                    'radial-gradient(ellipse 72% 56% at 40% 45%, rgba(212,175,55,0.18) 0%, rgba(124,72,160,0.10) 46%, transparent 74%)',
                }}
              />
              <h1
                id="home-hero-title"
                className="hero-title-foil text-balance font-serif text-4xl font-bold leading-[1.08] tracking-[0.01em] sm:text-5xl lg:text-5xl xl:text-6xl"
                style={HERO_TITLE_FOIL}
              >
                <span className="block">Khám phá vận mệnh theo</span>{' '}
                <span className="block">Tử Vi Đẩu Số</span>
              </h1>
              <span
                data-testid="hero-divider"
                aria-hidden="true"
                className="mx-auto mt-6 block h-px w-24 bg-linear-to-r from-transparent via-[#d4af37] to-transparent lg:mx-0 lg:from-[#d4af37]"
              />
              <p
                className="mt-6 text-base text-[#d8ccae] sm:text-lg"
                style={{ textShadow: '0 1px 14px rgba(0,0,0,0.55)' }}
              >
                Lập lá số chính xác theo trường phái Việt Nam, lịch âm UTC+7.
              </p>
            </div>
            <div className="flex min-w-0 justify-center lg:justify-end">
              <ZodiacWheel sizeClassName="w-[min(18rem,100%)] md:w-[26rem] lg:w-[min(26rem,calc(100svh_-_14rem))]" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Lá số chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                Hiển thị đầy đủ 12 cung, chính tinh, phụ tinh và các yếu tố theo trường phái Nam
                phái.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tử vi hàng ngày</CardTitle>
              </CardHeader>
              <CardContent>
                Xem vận hạn, sao hạn và lời khuyên theo từng ngày dựa trên lá số của bạn.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hợp tuổi</CardTitle>
              </CardHeader>
              <CardContent>
                So sánh lá số, ngũ hành và độ hợp nhau trong quan hệ đối tác, hôn nhân.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
