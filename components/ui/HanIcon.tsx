import type { ReactElement } from 'react';

export interface HanIconProps {
  /** Chữ Hán hiển thị (1 ký tự). */
  han: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES: Readonly<Record<NonNullable<HanIconProps['size']>, string>> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

/**
 * Biểu tượng chữ Hán trang trí (thay cho emoji). Ẩn khỏi screen reader:
 * nhãn ý nghĩa luôn được cung cấp bởi văn bản xung quanh.
 */
export function HanIcon({ han, className = '', size = 'md' }: HanIconProps): ReactElement {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center font-han leading-none text-gold ${SIZE_CLASSES[size]} ${className}`}
    >
      {han}
    </span>
  );
}
