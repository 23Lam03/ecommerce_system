import { Component, inject, computed, signal } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Order, OrderStatus } from '../../../../core/models/order.model';

@Component({
  selector: 'app-shop-shipping-management',
  standalone: true,
  imports: [],
  templateUrl: './shipping-management.html',
  styleUrl: './shipping-management.css',
})
export class ShippingManagementComponent {
  private readonly orderService = inject(OrderService);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly searchQuery = signal('');
  protected readonly updatingId = signal<string | null>(null);
  protected readonly editingTracking = signal<{ orderId: string; trackingNumber: string; carrier: string } | null>(null);

  protected readonly shopId = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') return this.auth.getShopByOwnerId(user.id)?.id ?? 'SHOP001';
    return 'SHOP001';
  });

  protected readonly shippingOrders = computed(() => {
    let list = this.orderService.getOrdersByShop(this.shopId())
      .filter(o => ['pending', 'confirmed', 'processing', 'shipping'].includes(o.status));
    const q = this.searchQuery().toLowerCase().trim();
    if (q) list = list.filter(o => o.orderCode.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  protected readonly carriers = [
    'Giao Hàng Nhanh', 'Giao Hàng Tiết Kiệm', 'J&T Express',
    'Viettel Post', 'Bưu điện', 'GrabExpress', 'Ahamove',
  ];

  protected statusLabel(s: OrderStatus): string {
    return { pending: 'Chờ', confirmed: 'Đã xác nhận', processing: 'Đang chuẩn bị', shipping: 'Đang giao', delivered: 'Hoàn thành', cancelled: 'Hủy', returned: 'Trả' }[s];
  }

  protected statusClass(s: OrderStatus): string {
    return { pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800', processing: 'bg-indigo-100 text-indigo-800', shipping: 'bg-sky-100 text-sky-800', delivered: 'bg-emerald-100 text-emerald-800', cancelled: 'bg-red-100 text-red-800', returned: 'bg-slate-200 text-slate-700' }[s];
  }

  protected startEditTracking(order: Order): void {
    this.editingTracking.set({
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      carrier: order.shippingCarrier,
    });
  }

  protected cancelEditTracking(): void {
    this.editingTracking.set(null);
  }

  protected saveTracking(): void {
    const edit = this.editingTracking();
    if (!edit) return;
    this.updatingId.set(edit.orderId);
    setTimeout(() => {
      this.orderService.updateTrackingInfo(edit.orderId, edit.trackingNumber, edit.carrier);
      this.updatingId.set(null);
      this.editingTracking.set(null);
      this.notification.success('Đã cập nhật thông tin vận đơn');
    }, 300);
  }

  protected updateCarrier(orderId: string, value: string): void {
    const edit = this.editingTracking();
    if (edit && edit.orderId === orderId) {
      this.editingTracking.set({ ...edit, carrier: value });
    }
  }

  protected updateTrackingNumber(orderId: string, value: string): void {
    const edit = this.editingTracking();
    if (edit && edit.orderId === orderId) {
      this.editingTracking.set({ ...edit, trackingNumber: value });
    }
  }
}
