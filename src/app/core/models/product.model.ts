export type ProductStatus = 'active' | 'inactive' | 'pending' | 'rejected';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  categoryId: string;
  categoryName: string;
  shopId: string;
  shopName: string;
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  status: ProductStatus;
  createdAt: Date;
}

export interface ProductFilter {
  keyword: string;
  categoryId: string;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'rating';
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  shopReply: string;
  isHidden: boolean;
  createdAt: Date;
}
