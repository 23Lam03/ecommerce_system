import { Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../../../core/services/notification.service';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  used: number;
  active: boolean;
}

@Component({
  selector: 'app-shop-promotion-management',
  standalone: true,
  imports: [],
  templateUrl: './promotion-management.html',
  styleUrl: './promotion-management.css',
})
export class PromotionManagementComponent {
  protected readonly notification = inject(NotificationService);
  protected readonly Number = Number;

  protected fmtCurrency(v: number): string {
    return v.toLocaleString('vi-VN') + 'đ';
  }

  protected readonly coupons = signal<Coupon[]>([
    { id: '1', code: 'SUMMER20', type: 'percentage', value: 20, minOrder: 500000, maxDiscount: 100000, usageLimit: 100, used: 45, active: true },
    { id: '2', code: 'FREESHIP', type: 'fixed', value: 30000, minOrder: 200000, maxDiscount: 30000, usageLimit: 200, used: 123, active: true },
    { id: '3', code: 'NEWUSER', type: 'percentage', value: 15, minOrder: 0, maxDiscount: 50000, usageLimit: 500, used: 234, active: true },
  ]);

  protected readonly newCoupon = signal<Partial<Coupon>>({
    type: 'percentage',
    value: 10,
    minOrder: 0,
    maxDiscount: 50000,
    usageLimit: 100,
    active: true,
  });

  protected generateCode(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.newCoupon.update(c => ({ ...c, code }));
  }

  protected toggleActive(id: string): void {
    this.coupons.update(list =>
      list.map(c => c.id === id ? { ...c, active: !c.active } : c)
    );
    this.notification.success('Đã cập nhật trạng thái mã giảm giá');
  }
}
