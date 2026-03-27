import { create } from 'zustand';
import { Toast, ConfirmAction, ToastType } from '../types/notifications';
import { generateId } from '../utils/id';

interface ToastState {
  toasts: Toast[];
  confirmAction: ConfirmAction | null;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  requestConfirm: (action: Omit<ConfirmAction, 'id'>) => void;
  clearConfirm: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  confirmAction: null,
  addToast: (toast) => {
    const id = generateId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    if (toast.duration !== 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, toast.duration || 3000);
    }
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  requestConfirm: (action) => set({ confirmAction: { ...action, id: generateId() } }),
  clearConfirm: () => set({ confirmAction: null }),
}));

export const toastManager = {
  success: (title: string, message?: string) => useToastStore.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) => useToastStore.getState().addToast({ type: 'error', title, message }),
  info: (title: string, message?: string) => useToastStore.getState().addToast({ type: 'info', title, message }),
  warning: (title: string, message?: string) => useToastStore.getState().addToast({ type: 'warning', title, message }),
  confirm: (action: Omit<ConfirmAction, 'id'>) => useToastStore.getState().requestConfirm(action),
};
