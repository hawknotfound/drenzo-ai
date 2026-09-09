import { useState, useCallback, useRef } from 'react';

export interface ToastInfo {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export function useToast(duration = 3500) {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const showToast = useCallback((title: string, description?: string, type: ToastInfo['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const toast: ToastInfo = { id, title, description, type };
    setToasts(prev => [...prev, toast]);

    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timers.current.delete(id);
    }, duration);
    timers.current.set(id, timer);
  }, [duration]);

  const dismissToast = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
