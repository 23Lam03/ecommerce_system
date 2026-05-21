import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-dvh flex bg-slate-100">
      <aside class="w-64 bg-slate-900 text-white shrink-0 hidden lg:flex flex-col">
        <div class="p-5 border-b border-slate-700">
          <span class="font-bold text-lg">Admin Panel</span>
        </div>
        <nav class="flex-1 p-3 space-y-1 text-sm overflow-y-auto">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-indigo-600 text-white"
              class="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
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
export class AdminLayout {
  protected readonly navItems = [
    { path: 'stores', label: 'Cửa hàng' },
    { path: 'products', label: 'Sản phẩm' },
    { path: 'orders', label: 'Đơn hàng' },
    { path: 'customers', label: 'Khách hàng' },
    { path: 'payments', label: 'Thanh toán' },
    { path: 'reports', label: 'Báo cáo' },
    { path: 'notifications', label: 'Thông báo' },
    { path: 'support', label: 'Hỗ trợ' },
    { path: 'reviews', label: 'Đánh giá' },
    { path: 'promotions', label: 'Khuyến mãi' },
    { path: 'access-control', label: 'Phân quyền' },
    { path: 'financial', label: 'Tài chính' },
  ];
}
