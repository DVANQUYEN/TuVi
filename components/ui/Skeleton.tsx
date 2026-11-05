import { HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps): React.ReactElement {
  return <div className={`animate-pulse rounded-md bg-muted ${className ?? ''}`} {...props} />;
}
