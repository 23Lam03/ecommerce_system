import { Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ticket {
  id: string;
  subject: string;
  type: 'technical' | 'order' | 'payment' | 'other';
  customerName: string;
  email: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
}

@Component({
  selector: 'app-admin-support-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './support-management.html',
  styleUrl: './support-management.css',
})
export class SupportManagementComponent {
  private readonly notification = inject(NotificationService);

  protected readonly statusFilter = signal<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  protected readonly replyingTo = signal<string | null>(null);
  protected readonly replyText = signal('');

  protected readonly tickets = signal<Ticket[]>([
    { id: '1', subject: 'Không thể thanh toán qua ví điện tử', type: 'payment', customerName: 'Nguyễn Văn An', email: 'an@demo.com', status: 'open', createdAt: new Date('2025-11-28') },
    { id: '2', subject: 'Yêu cầu hoàn tiền đơn hàng #DH20240002', type: 'order', customerName: 'Phạm Hồng Đào', email: 'dao@demo.com', status: 'in_progress', createdAt: new Date('2025-11-27') },
    { id: '3', subject: 'Lỗi hiển thị sản phẩm trên app', type: 'technical', customerName: 'Võ Thanh Sơn', email: 'son@demo.com', status: 'resolved', createdAt: new Date('2025-11-25') },
    { id: '4', subject: 'Cửa hàng không phản hồi tin nhắn', type: 'other', customerName: 'Lê Minh Tuấn', email: 'tuan@demo.com', status: 'open', createdAt: new Date('2025-11-24') },
  ]);

  protected fmtDate(d: Date): string {
    return d.toLocaleDateString('vi-VN');
  }

  protected statusLabel(s: string): string {
    return { "open": "Mới", "in_progress": "Đang xử lý", "resolved": "Đã giải quyết", "closed": "Đã đóng" }[s] ?? s;
  }

  protected statusClass(s: string): string {
    return { "open": "bg-amber-100 text-amber-800", "in_progress": "bg-blue-100 text-blue-800", "resolved": "bg-emerald-100 text-emerald-800", "closed": "bg-slate-200 text-slate-600" }[s] ?? '';
  }

  protected typeLabel(t: string): string {
    return { "technical": "Kỹ thuật", "order": "Đơn hàng", "payment": "Thanh toán", "other": "Khác" }[t] ?? t;
  }

  protected startReply(id: string): void {
    this.replyingTo.set(id);
    this.replyText.set('');
  }

  protected submitReply(id: string): void {
    this.tickets.update(list =>
      list.map(t => t.id === id ? { ...t, status: 'in_progress' as const } : t)
    );
    this.notification.success('Đã gửi phản hồi');
    this.replyingTo.set(null);
    this.replyText.set('');
  }

  protected closeTicket(id: string): void {
    this.tickets.update(list =>
      list.map(t => t.id === id ? { ...t, status: 'closed' as const } : t)
    );
    this.notification.success('Đã đóng ticket');
  }
}
