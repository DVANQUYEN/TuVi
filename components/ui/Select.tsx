import { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref): React.ReactElement => {
    return (
      <div className="relative w-full">
        <select
          className={`
            flex h-11 w-full appearance-none rounded-md border bg-surface
            px-3 py-2 pr-10 text-sm text-foreground
            placeholder:text-muted
            focus:outline-none focus:ring-2
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-border-subtle focus:ring-gold'}
            disabled:cursor-not-allowed disabled:opacity-50
            sm:h-10
            ${className ?? ''}
          `}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        >
          <path d="m6 8 4 4 4-4" />
        </svg>
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
