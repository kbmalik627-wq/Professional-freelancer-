import React from 'react';
import { ShieldAlert, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface SecurityToastProps {
  message: string | null;
  onClose: () => void;
}

export const SecurityToast: React.FC<SecurityToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  const isSuccess =
    message.includes('Payment Verified') ||
    message.includes('Copied') ||
    message.includes('Liked') ||
    message.includes('Number Copy');

  const isWarning =
    message.includes('Pehle') ||
    message.includes('pehle hi Like') ||
    message.includes('Restricted');

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-slate-700 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div
        className={`p-2 rounded-xl shrink-0 ${
          isSuccess
            ? 'bg-emerald-500/20 text-emerald-400'
            : isWarning
            ? 'bg-amber-500/20 text-amber-400'
            : 'bg-blue-500/20 text-blue-400'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : isWarning ? (
          <AlertCircle className="w-5 h-5 text-amber-400" />
        ) : (
          <ShieldAlert className="w-5 h-5 text-blue-400" />
        )}
      </div>

      <div className="flex-1 text-sm font-medium leading-snug">
        <span
          className={`block text-[11px] font-bold uppercase tracking-wider mb-0.5 ${
            isSuccess
              ? 'text-emerald-400'
              : isWarning
              ? 'text-amber-300'
              : 'text-blue-300'
          }`}
        >
          {isSuccess ? 'System Success' : isWarning ? 'Notice' : 'Security Active'}
        </span>
        <span className="text-slate-100">{message}</span>
      </div>

      <button
        onClick={onClose}
        aria-label="Dismiss notice"
        className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
