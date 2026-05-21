import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
  gradient: string;
  expires: string;
}

@Component({
  selector: 'app-promotion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './promotion.html',
  styleUrl: './promotion.css',
})
export class PromotionComponent {
  protected readonly banners: PromoBanner[] = [
    { id: '1', title: 'WELCOME10', subtitle: 'Giảm 10% cho đơn từ 200K', code: 'WELCOME10', gradient: 'from-indigo-500 to-purple-600', expires: '31/12/2025' },
    { id: '2', title: 'SALE50K', subtitle: 'Giảm 50.000₫ đơn từ 500K', code: 'SALE50K', gradient: 'from-rose-500 to-orange-500', expires: '30/06/2025' },
    { id: '3', title: 'MEGA20', subtitle: 'Giảm 20% đơn từ 1 triệu', code: 'MEGA20', gradient: 'from-emerald-500 to-teal-600', expires: '31/12/2025' },
  ];

  protected copyCode(code: string): void {
    navigator.clipboard?.writeText(code);
  }
}
