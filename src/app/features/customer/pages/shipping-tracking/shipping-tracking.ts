import { Component, inject, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { OrderStatus } from '../../../../core/models/order.model';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'Đặt hàng' },
  { status: 'confirmed', label: 'Xác nhận' },
  { status: 'processing', label: 'Chuẩn bị' },
  { status: 'shipping', label: 'Đang giao' },
  { status: 'delivered', label: 'Đã giao' },
];

@Component({
  selector: 'app-shipping-tracking',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './shipping-tracking.html',
  styleUrl: './shipping-tracking.css',
})
export class ShippingTrackingComponent {
  readonly orderId = input.required<string>();
  private readonly orderService = inject(OrderService);

  protected readonly order = computed(() => this.orderService.getOrderById(this.orderId()));

  protected readonly stepIndex = computed(() => {
    const o = this.order();
    if (!o || o.status === 'cancelled' || o.status === 'returned') return -1;
    return STEPS.findIndex(s => s.status === o.status);
  });

  protected readonly steps = STEPS;
}
