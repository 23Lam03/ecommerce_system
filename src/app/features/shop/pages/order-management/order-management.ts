import { Component, inject, signal, computed } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { Order, OrderStatus } from '../../../../core/models/order.model';

const SHOP_FLOW: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipping', 'delivered'];

@Component({
  selector: 'app-shop-order-management',
  standalone: true,
  imports: [CurrencyVndPipe],
  templateUrl: './order-management.html',
  styleUrl: './order-management.css',
})
export class OrderManagementComponent {
  private readonly orderService = inject(OrderService);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly statusFilter = signal<OrderStatus | 'all'>('all');
  protected readonly updatingId = signal<string | null>(null);

  protected readonly shopId = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') return this.auth.getShopByOwnerId(user.id)?.id ?? 'SHOP001';
    return 'SHOP001';
  });

  protected readonly orders = computed(() => {
    let list = this.orderService.getOrdersByShop(this.shopId());
    const s = this.statusFilter();
    if (s !== 'all') list = list.filter(o => o.status === s);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  protected statusLabel(s: OrderStatus): string {
    return { pending: 'Mới', confirmed: 'Xác nhận', processing: 'Đóng gói', shipping: 'Đang giao', delivered: 'Hoàn tất', cancelled: 'Hủy', returned: 'Trả' }[s];
  }

  protected nextStatus(current: OrderStatus): OrderStatus | null {
    const i = SHOP_FLOW.indexOf(current);
    return i >= 0 && i < SHOP_FLOW.length - 1 ? SHOP_FLOW[i + 1] : null;
  }

  protected advance(order: Order): void {
    const next = this.nextStatus(order.status);
    if (!next) return;
    this.updatingId.set(order.id);
    setTimeout(() => {
      this.orderService.updateOrderStatus(order.id, next);
      this.updatingId.set(null);
      this.notification.success(`Cập nhật ${order.orderCode}`);
    }, 300);
  }
}
