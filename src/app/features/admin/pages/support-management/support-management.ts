import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-admin-support-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Hỗ trợ kỹ thuật" code="AD-ADM08" />',
})
export class SupportManagementComponent {}
