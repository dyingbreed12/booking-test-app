import type { ReactNode } from 'react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
  icon?: ReactNode;
}

export default function Toast({ type, message, onClose, icon }: ToastProps) {
  return (
    <div className="pointer-events-auto w-full max-w-sm rounded-3xl border bg-white px-4 py-4 shadow-2xl ring-1 ring-slate-900/5">
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 flex h-8 w-8 items-center justify-center rounded-2xl ${
            type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}
        >
          {icon ?? (type === 'success' ? '✓' : '!')}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{type === 'success' ? 'Success' : 'Error'}</p>
          <p className="mt-1 text-sm text-slate-700">{message}</p>
        </div>
        {onClose ? (
          <button type="button" onClick={onClose} className="text-slate-400 transition hover:text-slate-700">
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}
