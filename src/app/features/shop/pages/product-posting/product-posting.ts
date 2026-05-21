import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-shop-product-posting',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-posting.html',
  styleUrl: './product-posting.css',
})
export class ProductPostingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  protected readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly categories = this.productService.categories;
  protected readonly isSubmitting = signal(false);
  protected readonly isDragging = signal(false);
  protected readonly previewImages = signal<string[]>([]);
  protected readonly Math = Math;

  protected readonly shopContext = computed(() => {
    const user = this.auth.currentUser();
    if (user?.role === 'shop') {
      const shop = this.auth.getShopByOwnerId(user.id);
      if (shop) return { shopId: shop.id, shopName: shop.shopName };
    }
    return { shopId: 'SHOP001', shopName: 'TechZone Store' };
  });

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
    price: [null as number | null, [Validators.required, Validators.min(1000)]],
    originalPrice: [null as number | null, [Validators.min(1000)]],
    categoryId: ['', Validators.required],
    stock: [1, [Validators.required, Validators.min(1), Validators.max(99999)]],
  });

  protected fieldError(field: keyof typeof this.form.controls): string | null {
    const control = this.form.controls[field];
    if (!control.touched && !control.dirty) return null;

    if (control.hasError('required')) {
      const labels: Record<string, string> = {
        name: 'Tên sản phẩm',
        description: 'Mô tả',
        price: 'Giá bán',
        categoryId: 'Danh mục',
        stock: 'Số lượng tồn kho',
      };
      return `${labels[field] ?? 'Trường này'} không được để trống`;
    }
    if (control.hasError('minlength')) {
      if (field === 'name') return 'Tên sản phẩm tối thiểu 3 ký tự';
      if (field === 'description') return 'Mô tả tối thiểu 20 ký tự';
    }
    if (control.hasError('maxlength')) return 'Nội dung quá dài';
    if (control.hasError('min')) {
      if (field === 'price' || field === 'originalPrice') return 'Giá phải lớn hơn 1.000₫';
      if (field === 'stock') return 'Tồn kho tối thiểu 1';
    }
    if (control.hasError('max')) return 'Tồn kho tối đa 99.999';
    return null;
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files) this.processFiles(files);
  }

  protected onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) this.processFiles(input.files);
  }

  private processFiles(files: FileList): void {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      this.notification.warning('Vui lòng chọn file ảnh (JPG, PNG, WEBP)');
      return;
    }
    const current = this.previewImages();
    const remaining = 5 - current.length;
    imageFiles.slice(0, remaining).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.previewImages.update(imgs => [...imgs, reader.result as string].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
    if (imageFiles.length > remaining) {
      this.notification.warning(`Chỉ được tải tối đa 5 ảnh (còn ${remaining} slot)`);
    }
  }

  protected removeImage(index: number): void {
    this.previewImages.update(imgs => imgs.filter((_, i) => i !== index));
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.previewImages().length === 0) {
      this.notification.error('Vui lòng tải ít nhất 1 hình ảnh sản phẩm');
      return;
    }
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const category = this.productService.getCategoryById(raw.categoryId);
    const shop = this.shopContext();
    const price = Number(raw.price);
    const originalPrice = raw.originalPrice ? Number(raw.originalPrice) : Math.round(price * 1.2);

    this.isSubmitting.set(true);
    setTimeout(() => {
      const product = this.productService.addProduct({
        name: raw.name.trim(),
        description: raw.description.trim(),
        price,
        originalPrice,
        categoryId: raw.categoryId,
        categoryName: category?.name ?? '',
        shopId: shop.shopId,
        shopName: shop.shopName,
        images: [...this.previewImages()],
        stock: Number(raw.stock),
        status: 'pending',
      });

      this.isSubmitting.set(false);
      this.notification.success(`Đã gửi đăng sản phẩm "${product.name}" — chờ phê duyệt`);
      this.router.navigate(['/shop/products']);
    }, 800);
  }

  protected resetForm(): void {
    this.form.reset({ name: '', description: '', price: null, originalPrice: null, categoryId: '', stock: 1 });
    this.previewImages.set([]);
  }

  protected remainingSlots(): number {
    return Math.max(0, 5 - this.previewImages().length);
  }

  protected placeholderArray(): number[] {
    return Array(this.remainingSlots()).fill(0);
  }
}
