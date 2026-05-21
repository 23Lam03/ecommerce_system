import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  private readonly _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private show(type: ToastMessage['type'], title: string, message: string, duration = 3000): void {
    const toast: ToastMessage = { id: this.nextId++, type, title, message, duration };
    this._toasts.update(t => [...t, toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  success(message: string, title = 'Thành công'): void {
    this.show('success', title, message);
  }

  error(message: string, title = 'Lỗi'): void {
    this.show('error', title, message, 5000);
  }

  warning(message: string, title = 'Cảnh báo'): void {
    this.show('warning', title, message, 4000);
  }

  info(message: string, title = 'Thông báo'): void {
    this.show('info', title, message);
  }

  dismiss(id: number): void {
    this._toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
