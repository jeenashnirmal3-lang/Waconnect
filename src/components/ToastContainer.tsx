import React from 'react';
import { ToastMessage } from '../store/useAppStore';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
      {toasts.map(toast => {
        let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;
        let borderClass = 'border-sky-500/30';
        let bgGlow = 'bg-sky-500/10';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/30';
          bgGlow = 'bg-emerald-500/10';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/30';
          bgGlow = 'bg-rose-500/10';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/30';
          bgGlow = 'bg-amber-500/10';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl glass-panel ${borderClass} ${bgGlow} transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-100">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1 rounded-md"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
