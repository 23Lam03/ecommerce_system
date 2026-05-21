import { Component, inject, computed, signal } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-payment-management',
  standalone: true,
  imports: [CurrencyVndPipe, DatePipe],
  templateUrl: './payment-management.html',
  styleUrl: './payment-management.css',
})
export class PaymentManagementComponent {
  private readonly orderService = inject(OrderService);

  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<'all' | 'paid' | 'pending' | 'failed'>('all');
  protected readonly methodFilter = signal<'all' | 'cod' | 'bank_transfer' | 'e_wallet'>('all');

  protected readonly transactions = computed(() => {
    let list = this.orderService.getPaymentTransactions();
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    const method = this.methodFilter();
    if (q) list = list.filter(t =>
      t.orderCode.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.shopName.toLowerCase().includes(q)
    );
    if (status !== 'all') list = list.filter(t => t.status === status);
    if (method !== 'all') list = list.filter(t => t.method === method);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  protected readonly totalAmount = computed(() =>
    this.transactions().filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0)
  );

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
