import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', redirectTo: 'reports', pathMatch: 'full' },
      { path: 'stores', loadComponent: () => import('./pages/store-management/store-management').then(m => m.StoreManagementComponent) },
      { path: 'products', loadComponent: () => import('./pages/product-management/product-management').then(m => m.ProductManagementComponent) },
      { path: 'orders', loadComponent: () => import('./pages/order-management/order-management').then(m => m.OrderManagementComponent) },
      { path: 'customers', loadComponent: () => import('./pages/customer-management/customer-management').then(m => m.CustomerManagementComponent) },
      { path: 'payments', loadComponent: () => import('./pages/payment-management/payment-management').then(m => m.PaymentManagementComponent) },
      { path: 'reports', loadComponent: () => import('./pages/overview-report/overview-report').then(m => m.OverviewReportComponent) },
      { path: 'notifications', loadComponent: () => import('./pages/notification-management/notification-management').then(m => m.NotificationManagementComponent) },
      { path: 'support', loadComponent: () => import('./pages/support-management/support-management').then(m => m.SupportManagementComponent) },
      { path: 'reviews', loadComponent: () => import('./pages/product-review-management/product-review-management').then(m => m.ProductReviewManagementComponent) },
      { path: 'promotions', loadComponent: () => import('./pages/promotion-management/promotion-management').then(m => m.PromotionManagementComponent) },
      { path: 'access-control', loadComponent: () => import('./pages/access-control-management/access-control-management').then(m => m.AccessControlManagementComponent) },
      { path: 'financial', loadComponent: () => import('./pages/financial-management/financial-management').then(m => m.FinancialManagementComponent) },
    ],
  },
];
