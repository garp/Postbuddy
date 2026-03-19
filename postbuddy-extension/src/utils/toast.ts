// src/utils/toast.ts
import { PLATFORM_NAMES } from '../constants/platforms';

let activeToast: HTMLDivElement | null = null;

export const showToast = (message: string, platform?: string) => {
  // Remove existing toast if present
  if (activeToast) {
    document.body.removeChild(activeToast);
    activeToast = null;
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast success-toast';

  // Create toast content (similar to your original implementation)
  // ... (include the same toast creation logic from your original code)

  // Add to document
  document.body.appendChild(toast);
  activeToast = toast;

  // Show and hide logic
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) document.body.removeChild(toast);
      if (activeToast === toast) activeToast = null;
    }, 500);
  }, 3000);
};