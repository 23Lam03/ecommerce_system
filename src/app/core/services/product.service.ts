import { Injectable, signal, computed, inject } from '@angular/core';
import { Product, ProductFilter, ProductReview, ProductStatus } from '../models/product.model';
import { Category } from '../models/category.model';

const MOCK_CATEGORIES: Category[] = [
  { id: 'CAT01', name: 'Điện thoại & Phụ kiện', icon: '📱', description: 'Smartphone, ốp lưng, sạc cáp', productCount: 45, parentId: null, isActive: true },
  { id: 'CAT02', name: 'Laptop & Máy tính', icon: '💻', description: 'Laptop, PC, linh kiện', productCount: 32, parentId: null, isActive: true },
  { id: 'CAT03', name: 'Thời trang Nam', icon: '👔', description: 'Áo, quần, giày dép nam', productCount: 67, parentId: null, isActive: true },
  { id: 'CAT04', name: 'Thời trang Nữ', icon: '👗', description: 'Áo, váy, giày dép nữ', productCount: 89, parentId: null, isActive: true },
  { id: 'CAT05', name: 'Đồ gia dụng', icon: '🏠', description: 'Nội thất, nhà bếp, trang trí', productCount: 56, parentId: null, isActive: true },
  { id: 'CAT06', name: 'Sức khỏe & Làm đẹp', icon: '💄', description: 'Mỹ phẩm, dưỡng da, thực phẩm chức năng', productCount: 34, parentId: null, isActive: true },
  { id: 'CAT07', name: 'Đồ chơi & Trẻ em', icon: '🧸', description: 'Đồ chơi, quần áo trẻ em', productCount: 23, parentId: null, isActive: true },
  { id: 'CAT08', name: 'Thể thao & Dã ngoại', icon: '⚽', description: 'Dụng cụ thể thao, cắm trại', productCount: 19, parentId: null, isActive: true },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'PRD001', name: 'iPhone 15 Pro Max 256GB', description: 'Điện thoại Apple iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch. Thiết kế titan cao cấp, bền bỉ.',
    price: 28990000, originalPrice: 34990000, categoryId: 'CAT01', categoryName: 'Điện thoại & Phụ kiện',
    shopId: 'SHOP001', shopName: 'TechZone Store', images: ['https://picsum.photos/seed/iphone15/600/600', 'https://picsum.photos/seed/iphone15b/600/600', 'https://picsum.photos/seed/iphone15c/600/600'],
    rating: 4.9, reviewCount: 234, soldCount: 1567, stock: 45, status: 'active', createdAt: new Date('2024-09-15')
  },
  {
    id: 'PRD002', name: 'Samsung Galaxy S24 Ultra', description: 'Samsung Galaxy S24 Ultra với bút S-Pen tích hợp, camera 200MP, AI Galaxy. Hiệu năng vượt trội với chip Snapdragon 8 Gen 3.',
    price: 25990000, originalPrice: 31990000, categoryId: 'CAT01', categoryName: 'Điện thoại & Phụ kiện',
    shopId: 'SHOP001', shopName: 'TechZone Store', images: ['https://picsum.photos/seed/s24ultra/600/600', 'https://picsum.photos/seed/s24ultrab/600/600'],
    rating: 4.7, reviewCount: 189, soldCount: 1234, stock: 30, status: 'active', createdAt: new Date('2024-10-01')
  },
  {
    id: 'PRD003', name: 'MacBook Pro 14" M3 Pro', description: 'MacBook Pro 14 inch chip M3 Pro, RAM 18GB, SSD 512GB. Màn hình Liquid Retina XDR, thời lượng pin lên đến 17 giờ.',
    price: 42990000, originalPrice: 49990000, categoryId: 'CAT02', categoryName: 'Laptop & Máy tính',
    shopId: 'SHOP001', shopName: 'TechZone Store', images: ['https://picsum.photos/seed/macbook14/600/600', 'https://picsum.photos/seed/macbook14b/600/600'],
    rating: 4.8, reviewCount: 156, soldCount: 789, stock: 20, status: 'active', createdAt: new Date('2024-08-20')
  },
  {
    id: 'PRD004', name: 'Áo Polo Nam Premium Cotton', description: 'Áo polo nam chất liệu cotton 100% cao cấp, form slim fit, nhiều màu sắc. Phù hợp đi làm và đi chơi.',
    price: 299000, originalPrice: 450000, categoryId: 'CAT03', categoryName: 'Thời trang Nam',
    shopId: 'SHOP002', shopName: 'Fashion Nova VN', images: ['https://picsum.photos/seed/polo/600/600', 'https://picsum.photos/seed/polob/600/600'],
    rating: 4.5, reviewCount: 78, soldCount: 2345, stock: 150, status: 'active', createdAt: new Date('2024-07-10')
  },
  {
    id: 'PRD005', name: 'Váy Đầm Nữ Hoa Nhí Vintage', description: 'Váy đầm nữ họa tiết hoa nhí phong cách vintage, chất liệu vải lụa mềm mại, thoáng mát.',
    price: 389000, originalPrice: 550000, categoryId: 'CAT04', categoryName: 'Thời trang Nữ',
    shopId: 'SHOP002', shopName: 'Fashion Nova VN', images: ['https://picsum.photos/seed/dress/600/600', 'https://picsum.photos/seed/dressb/600/600'],
    rating: 4.6, reviewCount: 92, soldCount: 1890, stock: 80, status: 'active', createdAt: new Date('2024-06-15')
  },
  {
    id: 'PRD006', name: 'Nồi chiên không dầu 6L', description: 'Nồi chiên không dầu dung tích 6 lít, công suất 1800W, 8 chế độ nấu tự động. Thiết kế hiện đại, dễ vệ sinh.',
    price: 1290000, originalPrice: 1890000, categoryId: 'CAT05', categoryName: 'Đồ gia dụng',
    shopId: 'SHOP003', shopName: 'HomeLife Decor', images: ['https://picsum.photos/seed/airfryer/600/600'],
    rating: 4.4, reviewCount: 345, soldCount: 3456, stock: 60, status: 'active', createdAt: new Date('2024-05-20')
  },
  {
    id: 'PRD007', name: 'Tai nghe AirPods Pro 2', description: 'Tai nghe Apple AirPods Pro 2 với chip H2, chống ồn chủ động, âm thanh không gian. Hộp sạc MagSafe.',
    price: 5490000, originalPrice: 6990000, categoryId: 'CAT01', categoryName: 'Điện thoại & Phụ kiện',
    shopId: 'SHOP001', shopName: 'TechZone Store', images: ['https://picsum.photos/seed/airpods/600/600'],
    rating: 4.8, reviewCount: 567, soldCount: 4567, stock: 100, status: 'active', createdAt: new Date('2024-04-10')
  },
  {
    id: 'PRD008', name: 'Bộ dưỡng da Hàn Quốc 5 món', description: 'Bộ dưỡng da gồm sữa rửa mặt, toner, serum, kem dưỡng và kem chống nắng. Thành phần tự nhiên, phù hợp mọi loại da.',
    price: 850000, originalPrice: 1200000, categoryId: 'CAT06', categoryName: 'Sức khỏe & Làm đẹp',
    shopId: 'SHOP002', shopName: 'Fashion Nova VN', images: ['https://picsum.photos/seed/skincare/600/600'],
    rating: 4.3, reviewCount: 123, soldCount: 890, stock: 40, status: 'active', createdAt: new Date('2024-03-25')
  },
  {
    id: 'PRD009', name: 'Robot lắp ráp LEGO Technic', description: 'Bộ LEGO Technic Robot điều khiển từ xa, 851 mảnh ghép. Phù hợp trẻ em từ 9 tuổi, phát triển tư duy logic.',
    price: 1590000, originalPrice: 2100000, categoryId: 'CAT07', categoryName: 'Đồ chơi & Trẻ em',
    shopId: 'SHOP003', shopName: 'HomeLife Decor', images: ['https://picsum.photos/seed/lego/600/600'],
    rating: 4.7, reviewCount: 67, soldCount: 456, stock: 25, status: 'active', createdAt: new Date('2024-02-14')
  },
  {
    id: 'PRD010', name: 'Giày chạy bộ Nike Air Max', description: 'Giày chạy bộ Nike Air Max với đệm khí, đế cao su chống trượt. Thiết kế thể thao năng động, nhẹ và thoáng khí.',
    price: 2890000, originalPrice: 3590000, categoryId: 'CAT08', categoryName: 'Thể thao & Dã ngoại',
    shopId: 'SHOP002', shopName: 'Fashion Nova VN', images: ['https://picsum.photos/seed/nike/600/600'],
    rating: 4.6, reviewCount: 234, soldCount: 1678, stock: 55, status: 'active', createdAt: new Date('2024-01-30')
  },
  {
    id: 'PRD011', name: 'Bàn phím cơ Gaming RGB', description: 'Bàn phím cơ gaming switch Cherry MX, đèn LED RGB 16.8 triệu màu. Kết nối có dây USB-C, anti-ghosting toàn phím.',
    price: 1690000, originalPrice: 2290000, categoryId: 'CAT02', categoryName: 'Laptop & Máy tính',
    shopId: 'SHOP001', shopName: 'TechZone Store', images: ['https://picsum.photos/seed/keyboard/600/600'],
    rating: 4.5, reviewCount: 189, soldCount: 2345, stock: 75, status: 'active', createdAt: new Date('2024-11-05')
  },
  {
    id: 'PRD012', name: 'Quần Jean Nam Slim Fit', description: 'Quần jean nam form slim fit, chất liệu denim co giãn thoải mái. Nhiều màu: xanh đậm, xanh nhạt, đen.',
    price: 459000, originalPrice: 650000, categoryId: 'CAT03', categoryName: 'Thời trang Nam',
    shopId: 'SHOP002', shopName: 'Fashion Nova VN', images: ['https://picsum.photos/seed/jeans/600/600'],
    rating: 4.4, reviewCount: 156, soldCount: 3890, stock: 200, status: 'active', createdAt: new Date('2024-08-12')
  },
  {
    id: 'PRD013', name: 'Máy hút bụi cầm tay không dây', description: 'Máy hút bụi cầm tay không dây công suất 150W, pin sạc 2200mAh, lực hút mạnh. Đầu hút đa năng.',
    price: 890000, originalPrice: 1350000, categoryId: 'CAT05', categoryName: 'Đồ gia dụng',
    shopId: 'SHOP003', shopName: 'HomeLife Decor', images: ['https://picsum.photos/seed/vacuum/600/600'],
    rating: 4.2, reviewCount: 89, soldCount: 1234, stock: 35, status: 'active', createdAt: new Date('2024-07-22')
  },
  {
    id: 'PRD014', name: 'Túi xách nữ da PU cao cấp', description: 'Túi xách nữ chất liệu da PU cao cấp, thiết kế sang trọng, ngăn chứa rộng rãi. Phù hợp đi làm và đi chơi.',
    price: 520000, originalPrice: 780000, categoryId: 'CAT04', categoryName: 'Thời trang Nữ',
    shopId: 'SHOP002', shopName: 'Fashion Nova VN', images: ['https://picsum.photos/seed/handbag/600/600'],
    rating: 4.5, reviewCount: 112, soldCount: 2567, stock: 90, status: 'active', createdAt: new Date('2024-09-18')
  },
  {
    id: 'PRD015', name: 'Đồng hồ thông minh Galaxy Watch 6', description: 'Samsung Galaxy Watch 6 40mm, theo dõi sức khỏe 24/7, GPS tích hợp, chống nước IP68. Pin 40 giờ sử dụng.',
    price: 5990000, originalPrice: 7490000, categoryId: 'CAT01', categoryName: 'Điện thoại & Phụ kiện',
    shopId: 'SHOP001', shopName: 'TechZone Store', images: ['https://picsum.photos/seed/watch/600/600'],
    rating: 4.6, reviewCount: 78, soldCount: 890, stock: 30, status: 'active', createdAt: new Date('2024-10-25')
  },
  {
    id: 'PRD016', name: 'Bộ nồi inox 5 đáy 4 món', description: 'Bộ nồi inox 5 đáy gồm 4 món (16-18-20-24cm), dùng được bếp từ. Inox 304 an toàn sức khỏe.',
    price: 1450000, originalPrice: 2100000, categoryId: 'CAT05', categoryName: 'Đồ gia dụng',
    shopId: 'SHOP003', shopName: 'HomeLife Decor', images: ['https://picsum.photos/seed/pots/600/600'],
    rating: 4.3, reviewCount: 45, soldCount: 678, stock: 20, status: 'active', createdAt: new Date('2024-06-30')
  },
  {
    id: 'PRD017', name: 'Son môi MAC Ruby Woo', description: 'Son MAC Retro Matte màu Ruby Woo - đỏ cổ điển quyến rũ. Chất son lì mịn, bám màu lên đến 8 giờ.',
    price: 490000, originalPrice: 650000, categoryId: 'CAT06', categoryName: 'Sức khỏe & Làm đẹp',
    shopId: 'SHOP002', shopName: 'Fashion Nova VN', images: ['https://picsum.photos/seed/lipstick/600/600'],
    rating: 4.8, reviewCount: 234, soldCount: 5678, stock: 150, status: 'active', createdAt: new Date('2024-04-18')
  },
  {
    id: 'PRD018', name: 'Xe đạp tập thể dục tại nhà', description: 'Xe đạp tập thể dục với 8 mức kháng lực, đồng hồ hiển thị calo, tốc độ, quãng đường. Khung thép chắc chắn.',
    price: 3290000, originalPrice: 4500000, categoryId: 'CAT08', categoryName: 'Thể thao & Dã ngoại',
    shopId: 'SHOP003', shopName: 'HomeLife Decor', images: ['https://picsum.photos/seed/exercise/600/600'],
    rating: 4.4, reviewCount: 56, soldCount: 345, stock: 15, status: 'active', createdAt: new Date('2024-03-08')
  },
  {
    id: 'PRD019', name: 'Balo laptop chống nước 15.6"', description: 'Balo laptop chống nước, ngăn laptop riêng biệt 15.6 inch, nhiều ngăn tiện dụng. Cổng sạc USB tích hợp.',
    price: 450000, originalPrice: 680000, categoryId: 'CAT02', categoryName: 'Laptop & Máy tính',
    shopId: 'SHOP001', shopName: 'TechZone Store', images: ['https://picsum.photos/seed/backpack/600/600'],
    rating: 4.5, reviewCount: 167, soldCount: 4567, stock: 120, status: 'active', createdAt: new Date('2024-05-12')
  },
  {
    id: 'PRD020', name: 'Bộ xếp hình gỗ Montessori', description: 'Bộ đồ chơi xếp hình gỗ Montessori cho bé 1-5 tuổi, sơn an toàn không độc hại. Phát triển tư duy và vận động.',
    price: 250000, originalPrice: 380000, categoryId: 'CAT07', categoryName: 'Đồ chơi & Trẻ em',
    shopId: 'SHOP003', shopName: 'HomeLife Decor', images: ['https://picsum.photos/seed/wooden/600/600'],
    rating: 4.7, reviewCount: 89, soldCount: 2345, stock: 60, status: 'active', createdAt: new Date('2024-02-28')
  }
];

const MOCK_REVIEWS: ProductReview[] = [
  { id: 'RVW001', productId: 'PRD001', productName: 'iPhone 15 Pro Max 256GB', userId: 'USR001', userName: 'Nguyễn Văn An', userAvatar: 'https://ui-avatars.com/api/?name=Nguyen+An&background=6366f1&color=fff', rating: 5, comment: 'Sản phẩm tuyệt vời, camera chụp rất đẹp, pin trâu!', shopReply: 'Cảm ơn bạn đã ủng hộ shop!', isHidden: false, createdAt: new Date('2024-10-01') },
  { id: 'RVW002', productId: 'PRD001', productName: 'iPhone 15 Pro Max 256GB', userId: 'USR004', userName: 'Phạm Hồng Đào', userAvatar: 'https://ui-avatars.com/api/?name=Pham+Dao&background=ec4899&color=fff', rating: 4, comment: 'Máy đẹp, giao hàng nhanh. Giá hơi cao nhưng xứng đáng.', shopReply: '', isHidden: false, createdAt: new Date('2024-10-05') },
  { id: 'RVW003', productId: 'PRD004', productName: 'Áo Polo Nam Premium Cotton', userId: 'USR005', userName: 'Võ Thanh Sơn', userAvatar: 'https://ui-avatars.com/api/?name=Vo+Son&background=14b8a6&color=fff', rating: 5, comment: 'Vải rất mát, form đẹp, đúng size. Sẽ mua thêm!', shopReply: 'Cảm ơn bạn! Mong được phục vụ lần sau.', isHidden: false, createdAt: new Date('2024-08-15') },
  { id: 'RVW004', productId: 'PRD006', productName: 'Nồi chiên không dầu 6L', userId: 'USR001', userName: 'Nguyễn Văn An', userAvatar: 'https://ui-avatars.com/api/?name=Nguyen+An&background=6366f1&color=fff', rating: 4, comment: 'Nồi chiên tốt, nấu nhanh, dễ vệ sinh. Tiếng hơi ồn.', shopReply: '', isHidden: false, createdAt: new Date('2024-06-20') },
  { id: 'RVW005', productId: 'PRD003', productName: 'MacBook Pro 14" M3 Pro', userId: 'USR004', userName: 'Phạm Hồng Đào', userAvatar: 'https://ui-avatars.com/api/?name=Pham+Dao&background=ec4899&color=fff', rating: 5, comment: 'Máy chạy cực nhanh, màn hình đẹp. Xứng đáng đồng tiền!', shopReply: 'Cảm ơn bạn đã đánh giá 5 sao!', isHidden: false, createdAt: new Date('2024-09-20') },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>([...MOCK_PRODUCTS]);
  private readonly _categories = signal<Category[]>([...MOCK_CATEGORIES]);
  private readonly _reviews = signal<ProductReview[]>([...MOCK_REVIEWS]);

  readonly products = this._products.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly reviews = this._reviews.asReadonly();

  getProducts(filter?: Partial<ProductFilter>): Product[] {
    let result = this._products().filter(p => p.status === 'active');
    if (filter) {
      if (filter.keyword) {
        const kw = filter.keyword.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw));
      }
      if (filter.categoryId) {
        result = result.filter(p => p.categoryId === filter.categoryId);
      }
      if (filter.minPrice != null) {
        result = result.filter(p => p.price >= filter.minPrice!);
      }
      if (filter.maxPrice != null) {
        result = result.filter(p => p.price <= filter.maxPrice!);
      }
      if (filter.minRating != null) {
        result = result.filter(p => p.rating >= filter.minRating!);
      }
      if (filter.sortBy) {
        switch (filter.sortBy) {
          case 'price-asc': result.sort((a, b) => a.price - b.price); break;
          case 'price-desc': result.sort((a, b) => b.price - a.price); break;
          case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
          case 'best-selling': result.sort((a, b) => b.soldCount - a.soldCount); break;
          case 'rating': result.sort((a, b) => b.rating - a.rating); break;
        }
      }
    }
    return result;
  }

  getAllProducts(): Product[] {
    return this._products();
  }

  getProductById(id: string): Product | undefined {
    return this._products().find(p => p.id === id);
  }

  getProductsByShop(shopId: string): Product[] {
    return this._products().filter(p => p.shopId === shopId);
  }

  getCategories(): Category[] {
    return this._categories();
  }

  getCategoryById(id: string): Category | undefined {
    return this._categories().find(c => c.id === id);
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount' | 'soldCount'>): Product {
    const newProduct: Product = {
      ...product,
      id: 'PRD' + String(this._products().length + 1).padStart(3, '0'),
      rating: 0, reviewCount: 0, soldCount: 0, createdAt: new Date()
    };
    this._products.update(p => [...p, newProduct]);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    this._products.update(products => products.map(p => p.id === id ? { ...p, ...updates } : p));
  }

  deleteProduct(id: string): void {
    this._products.update(products => products.filter(p => p.id !== id));
  }

  updateProductStatus(id: string, status: ProductStatus): void {
    this._products.update(products => products.map(p => p.id === id ? { ...p, status } : p));
  }

  getReviewsByProduct(productId: string): ProductReview[] {
    return this._reviews().filter(r => r.productId === productId && !r.isHidden);
  }

  getAllReviews(): ProductReview[] {
    return this._reviews();
  }

  getReviewsByShop(shopId: string): ProductReview[] {
    const shopProducts = this.getProductsByShop(shopId).map(p => p.id);
    return this._reviews().filter(r => shopProducts.includes(r.productId));
  }

  addReview(review: Omit<ProductReview, 'id' | 'createdAt' | 'shopReply' | 'isHidden'>): void {
    const newReview: ProductReview = {
      ...review, id: 'RVW' + String(this._reviews().length + 1).padStart(3, '0'),
      shopReply: '', isHidden: false, createdAt: new Date()
    };
    this._reviews.update(r => [...r, newReview]);
  }

  replyToReview(reviewId: string, reply: string): void {
    this._reviews.update(reviews => reviews.map(r => r.id === reviewId ? { ...r, shopReply: reply } : r));
  }

  toggleReviewVisibility(reviewId: string): void {
    this._reviews.update(reviews => reviews.map(r => r.id === reviewId ? { ...r, isHidden: !r.isHidden } : r));
  }

  deleteReview(reviewId: string): void {
    this._reviews.update(reviews => reviews.filter(r => r.id !== reviewId));
  }

  addCategory(category: Omit<Category, 'id' | 'productCount'>): Category {
    const newCat: Category = { ...category, id: 'CAT' + String(this._categories().length + 1).padStart(2, '0'), productCount: 0 };
    this._categories.update(c => [...c, newCat]);
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): void {
    this._categories.update(cats => cats.map(c => c.id === id ? { ...c, ...updates } : c));
  }

  deleteCategory(id: string): void {
    this._categories.update(cats => cats.filter(c => c.id !== id));
  }

  updateStock(productId: string, quantity: number): void {
    this._products.update(products => products.map(p => p.id === productId ? { ...p, stock: quantity } : p));
  }
}
