import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ShopInfo } from '../../../../core/models/user.model';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { DatePipe } from '@angular/common';

type ModalMode = 'add' | 'edit' | 'view' | null;

@Component({
  selector: 'app-admin-store-management',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyVndPipe, ConfirmDialog, DatePipe],
  templateUrl: './store-management.html',
  styleUrl: './store-management.css',
})
export class StoreManagementComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);

  protected readonly shops = this.auth.allShops;
  protected readonly searchQuery = signal('');
  protected readonly statusFilter = signal<ShopInfo['status'] | 'all'>('all');
  protected readonly modalMode = signal<ModalMode>(null);
  protected readonly selectedShop = signal<ShopInfo | null>(null);
  protected readonly isSaving = signal(false);
  protected readonly showDeleteConfirm = signal(false);
  protected readonly shopToDelete = signal<ShopInfo | null>(null);

  protected readonly deleteConfirmMessage = computed(
    () =>
      `Bạn có chắc muốn xóa cửa hàng "${this.shopToDelete()?.shopName ?? ''}"? Hành động không thể hoàn tác.`
  );

  protected readonly filteredShops = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.statusFilter();
    return this.shops().filter(shop => {
      const matchStatus = status === 'all' || shop.status === status;
      const owner = this.auth.getUserById(shop.ownerId);
      const matchSearch =
        !q ||
        shop.shopName.toLowerCase().includes(q) ||
        shop.id.toLowerCase().includes(q) ||
        shop.address.toLowerCase().includes(q) ||
        (owner?.fullName.toLowerCase().includes(q) ?? false) ||
        (owner?.email.toLowerCase().includes(q) ?? false);
      return matchStatus && matchSearch;
    });
  });

  protected readonly shopForm = this.fb.nonNullable.group({
    shopName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    phone: ['', [Validators.required, Validators.pattern(/^(0|\+84)[0-9]{9,10}$/)]],
    ownerId: ['', Validators.required],
    status: ['pending' as ShopInfo['status'], Validators.required],
  });

  protected readonly ownerOptions = computed(() =>
    this.auth.allUsers().filter(u => u.role === 'shop')
  );

  protected fieldError(field: keyof typeof this.shopForm.controls): string | null {
    const control = this.shopForm.controls[field];
    if (!control.touched && !control.dirty) return null;
    if (control.hasError('required')) return 'Trường này không được để trống';
    if (control.hasError('minlength')) return 'Nội dung quá ngắn';
    if (control.hasError('maxlength')) return 'Nội dung quá dài';
    if (control.hasError('pattern')) return 'Số điện thoại không hợp lệ';
    return null;
  }

  protected getOwnerName(ownerId: string): string {
    return this.auth.getUserById(ownerId)?.fullName ?? '—';
  }

  protected getOwnerEmail(ownerId: string): string {
    return this.auth.getUserById(ownerId)?.email ?? '—';
  }

  protected statusLabel(status: ShopInfo['status']): string {
    const map: Record<ShopInfo['status'], string> = {
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      suspended: 'Tạm ngưng',
    };
    return map[status];
  }

  protected statusClass(status: ShopInfo['status']): string {
    const map: Record<ShopInfo['status'], string> = {
      pending: 'bg-amber-100 text-amber-800',
      approved: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-slate-200 text-slate-700',
    };
    return map[status];
  }

  protected openAdd(): void {
    this.selectedShop.set(null);
    this.shopForm.reset({
      shopName: '',
      description: '',
      address: '',
      phone: '',
      ownerId: '',
      status: 'pending',
    });
    this.modalMode.set('add');
  }

  protected openEdit(shop: ShopInfo): void {
    this.selectedShop.set(shop);
    this.shopForm.patchValue({
      shopName: shop.shopName,
      description: shop.description,
      address: shop.address,
      phone: shop.phone,
      ownerId: shop.ownerId,
      status: shop.status,
    });
    this.modalMode.set('edit');
  }

  protected openView(shop: ShopInfo): void {
    this.selectedShop.set(shop);
    this.modalMode.set('view');
  }

  protected closeModal(): void {
    this.modalMode.set(null);
    this.selectedShop.set(null);
  }

  protected saveShop(): void {
    this.shopForm.markAllAsTouched();
    if (this.shopForm.invalid) return;

    this.isSaving.set(true);
    const raw = this.shopForm.getRawValue();
    const logo = `https://ui-avatars.com/api/?name=${encodeURIComponent(raw.shopName)}&background=6366f1&color=fff&size=128`;

    setTimeout(() => {
      const mode = this.modalMode();
      if (mode === 'add') {
        this.auth.addShop({
          ownerId: raw.ownerId,
          shopName: raw.shopName.trim(),
          description: raw.description.trim(),
          logo,
          address: raw.address.trim(),
          phone: raw.phone.trim(),
          status: raw.status,
        });
        this.notification.success('Thêm cửa hàng thành công');
      } else if (mode === 'edit' && this.selectedShop()) {
        this.auth.updateShop(this.selectedShop()!.id, {
          shopName: raw.shopName.trim(),
          description: raw.description.trim(),
          address: raw.address.trim(),
          phone: raw.phone.trim(),
          ownerId: raw.ownerId,
          status: raw.status,
        });
        this.notification.success('Cập nhật cửa hàng thành công');
      }
      this.isSaving.set(false);
      this.closeModal();
    }, 500);
  }

  protected confirmDelete(shop: ShopInfo): void {
    this.shopToDelete.set(shop);
    this.showDeleteConfirm.set(true);
  }

  protected onDeleteConfirmed(): void {
    const shop = this.shopToDelete();
    if (shop) {
      this.auth.deleteShop(shop.id);
      this.notification.success(`Đã xóa cửa hàng "${shop.shopName}"`);
    }
    this.showDeleteConfirm.set(false);
    this.shopToDelete.set(null);
  }

  protected onDeleteCancelled(): void {
    this.showDeleteConfirm.set(false);
    this.shopToDelete.set(null);
  }

  protected quickApprove(shop: ShopInfo): void {
    this.auth.updateShopStatus(shop.id, 'approved');
    this.notification.success(`Đã phê duyệt "${shop.shopName}"`);
  }
}
