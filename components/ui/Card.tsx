import { HTMLAttributes, forwardRef } from 'react';

export type CardVariant = 'default' | 'ancient';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `ancient`: khung lá bài/cổ thư với viền vàng và góc trang trí. */
  variant?: CardVariant;
}

export const CARD_VARIANT_CLASSES: Readonly<Record<CardVariant, string>> = {
  default: 'border-border-subtle bg-surface shadow-sm',
  ancient:
    'relative border-gold/50 bg-linear-to-b from-surface to-background shadow-[0_0_24px_rgba(212,175,55,0.18)]',
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
        className={`rounded-lg border p-6 ${CARD_VARIANT_CLASSES[variant]} ${className ?? ''}`}
        {...props}
      >
        {variant === 'ancient' && <CornerOrnaments size="md" />}
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
