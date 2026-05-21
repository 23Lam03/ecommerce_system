import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-shop-promotion-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Khuyến mãi cửa hàng" code="SH-PRM01" />',
})
export class PromotionManagementComponent {}
