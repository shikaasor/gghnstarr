// app/components/layout/Container.tsx
import { clsx } from 'clsx';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx('w-full px-4 sm:px-6 lg:px-10', className)}>
      {children}
    </div>
  );
}
