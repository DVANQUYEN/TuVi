import Link from 'next/link';
import type { Metadata } from 'next';
import { ZodiacCompatibilitySection } from '@/components/horoscope/ZodiacCompatibilitySection';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  BRANCH_LABELS,
  LUC_HOP_PAIRS,
  TAM_HOP_GROUPS,
  TU_HANH_XUNG_GROUPS,
  type ZodiacBranchGroup,
  type ZodiacBranchPair,
} from '@/lib/ziwei/zodiac-compatibility';

export const metadata: Metadata = {
  title: 'Xem tuổi hợp – Sao Mệnh',
  description:
    'Tra cứu tam hợp, lục hợp và tứ hành xung theo năm sinh để tham khảo khi chọn tuổi kết giao, hợp tác và đồng hành.',
};

function formatBranches(branches: ZodiacBranchGroup): string {
  return branches.map((branch) => BRANCH_LABELS[branch]).join(' – ');
}

function formatPair([left, right]: ZodiacBranchPair): string {
  return `${BRANCH_LABELS[left]} – ${BRANCH_LABELS[right]}`;
}

function BranchGroupList({ groups }: { groups: readonly ZodiacBranchGroup[] }): React.ReactElement {
  return (
    <ul className="space-y-1.5">
      {groups.map((group) => (
        <li
          key={group.join('-')}
          className="rounded-md border border-border-subtle bg-elevated px-3 py-1.5 text-sm text-foreground"
        >
          {formatBranches(group)}
        </li>
      ))}
    </ul>
  );
}

function BranchPairList({ pairs }: { pairs: readonly ZodiacBranchPair[] }): React.ReactElement {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {pairs.map((pair) => (
        <li
          key={pair.join('-')}
          className="rounded-md border border-border-subtle bg-elevated px-3 py-1.5 text-sm text-foreground"
        >
          {formatPair(pair)}
        </li>
      ))}
    </ul>
  );
}

function ZodiacGuideSection(): React.ReactElement {
  return (
    <section aria-labelledby="zodiac-guide-heading" className="mt-12 space-y-6">
      <div className="max-w-3xl">
        <h2
          id="zodiac-guide-heading"
          className="mb-2 font-serif text-2xl font-bold text-gold sm:text-3xl"
        >
          Tam hợp – Lục hợp – Tứ hành xung là gì?
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          Đây là ba cách nhóm tuổi theo Địa chi, thường được dùng để tham khảo về sự hòa hợp trong
          kết giao, hợp tác và đời sống.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tam hợp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">
              Nhóm 3 tuổi cùng hành, cùng âm dương, dễ đồng cảm và hỗ trợ nhau.
            </p>
            <BranchGroupList groups={TAM_HOP_GROUPS} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lục hợp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">
              6 cặp tuổi hòa hợp, có xu hướng bổ trợ và mang lại cân bằng cho nhau.
            </p>
            <BranchPairList pairs={LUC_HOP_PAIRS} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tứ hành xung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed">
              3 nhóm 4 tuổi khắc nhau, cần thêm bao dung khi hợp tác hoặc chung sống.
            </p>
            <BranchGroupList groups={TU_HANH_XUNG_GROUPS} />
          </CardContent>
        </Card>
      </div>

      <p className="max-w-3xl text-xs leading-relaxed text-muted">
        Đây là cách nhìn tham khảo, không phải cấm kỵ tuyệt đối. Sự thấu hiểu và bao dung vẫn là nền
        tảng của mọi mối quan hệ.
      </p>
    </section>
  );
}

export default function XemTuoiPage(): React.ReactElement {
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
              Xem tuổi
            </li>
          </ol>
        </nav>

        <div className="mb-8 max-w-3xl">
          <h1 className="mb-3 font-serif text-3xl font-bold text-gold sm:text-4xl">
            Tam hợp – Lục hợp – Tứ hành xung
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Nhập năm sinh để xem nhóm tuổi tam hợp, lục hợp và tứ hành xung của bạn. Đây là cách
            nhìn tham khảo về sự hòa hợp trong kết giao, hợp tác và đời sống.
          </p>
        </div>

        <ZodiacCompatibilitySection />
        <ZodiacGuideSection />
      </main>

      <Footer />
    </div>
  );
}
