import type { CSSProperties, ReactElement, ReactNode } from 'react';

export interface AncientScrollProps {
  /** Khi true, tờ giấy cuộn xuống từ trục trên (1.4s). Khi false, giấy cuộn lên và ẩn. */
  isOpen?: boolean;
  className?: string;
  /** Nội dung hiển thị trên giấy. Mặc định là lời nhắc nhập thông tin. */
  children?: ReactNode;
}

const DECOR_BAND_CLASS =
  'relative h-8 shrink-0 overflow-hidden border-y border-[#4e110c]/60 bg-[linear-gradient(180deg,#8d2a1e_0%,#711910_50%,#8d2a1e_100%)] text-[#e7c873]/80 shadow-[inset_0_1px_0_rgba(255,215,130,0.22),inset_0_-1px_0_rgba(0,0,0,0.3)] [&_svg]:h-full [&_svg]:w-full';

/**
 * Nền giấy da cừu nhiều lớp. Dùng màu cố định thay vì token theme để chữ tối
 * luôn đủ tương phản trên giấy ở cả chế độ sáng, tối và bản in/PDF.
 */
const PAPER_BACKGROUND: CSSProperties = {
  backgroundImage:
    'radial-gradient(ellipse at 18% 8%, rgba(255,255,255,0.55), transparent 58%), ' +
    'radial-gradient(ellipse at 82% 16%, rgba(255,255,255,0.4), transparent 55%), ' +
    'linear-gradient(180deg, #eed9ac 0%, #f8ecd0 12%, #fbf2da 34%, #f4e4bf 68%, #e9d2a2 100%)',
};

/**
 * Hạt giấy và mây mờ: hai lớp chấm nhỏ cộng hai mảng mây lớn, thuần CSS nên
 * không phụ thuộc ảnh ngoài và vẫn giữ được khi xuất PDF.
 */
const PAPER_TEXTURE: CSSProperties = {
  backgroundImage:
    'radial-gradient(rgba(120,84,34,0.10) 0.5px, transparent 0.6px), ' +
    'radial-gradient(rgba(120,84,34,0.07) 0.5px, transparent 0.6px), ' +
    'radial-gradient(ellipse at 28% 38%, rgba(150,112,54,0.10), transparent 46%), ' +
    'radial-gradient(ellipse at 72% 70%, rgba(150,112,54,0.08), transparent 44%)',
  backgroundSize: '3px 3px, 5px 5px, 100% 100%, 100% 100%',
  backgroundPosition: '0 0, 1px 2px, 0 0, 0 0',
};

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

/** Trục cuộn ngang: thân đỏ nhiều lớp, hai đầu vàng gold và các vòng điểm nhấn. */
function ScrollRoller(): ReactElement {
  return (
    <div className="relative z-20 h-9 w-full shrink-0" aria-hidden="true">
      {/* Thân trục */}
      <div className="absolute inset-x-2 inset-y-1 rounded-full border border-[#5e140f] bg-[linear-gradient(180deg,#a53325_0%,#7f2118_45%,#5a140e_100%)] shadow-[0_3px_8px_rgba(0,0,0,0.35)]" />
      {/* Vệt sáng dọc thân trục */}
      <div className="absolute inset-x-5 top-1.5 h-1 rounded-full bg-white/20 blur-[1px]" />
      {/* Vòng kim loại hai bên thân trục */}
      <div className="absolute left-3 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[#e7c873]/35" />
      <div className="absolute right-3 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[#e7c873]/35" />
      {/* Đầu trục trái */}
      <div className="absolute left-0 top-1/2 h-11 w-4 -translate-y-1/2 rounded-l-full border border-[#8a5b14] bg-[linear-gradient(90deg,#f3cf68_0%,#c79a30_55%,#8a5b14_100%)] shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
      {/* Đầu trục phải */}
      <div className="absolute right-0 top-1/2 h-11 w-4 -translate-y-1/2 rounded-r-full border border-[#8a5b14] bg-[linear-gradient(270deg,#f3cf68_0%,#c79a30_55%,#8a5b14_100%)] shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
    </div>
  );
}

/** Bốn góc trang trí dạng chữ L, đặt trên khung gold bên trong giấy. */
function PaperCornerOrnaments(): ReactElement {
  const base = 'pointer-events-none absolute z-10 h-4 w-4 border-[#a97422]/85';
  return (
    <>
      <span aria-hidden="true" className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

/** Dải tiêu đề nhỏ, chữ serif màu nâu vàng để không lẫn với nội dung lá số. */
function TitleBand(): ReactElement {
  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-linear-to-r from-transparent via-[#a97422]/55 to-[#a97422]/55"
      />
      <span className="select-none font-serif text-xs tracking-[0.38em] text-[#7a5518]">
        Chiếu thư
      </span>
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-linear-to-l from-transparent via-[#a97422]/55 to-[#a97422]/55"
      />
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
        className={`grid transition-[grid-template-rows] duration-[1400ms] ease-in-out motion-reduce:transition-none ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        {/* inert: khi cuộn lại, nội dung bị ẩn không nhận focus và không đọc được */}
        <div className="min-h-0 overflow-hidden" inert={!isOpen}>
          <div
            className="relative flex flex-col overflow-hidden rounded-[3px] border-x-4 border-[#7a2318] shadow-[0_18px_44px_rgba(0,0,0,0.38)] sm:border-x-[10px]"
            style={PAPER_BACKGROUND}
          >
            {/* Hạt giấy và mây mờ, nằm dưới nội dung */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 opacity-70 mix-blend-multiply"
              style={PAPER_TEXTURE}
            />

            <MeanderBand id="ancient-scroll-meander-top" />

            {/* Khung gold kép bên trong, bao quanh phần nội dung */}
            <div className="relative z-10 mx-2 my-2 border border-[#a97422]/75 p-[3px] sm:mx-3">
              <div className="relative border border-[#a97422]/35 px-2 py-4 sm:px-4 sm:py-5 md:px-8">
                <PaperCornerOrnaments />
                <TitleBand />

                {/* Chữ tối cố định để đọc được trên nền giấy; các thẻ con tự đặt màu riêng */}
                <div className="flex min-h-48 flex-col justify-center text-[#3f2c16] sm:min-h-64">
                  {children ?? (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span
                        aria-hidden="true"
                        className="select-none font-han text-7xl text-[#6b4a1d]/20"
                      >
                        命
                      </span>
                      <h3 className="font-heading text-2xl text-[#5a3c13]">Tử Vi Đẩu Số</h3>
                      <div className="h-px w-3/4 bg-[#8a6420]/40" />
                      <p className="text-sm leading-relaxed text-[#5a421f]">
                        Nhập thông tin và nhấn{' '}
                        <span className="font-semibold">&ldquo;Lập lá số&rdquo;</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <MeanderBand id="ancient-scroll-meander-bottom" />
          </div>
        </div>
      </div>

      <ScrollRoller />
    </div>
  );
}
