import { Component, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CurrencyVndPipe } from '../../../../shared/pipes/currency-vnd.pipe';
import { ProductFilter } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyVndPipe, DecimalPipe],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css',
})
export class ProductSearchComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly notification = inject(NotificationService);

  protected readonly categories = this.productService.categories;
  protected readonly addingId = signal<string | null>(null);

  protected readonly filterForm = this.fb.nonNullable.group({
    keyword: [''],
    categoryId: [''],
    minPrice: [null as number | null],
    maxPrice: [null as number | null],
    minRating: [''],
    sortBy: ['newest' as ProductFilter['sortBy']],
  });

  protected readonly products = computed(() => {
    const f = this.filterForm.getRawValue();
    return this.productService.getProducts({
      keyword: f.keyword,
      categoryId: f.categoryId,
      minPrice: f.minPrice,
      maxPrice: f.maxPrice,
      minRating: f.minRating ? Number(f.minRating) : null,
      sortBy: f.sortBy,
    });
  });

  protected applyFilters(): void {
    this.filterForm.updateValueAndValidity();
  }

  protected resetFilters(): void {
    this.filterForm.reset({ keyword: '', categoryId: '', minPrice: null, maxPrice: null, minRating: '', sortBy: 'newest' });
  }

  protected addToCart(productId: string): void {
    const product = this.productService.getProductById(productId);
    if (!product) return;
    this.addingId.set(productId);
    setTimeout(() => {
      this.cartService.addToCart({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        shopId: product.shopId,
        shopName: product.shopName,
        price: product.price,
        originalPrice: product.originalPrice,
        quantity: 1,
        stock: product.stock,
      });
      this.addingId.set(null);
      this.notification.success(`Đã thêm "${product.name}" vào giỏ`);
    }, 300);
  }

  protected renderStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }
}
