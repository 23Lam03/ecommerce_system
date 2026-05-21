import { Component } from '@angular/core';
import { PagePlaceholder } from '../../../../shared/components/page-placeholder/page-placeholder';

@Component({
  selector: 'app-admin-access-control-management',
  standalone: true,
  imports: [PagePlaceholder],
  template: '<app-page-placeholder title="Phân quyền truy cập" code="AD-ADM11" />',
})
export class AccessControlManagementComponent {}
