import { create } from 'zustand';

interface AlertState {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  isDestructive?: boolean;
  linkText?: string;
  linkUrl?: string;
  onConfirm?: () => void;
  onCancel?: () => void;

  showAlert: (
    config: Partial<Omit<AlertState, 'visible' | 'showAlert' | 'hideAlert'>>,
  ) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  message: '',
  title: 'Alert',
  confirmText: 'OK',
  cancelText: 'Cancel',
  showCancel: false,
  isDestructive: false,
  linkText: undefined,
  linkUrl: undefined,

  showAlert: (config) =>
    set({
      visible: true,
      title: config.title ?? 'Alert',
      message: config.message ?? '',
      confirmText: config.confirmText ?? 'OK',
      cancelText: config.cancelText ?? 'Cancel',
      showCancel: config.showCancel ?? false,
      isDestructive: config.isDestructive ?? false,
      linkText: config.linkText,
      linkUrl: config.linkUrl,
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
    }),

  hideAlert: () =>
    set({
      visible: false,
      linkText: undefined,
      linkUrl: undefined,
      onConfirm: undefined,
      onCancel: undefined,
    }),
}));
