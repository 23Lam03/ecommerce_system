import { Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  target: 'all' | 'shops' | 'customers';
  sentAt: Date;
  status: 'sent' | 'draft';
}

@Component({
  selector: 'app-admin-notification-management',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './notification-management.html',
  styleUrl: './notification-management.css',
})
export class NotificationManagementComponent {
  private readonly notification = inject(NotificationService);

  protected readonly isSending = signal(false);
  protected readonly notifications = signal<NotificationItem[]>([
    { id: '1', title: 'Thông báo bảo trì hệ thống', message: 'Hệ thống sẽ bảo trì từ 02:00-04:00 ngày 01/12/2025', target: 'all', sentAt: new Date('2025-11-28'), status: 'sent' },
    { id: '2', title: 'Chương trình khuyến mãi Tết 2026', message: 'Giảm 20% cho tất cả đơn hàng từ 500K trong tháng 12', target: 'shops', sentAt: new Date('2025-11-25'), status: 'sent' },
    { id: '3', title: 'Cập nhật chính sách đổi trả', message: 'Chính sách đổi trả mới có hiệu lực từ 01/12/2025', target: 'customers', sentAt: new Date('2025-11-20'), status: 'sent' },
  ]);

  protected readonly draft = signal({
    title: '',
    message: '',
    target: 'all' as 'all' | 'shops' | 'customers',
  });

  protected sendNotification(): void {
    const d = this.draft();
    if (!d.title.trim() || !d.message.trim()) {
      this.notification.warning('Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }
    this.isSending.set(true);
    setTimeout(() => {
      const newItem: NotificationItem = {
        id: Date.now().toString(),
        title: d.title.trim(),
        message: d.message.trim(),
        target: d.target,
        sentAt: new Date(),
        status: 'sent',
      };
      this.notifications.update(list => [newItem, ...list]);
      this.draft.set({ title: '', message: '', target: 'all' });
      this.isSending.set(false);
      this.notification.success('Đã gửi thông báo thành công');
    }, 600);
  }
}
