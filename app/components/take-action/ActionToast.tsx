'use client';

import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ActionToastProps {
  message: string;
  onDismiss: () => void;
}

export function ActionToast({ message, onDismiss }: ActionToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg max-w-md text-sm font-medium"
    >
      <CheckCircle size={18} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
