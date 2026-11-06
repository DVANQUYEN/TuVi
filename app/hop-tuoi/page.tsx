import Link from 'next/link';
import type { Metadata } from 'next';
import { CompatibilityForm } from '@/components/horoscope/CompatibilityForm';
import { LoveYearLookupSection } from '@/components/horoscope/love/LoveYearLookupSection';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Tình Duyên Tử Vi - Sao Mệnh',
  description:
    'Đối chiếu hai lá số Tử Vi để xem duyên phận, mức độ hòa hợp và những điều cần lưu ý trên đường đồng hành; kèm phần tra cứu tình duyên theo năm sinh.',
};

export default function HopTuoiPage(): React.ReactElement {
  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-background/70">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-gold">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-gold">
              Tình duyên
            </li>
          </ol>
        </nav>

        <CompatibilityForm />

        <div className="mx-auto mt-16 max-w-4xl border-t border-border-subtle pt-10">
          <LoveYearLookupSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
