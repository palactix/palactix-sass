import { ReactNode } from "react";

export type ConfirmDialogVariant = "default" | "destructive" | "success" | "warning" | "info";

export interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  icon?: ReactNode;
}

type ConfirmCallback = (confirmed: boolean) => void;

interface ConfirmRequest extends ConfirmOptions {
  id: string;
  resolve: ConfirmCallback;
}

class ConfirmationEmitter {
  private listeners: Set<(request: ConfirmRequest | null) => void> = new Set();
  private currentRequest: ConfirmRequest | null = null;

  subscribe(listener: (request: ConfirmRequest | null) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.currentRequest));
  }

  confirm(options: ConfirmOptions = {}): Promise<boolean> {
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substring(7);
      
      this.currentRequest = {
        ...options,
        id,
        resolve: (confirmed: boolean) => {
          this.currentRequest = null;
          this.notify();
          resolve(confirmed);
        }
      };

      this.notify();
    });
  }

  handleConfirm() {
    if (this.currentRequest) {
      this.currentRequest.resolve(true);
    }
  }

  handleCancel() {
    if (this.currentRequest) {
      this.currentRequest.resolve(false);
    }
  }

  getCurrentRequest() {
    return this.currentRequest;
  }
}

export const confirmationEmitter = new ConfirmationEmitter();

// Main confirm function - use this in your components
export function confirm(options: ConfirmOptions = {}): Promise<boolean> {
  return confirmationEmitter.confirm(options);
}
