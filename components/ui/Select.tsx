import { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, ...props }, ref): React.ReactElement => {
    return (
      <select
        className={`
          flex h-10 w-full appearance-none rounded-md border bg-surface
          px-3 py-2 pr-8 text-sm text-foreground
          placeholder:text-muted
          focus:outline-none focus:ring-2
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-border-subtle focus:ring-gold'}
          disabled:cursor-not-allowed disabled:opacity-50
          ${className ?? ''}
        `}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

export { Select };
