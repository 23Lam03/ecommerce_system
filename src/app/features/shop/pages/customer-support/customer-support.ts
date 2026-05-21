import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-shop-customer-support',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Hỗ trợ khách hàng" code="SH-SPT01" />',
})
export class CustomerSupportComponent {}
