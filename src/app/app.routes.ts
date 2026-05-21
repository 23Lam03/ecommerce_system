import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./features/shop/shop.routes').then(m => m.SHOP_ROUTES),
  },
  { path: '**', redirectTo: 'cart' },
];
