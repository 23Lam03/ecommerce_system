import { Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';
import { DatePipe } from '@angular/common';

interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount: number;
  startDate: Date;
  endDate: Date;
  target: 'all' | 'shops' | 'customers';
  status: 'active' | 'inactive' | 'expired';
}

@Component({
  selector: 'app-admin-promotion-management',
  standalone: true,
  imports: [],
  templateUrl: './promotion-management.html',
  styleUrl: './promotion-management.css',
})
export class PromotionManagementComponent {
  private readonly notification = inject(NotificationService);

  protected readonly promotions = signal<Promotion[]>([
    { id: '1', title: 'WELCOME10', description: 'Giảm 10% cho đơn từ 200K cho khách hàng mới', code: 'WELCOME10', type: 'percentage', value: 10, minOrder: 200000, maxDiscount: 100000, startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), target: 'customers', status: 'active' },
    { id: '2', title: 'SALE50K', description: 'Giảm 50.000đ cho đơn từ 500K', code: 'SALE50K', type: 'fixed', value: 50000, minOrder: 500000, maxDiscount: 50000, startDate: new Date('2025-01-01'), endDate: new Date('2025-06-30'), target: 'all', status: 'expired' },
    { id: '3', title: 'MEGA20', description: 'Giảm 20% đơn từ 1 triệu', code: 'MEGA20', type: 'percentage', value: 20, minOrder: 1000000, maxDiscount: 500000, startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), target: 'all', status: 'active' },
  ]);

  protected readonly showForm = signal(false);

  protected fmtCurrency(v: number): string {
    return v.toLocaleString('vi-VN') + 'đ';
  }

  protected fmtDate(d: Date): string {
    return d.toLocaleDateString('vi-VN');
  }

  protected toggleStatus(id: string): void {
    this.promotions.update(list =>
      list.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p)
    );
    this.notification.success('Đã cập nhật trạng thái');
  }

  protected deletePromotion(id: string): void {
    this.promotions.update(list => list.filter(p => p.id !== id));
    this.notification.success('Đã xóa khuyến mãi');
  }

  protected statusLabel(s: string): string {
    return { "active": "Đang hoạt động", "inactive": "Tạm ngưng", "expired": "Đã hết hạn" }[s] ?? s;
  }

  protected statusClass(s: string): string {
    return { "active": "bg-emerald-100 text-emerald-800", "inactive": "bg-slate-200 text-slate-600", "expired": "bg-red-100 text-red-800" }[s] ?? '';
  }

  protected targetLabel(t: string): string {
    return { "all": "Tất cả", "shops": "Cửa hàng", "customers": "Khách hàng" }[t] ?? t;
  }
}
