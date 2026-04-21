// app/components/layout/Container.tsx
import { clsx } from 'clsx';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx('max-w-5xl mx-auto px-4 sm:px-6', className)}>
      {children}
    </div>
  );
}
