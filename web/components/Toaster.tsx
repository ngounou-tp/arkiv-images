'use client';

import { useEffect, useState } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface Props {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function Toaster({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const colors = {
    success: 'bg-ink text-cream border-ink',
    info: 'bg-amber text-ink border-amber-dark',
    error: 'bg-red-600 text-white border-red-700',
  };

  const icons = {
    success: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    info: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    error: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 border shadow-lg min-w-[240px] max-w-xs
        animate-scale-in ${colors[toast.type]}
      `}
    >
      <span className="flex-shrink-0">{icons[toast.type]}</span>
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

// Hook
let toastId = 0;
export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${++toastId}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
