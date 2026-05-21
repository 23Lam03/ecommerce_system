import { Component, inject, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { Order, OrderStatus } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [RouterLink, CurrencyVndPipe, DatePipe],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistoryComponent {
  private readonly orderService = inject(OrderService);
  private readonly auth = inject(AuthService);

  protected readonly statusFilter = signal<OrderStatus | 'all'>('all');

  protected readonly orders = computed(() => {
    const user = this.auth.currentUser();
    const customerId = user?.role === 'customer' ? user.id : 'USR001';
    let list = this.orderService.getOrdersByCustomer(customerId);
    const status = this.statusFilter();
    if (status !== 'all') list = list.filter(o => o.status === status);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  protected statusLabel(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending: 'Chờ xử lý', confirmed: 'Đã xác nhận', processing: 'Đang chuẩn bị',
      shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy', returned: 'Trả hàng',
    };
    return map[status];
  }

  protected statusClass(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800', shipping: 'bg-sky-100 text-sky-800',
      delivered: 'bg-emerald-100 text-emerald-800', cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-slate-200 text-slate-700',
    };
    return map[status];
  }
}
