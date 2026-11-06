import { HTMLAttributes, forwardRef } from 'react';

export type CardVariant = 'default' | 'ancient' | 'ancient-hero' | 'ancient-soft' | 'ancient-ember';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `ancient`: khung lá bài/cổ thư với viền vàng và góc trang trí.
   * `ancient-hero`: biến thể nền tối cho phần giới thiệu.
   * `ancient-soft`: biến thể viền mảnh cho khối biểu mẫu.
   * `ancient-ember`: nền đỏ đen huyền bí cho huy hiệu Thiên Bàn Tử Vi.
   */
  variant?: CardVariant;
}

/** Hiệu ứng chuyển động dùng chung, tắt khi người dùng bật reduced-motion. */
const CARD_MOTION =
  'transition-[transform,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none motion-safe:hover:-translate-y-0.5';

/** Vòng focus nhất quán cho các thẻ có thể nhận tương tác bàn phím. */
const CARD_FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Viền gold mảnh bên trong, tạo cảm giác khung cổ thư mà không lấn nội dung. */
const ANCIENT_HAIRLINE =
  "relative before:pointer-events-none before:absolute before:inset-[5px] before:rounded-[inherit] before:border before:border-gold/20 before:content-['']";

export const CARD_VARIANT_CLASSES: Readonly<Record<CardVariant, string>> = {
  default: `border-border-subtle bg-linear-to-b from-surface to-background shadow-sm hover:border-gold/40 hover:shadow-[0_8px_24px_rgba(212,175,55,0.16)] ${CARD_MOTION} ${CARD_FOCUS}`,
  ancient: `${ANCIENT_HAIRLINE} border-gold/50 bg-linear-to-b from-surface to-background shadow-[0_0_24px_rgba(212,175,55,0.18)] hover:border-gold/70 hover:shadow-[0_10px_30px_rgba(212,175,55,0.24)] ${CARD_MOTION} ${CARD_FOCUS}`,
  'ancient-hero': `${ANCIENT_HAIRLINE} border-gold/35 bg-linear-to-b from-[#0d1712] via-surface to-background shadow-[0_0_24px_rgba(212,175,55,0.18)] hover:border-gold/55 hover:shadow-[0_10px_30px_rgba(212,175,55,0.22)] ${CARD_MOTION} ${CARD_FOCUS}`,
  'ancient-soft': `${ANCIENT_HAIRLINE} border-gold/30 bg-linear-to-b from-surface to-background/95 shadow-[0_0_24px_rgba(212,175,55,0.18)] hover:border-gold/50 hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] ${CARD_MOTION} ${CARD_FOCUS}`,
  'ancient-ember': `${ANCIENT_HAIRLINE} overflow-hidden border-gold/40 bg-[radial-gradient(circle_at_50%_16%,#240808_0%,#1c0505_44%,#120303_100%)] shadow-[0_0_38px_rgba(251,191,36,0.16)] hover:border-gold/60 hover:shadow-[0_12px_34px_rgba(251,191,36,0.22)] ${CARD_MOTION} ${CARD_FOCUS}`,
};

const CORNER_SIZE_CLASSES = {
  sm: 'h-3 w-3 m-1',
  md: 'h-4 w-4 m-2',
} as const;

/** Bốn góc trang trí dạng chữ L (decor thuần túy, ẩn khỏi screen reader). */
export function CornerOrnaments({
  size = 'md',
}: {
  size?: keyof typeof CORNER_SIZE_CLASSES;
}): React.ReactElement {
  const box = `pointer-events-none absolute border-2 border-gold/80 ${CORNER_SIZE_CLASSES[size]}`;
  return (
    <>
      <span aria-hidden="true" className={`${box} left-0 top-0 border-b-0 border-r-0`} />
      <span aria-hidden="true" className={`${box} right-0 top-0 border-b-0 border-l-0`} />
      <span aria-hidden="true" className={`${box} bottom-0 left-0 border-t-0 border-r-0`} />
      <span aria-hidden="true" className={`${box} bottom-0 right-0 border-t-0 border-l-0`} />
    </>
  );
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref): React.ReactElement => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border p-4 sm:p-6 ${CARD_VARIANT_CLASSES[variant]} ${className ?? ''}`}
        {...props}
      >
        {variant !== 'default' && <CornerOrnaments size="md" />}
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref): React.ReactElement => {
    return (
      <div ref={ref} className={`flex flex-col space-y-1.5 pb-4 ${className ?? ''}`} {...props} />
    );
  }
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref): React.ReactElement => {
    return (
      <h3
        ref={ref}
        className={`font-serif text-xl font-semibold leading-none tracking-tight text-foreground ${className ?? ''}`}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref): React.ReactElement => {
    return <div ref={ref} className={`text-muted ${className ?? ''}`} {...props} />;
  }
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
