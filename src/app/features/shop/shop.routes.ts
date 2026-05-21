import { Routes } from '@angular/router';
import { ShopLayout } from './layout/shop-layout/shop-layout';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: ShopLayout,
    children: [
      { path: '', redirectTo: 'reports', pathMatch: 'full' },
      { path: 'products/new', loadComponent: () => import('./pages/product-posting/product-posting').then(m => m.ProductPostingComponent) },
      { path: 'products', loadComponent: () => import('./pages/product-management/product-management').then(m => m.ProductManagementComponent) },
      { path: 'orders', loadComponent: () => import('./pages/order-management/order-management').then(m => m.OrderManagementComponent) },
      { path: 'payments', loadComponent: () => import('./pages/payment-management/payment-management').then(m => m.PaymentManagementComponent) },
      { path: 'reviews', loadComponent: () => import('./pages/product-review-management/product-review-management').then(m => m.ProductReviewManagementComponent) },
      { path: 'reports', loadComponent: () => import('./pages/report/report').then(m => m.ReportComponent) },
      { path: 'support', loadComponent: () => import('./pages/customer-support/customer-support').then(m => m.CustomerSupportComponent) },
      { path: 'promotions', loadComponent: () => import('./pages/promotion-management/promotion-management').then(m => m.PromotionManagementComponent) },
      { path: 'inventory', loadComponent: () => import('./pages/inventory-management/inventory-management').then(m => m.InventoryManagementComponent) },
      { path: 'shipping', loadComponent: () => import('./pages/shipping-management/shipping-management').then(m => m.ShippingManagementComponent) },
      { path: 'financial', loadComponent: () => import('./pages/financial-management/financial-management').then(m => m.FinancialManagementComponent) },
    ],
  },
];
