import type { ReactElement, ReactNode } from 'react';

export interface AncientScrollProps {
  /** Khi true, tờ giấy cuộn xuống từ trục trên (2.5s). Khi false, giấy cuộn lên và ẩn. */
  isOpen?: boolean;
  className?: string;
  /** Nội dung hiển thị trên giấy. Mặc định là lời nhắc nhập thông tin. */
  children?: ReactNode;
}

const DECOR_BAND_CLASS =
  'relative h-8 shrink-0 overflow-hidden bg-red-700 text-yellow-500/80 [&_svg]:h-full [&_svg]:w-full';

/** Họa tiết Greek key (meander) lặp lại, trang trí thuần túy. */
function MeanderBand({ id }: { id: string }): ReactElement {
  return (
    <div className={DECOR_BAND_CLASS}>
      <svg aria-hidden="true" focusable="false" preserveAspectRatio="none">
        <defs>
          <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M0 14 V2 H12 V10 H6 V6 H9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="miter"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

/** Trục cuộn ngang: thân đỏ, hai đầu vàng gold. */
function ScrollRoller(): ReactElement {
  return (
    <div className="relative z-20 h-8 w-full shrink-0">
      {/* Thân trục */}
      <div className="absolute inset-x-3 inset-y-1 rounded-lg border border-red-900 bg-linear-to-b from-red-500 via-red-600 to-red-800 shadow-lg" />
      {/* Đầu trục trái */}
      <div className="absolute left-0 top-1/2 h-10 w-4 -translate-y-1/2 rounded-l-full border border-yellow-700 bg-linear-to-r from-yellow-400 to-yellow-600 shadow" />
      {/* Đầu trục phải */}
      <div className="absolute right-0 top-1/2 h-10 w-4 -translate-y-1/2 rounded-r-full border border-yellow-700 bg-linear-to-l from-yellow-400 to-yellow-600 shadow" />
    </div>
  );
}

/**
 * Cuộn giấy cổ (chiếu thư) làm container cho lá số.
 * Đóng: chỉ thấy trục trên. Mở: giấy được "unroll" từ trên xuống dưới,
 * trục dưới đi theo mép giấy. Dùng grid-template-rows 0fr -> 1fr nên
 * không cần biết trước chiều cao nội dung.
 */
export function AncientScroll({
  isOpen = false,
  className = '',
  children,
}: AncientScrollProps): ReactElement {
  return (
    <div
      className={`relative mx-auto flex w-full flex-col py-2 ${className}`}
      data-testid="ancient-scroll"
      data-open={isOpen ? 'true' : 'false'}
    >
      <ScrollRoller />

      <div
        className={`grid transition-[grid-template-rows] duration-[2500ms] ease-in-out motion-reduce:transition-none ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        {/* inert: khi cuộn lại, nội dung bị ẩn không nhận focus và không đọc được */}
        <div className="min-h-0 overflow-hidden" inert={!isOpen}>
          <div className="flex flex-col border-x-4 border-red-700 bg-linear-to-b from-amber-100 via-amber-50 to-amber-100 shadow-inner">
            <MeanderBand id="ancient-scroll-meander-top" />

            {/* Chữ tối để đọc được trên nền giấy; các thẻ con tự đặt màu riêng */}
            <div className="flex min-h-64 flex-col justify-center px-4 py-6 text-amber-950 md:px-8">
              {children ?? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <span
                    aria-hidden="true"
                    className="select-none font-han text-7xl text-amber-900/20"
                  >
                    命
                  </span>
                  <h3 className="font-heading text-2xl text-amber-900">Tử Vi Đẩu Số</h3>
                  <div className="h-px w-3/4 bg-amber-800/40" />
                  <p className="text-sm leading-relaxed text-amber-800">
                    Nhập thông tin và nhấn{' '}
                    <span className="font-semibold">&ldquo;Lập lá số&rdquo;</span>
                  </p>
                </div>
              )}
            </div>

            <MeanderBand id="ancient-scroll-meander-bottom" />
          </div>
        </div>
      </div>

      <ScrollRoller />
    </div>
  );
}
