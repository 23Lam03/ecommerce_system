import { Component, inject, computed } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-shop-payment-management',
  standalone: true,
  imports: [],
  templateUrl: './payment-management.html',
  styleUrl: './payment-management.css',
})
export class PaymentManagementComponent {
  private readonly orderService = inject(OrderService);
  private readonly auth = inject(AuthService);

  protected readonly shopId = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') return this.auth.getShopByOwnerId(user.id)?.id ?? 'SHOP001';
    return 'SHOP001';
  });

  protected readonly transactions = computed(() =>
    this.orderService.getPaymentTransactions()
      .filter(t => {
        const order = this.orderService.getOrderById(t.orderId.replace('PAY-', ''));
        return order?.shopId === this.shopId();
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  protected readonly totalAmount = computed(() =>
    this.transactions()
      .filter(t => t.status === 'paid')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  protected fmtCurrency(v: number): string {
    return v.toLocaleString('vi-VN') + 'đ';
  }

  protected methodLabel(m: string): string {
    return { cod: 'COD', bank_transfer: 'Chuyển khoản', e_wallet: 'Ví điện tử' }[m] ?? m;
  }

  protected payStatusClass(s: string): string {
    return {
      paid: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-slate-200 text-slate-700',
    }[s] ?? '';
  }
}
