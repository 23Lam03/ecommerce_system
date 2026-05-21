import { Routes } from '@angular/router';
import { CustomerLayout } from './layout/customer-layout/customer-layout';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    component: CustomerLayout,
    children: [
      { path: '', redirectTo: 'cart', pathMatch: 'full' },
      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/shopping-cart/shopping-cart').then(m => m.ShoppingCartComponent),
        title: 'Giỏ hàng | EcoMart',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/registration/registration').then(m => m.RegistrationComponent),
        title: 'Đăng ký | EcoMart',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login').then(m => m.LoginComponent),
        title: 'Đăng nhập | EcoMart',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/product-search/product-search').then(m => m.ProductSearchComponent),
        title: 'Sản phẩm | EcoMart',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/order-history/order-history').then(m => m.OrderHistoryComponent),
        title: 'Đơn hàng | EcoMart',
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./pages/product-review/product-review').then(m => m.ProductReviewComponent),
        title: 'Đánh giá | EcoMart',
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./pages/account-management/account-management').then(m => m.AccountManagementComponent),
        title: 'Tài khoản | EcoMart',
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./pages/support/support').then(m => m.SupportComponent),
        title: 'Hỗ trợ | EcoMart',
      },
      {
        path: 'promotions',
        loadComponent: () =>
          import('./pages/promotion/promotion').then(m => m.PromotionComponent),
        title: 'Ưu đãi | EcoMart',
      },
      {
        path: 'shipping/:orderId',
        loadComponent: () =>
          import('./pages/shipping-tracking/shipping-tracking').then(m => m.ShippingTrackingComponent),
        title: 'Theo dõi vận chuyển | EcoMart',
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./pages/payment-management/payment-management').then(m => m.PaymentManagementComponent),
        title: 'Thanh toán | EcoMart',
      },
    ],
  },
];
