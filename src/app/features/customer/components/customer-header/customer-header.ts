import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-customer-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './customer-header.html',
})
export class CustomerHeader {
  protected readonly cartService = inject(CartService);
  protected readonly cartCount = computed(() => this.cartService.totalItems());
}
