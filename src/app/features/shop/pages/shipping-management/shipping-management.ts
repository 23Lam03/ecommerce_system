import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-shop-shipping-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Quản lý vận chuyển" code="SH-SHP01" />',
})
export class ShippingManagementComponent {}
