import { create } from 'zustand';

interface ToastState {
  message: string;
  visible: boolean;
  showToast: (message: string) => void;
  hideToast: () => void;
}

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  visible: false,

  showToast: (message: string) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message, visible: true });
    hideTimer = setTimeout(() => {
      set({ visible: false });
    }, 2800);
  },

  hideToast: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ visible: false });
  },
}));

export const showToast = (message: string) => {
  useToastStore.getState().showToast(message);
};
