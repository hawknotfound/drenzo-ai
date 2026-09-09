import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastInfo } from '../types';

interface ToastProps {
  toasts: ToastInfo[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3 rounded-xl bg-[#171226]/95 border border-[#33264D] shadow-2xl backdrop-blur-md text-white animate-in slide-in-from-bottom-3 duration-200"
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-400" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-purple-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white">{toast.title}</div>
              {toast.description && (
                <div className="text-[11px] text-[#A59CB8] mt-0.5 leading-snug">
                  {toast.description}
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#7A718F] hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
