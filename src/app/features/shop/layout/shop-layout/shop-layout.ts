import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shop-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-dvh flex bg-slate-50">
      <aside class="w-60 bg-emerald-900 text-white shrink-0 hidden lg:flex flex-col">
        <div class="p-5 border-b border-emerald-700">
          <span class="font-bold text-lg">Shop Dashboard</span>
        </div>
        <nav class="flex-1 p-3 space-y-1 text-sm overflow-y-auto">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-emerald-600 text-white"
              class="block px-3 py-2 rounded-lg text-emerald-100 hover:bg-emerald-800 transition-colors"
            >{{ item.label }}</a>
          }
        </nav>
      </aside>
      <main class="flex-1 overflow-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShopLayout {
  protected readonly navItems = [
    { path: 'products/new', label: 'Đăng SP' },
    { path: 'products', label: 'Sản phẩm' },
    { path: 'orders', label: 'Đơn hàng' },
    { path: 'payments', label: 'Thanh toán' },
    { path: 'reviews', label: 'Đánh giá' },
    { path: 'reports', label: 'Báo cáo' },
    { path: 'support', label: 'Hỗ trợ' },
    { path: 'promotions', label: 'Khuyến mãi' },
    { path: 'inventory', label: 'Kho hàng' },
    { path: 'shipping', label: 'Vận chuyển' },
    { path: 'financial', label: 'Tài chính' },
  ];
}
