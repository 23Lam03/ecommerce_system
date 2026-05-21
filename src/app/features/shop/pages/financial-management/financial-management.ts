import { Component, inject, computed } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductService } from '../../../../core/services/product.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';

@Component({
  selector: 'app-shop-financial-management',
  standalone: true,
  imports: [CurrencyVndPipe],
  templateUrl: './financial-management.html',
  styleUrl: './financial-management.css',
})
export class FinancialManagementComponent {
  private readonly orderService = inject(OrderService);
  private readonly auth = inject(AuthService);
  private readonly productService = inject(ProductService);

  protected readonly shopId = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') return this.auth.getShopByOwnerId(user.id)?.id ?? 'SHOP001';
    return 'SHOP001';
  });

  protected readonly orders = computed(() => this.orderService.getOrdersByShop(this.shopId()));

  protected readonly totalRevenue = computed(() =>
    this.orders()
      .filter(o => o.status === 'delivered' && o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.finalAmount, 0)
  );

  protected readonly pendingRevenue = computed(() =>
    this.orders()
      .filter(o => o.paymentStatus === 'pending')
      .reduce((sum, o) => sum + o.finalAmount, 0)
  );

  protected readonly shippingCost = computed(() =>
    this.orders()
      .filter(o => ['pending', 'confirmed', 'processing', 'shipping'].includes(o.status))
      .reduce((sum, o) => sum + o.shippingFee, 0)
  );

  protected readonly platformFee = computed(() => Math.round(this.totalRevenue() * 0.02));

  protected readonly netProfit = computed(() =>
    this.totalRevenue() - this.platformFee() - this.shippingCost()
  );

  protected readonly monthlyStats = [
    { month: 'T6', revenue: 125000000, cost: 25000000 },
    { month: 'T7', revenue: 178000000, cost: 35000000 },
    { month: 'T8', revenue: 162000000, cost: 32000000 },
    { month: 'T9', revenue: 198000000, cost: 39000000 },
    { month: 'T10', revenue: 245000000, cost: 48000000 },
    { month: 'T11', revenue: 267000000, cost: 52000000 },
  ];
}
