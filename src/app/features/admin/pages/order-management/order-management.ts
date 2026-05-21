import { Component, inject, signal, computed } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { Order, OrderStatus } from '../../../../core/models/order.model';
import { DatePipe } from '@angular/common';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipping', 'delivered'];

@Component({
  selector: 'app-admin-order-management',
  standalone: true,
  imports: [CurrencyVndPipe, DatePipe],
  templateUrl: './order-management.html',
  styleUrl: './order-management.css',
})
export class OrderManagementComponent {
  private readonly orderService = inject(OrderService);
  private readonly notification = inject(NotificationService);

  protected readonly statusFilter = signal<OrderStatus | 'all'>('all');
  protected readonly searchQuery = signal('');
  protected readonly updatingId = signal<string | null>(null);
  protected readonly selectedOrder = signal<Order | null>(null);
  protected readonly statusOptions: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'returned'];

  protected readonly orders = computed(() => {
    let list = this.orderService.getOrders();
    const status = this.statusFilter();
    const q = this.searchQuery().toLowerCase().trim();
    if (status !== 'all') list = list.filter(o => o.status === status);
    if (q) list = list.filter(o =>
      o.orderCode.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.shopName.toLowerCase().includes(q)
    );
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  protected statusLabel(s: OrderStatus): string {
    return {
      pending: 'Chờ xử lý', confirmed: 'Đã xác nhận', processing: 'Đang chuẩn bị',
      shipping: 'Đang giao hàng', delivered: 'Hoàn thành', cancelled: 'Đã hủy', returned: 'Trả hàng',
    }[s];
  }

  protected statusClass(s: OrderStatus): string {
    return {
      pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-indigo-100 text-indigo-800', shipping: 'bg-sky-100 text-sky-800',
      delivered: 'bg-emerald-100 text-emerald-800', cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-slate-200 text-slate-700',
    }[s];
  }

  protected nextStatus(current: OrderStatus): OrderStatus | null {
    const i = STATUS_FLOW.indexOf(current);
    return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null;
  }

  protected advanceStatus(order: Order): void {
    const next = this.nextStatus(order.status);
    if (!next) return;
    this.updatingId.set(order.id);
    setTimeout(() => {
      this.orderService.updateOrderStatus(order.id, next);
      this.updatingId.set(null);
      this.notification.success(`Đơn ${order.orderCode} → ${this.statusLabel(next)}`);
    }, 300);
  }

  protected viewOrder(order: Order): void {
    this.selectedOrder.set(order);
  }

  protected closeDetail(): void {
    this.selectedOrder.set(null);
  }

  protected paymentMethodLabel(m: string): string {
    return { cod: 'COD', bank_transfer: 'Chuyển khoản', e_wallet: 'Ví điện tử' }[m] ?? m;
  }
}
