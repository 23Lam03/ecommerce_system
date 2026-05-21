import { Component, inject, computed } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [CurrencyVndPipe, DatePipe],
  templateUrl: './payment-management.html',
  styleUrl: './payment-management.css',
})
export class PaymentManagementComponent {
  private readonly orderService = inject(OrderService);
  private readonly auth = inject(AuthService);

  protected readonly transactions = computed(() => {
    const user = this.auth.currentUser();
    const customerId = user?.role === 'customer' ? user.id : 'USR001';
    return this.orderService.getPaymentTransactions().filter(t => {
      const order = this.orderService.getOrderById(t.orderId.replace('PAY-', ''));
      return order?.customerId === customerId;
    });
  });

  protected methodLabel(m: string): string {
    return { cod: 'COD', bank_transfer: 'Chuyển khoản', e_wallet: 'Ví điện tử' }[m] ?? m;
  }

  protected payStatusClass(s: string): string {
    return { paid: 'bg-emerald-100 text-emerald-800', pending: 'bg-amber-100 text-amber-800', failed: 'bg-red-100 text-red-800', refunded: 'bg-slate-200 text-slate-700' }[s] ?? '';
  }
}
