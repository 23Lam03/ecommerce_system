import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-shop-report',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Báo cáo doanh số" code="SH-RPT01" />',
})
export class ReportComponent {}
