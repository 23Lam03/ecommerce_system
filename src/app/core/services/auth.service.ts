import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole, LoginRequest, RegisterRequest, ShopInfo } from '../models/user.model';
import { StorageService } from './storage.service';

const MOCK_USERS: User[] = [
  {
    id: 'USR001', fullName: 'Nguyễn Văn An', email: 'customer@demo.com', phone: '0901234567',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+An&background=6366f1&color=fff', role: 'customer',
    status: 'active', address: '123 Lê Lợi, Q.1, TP.HCM', createdAt: new Date('2024-01-15')
  },
  {
    id: 'USR002', fullName: 'Trần Thị Bích', email: 'shop@demo.com', phone: '0912345678',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Bich&background=0ea5e9&color=fff', role: 'shop',
    status: 'active', address: '456 Nguyễn Huệ, Q.1, TP.HCM', createdAt: new Date('2024-02-20')
  },
  {
    id: 'USR003', fullName: 'Lê Minh Tuấn', email: 'admin@demo.com', phone: '0923456789',
    avatar: 'https://ui-avatars.com/api/?name=Le+Tuan&background=8b5cf6&color=fff', role: 'admin',
    status: 'active', address: '789 Pasteur, Q.3, TP.HCM', createdAt: new Date('2024-01-01')
  },
  {
    id: 'USR004', fullName: 'Phạm Hồng Đào', email: 'dao@demo.com', phone: '0934567890',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Dao&background=ec4899&color=fff', role: 'customer',
    status: 'active', address: '321 Hai Bà Trưng, Q.3, TP.HCM', createdAt: new Date('2024-03-10')
  },
  {
    id: 'USR005', fullName: 'Võ Thanh Sơn', email: 'son@demo.com', phone: '0945678901',
    avatar: 'https://ui-avatars.com/api/?name=Vo+Son&background=14b8a6&color=fff', role: 'customer',
    status: 'inactive', address: '654 Cách Mạng Tháng 8, Q.10, TP.HCM', createdAt: new Date('2024-04-05')
  },
  {
    id: 'USR006', fullName: 'Ngô Bảo Ngọc', email: 'shop2@demo.com', phone: '0956789012',
    avatar: 'https://ui-avatars.com/api/?name=Ngo+Ngoc&background=f59e0b&color=fff', role: 'shop',
    status: 'active', address: '987 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM', createdAt: new Date('2024-05-15')
  }
];

const MOCK_SHOPS: ShopInfo[] = [
  {
    id: 'SHOP001', ownerId: 'USR002', shopName: 'TechZone Store', description: 'Cửa hàng công nghệ hàng đầu',
    logo: 'https://ui-avatars.com/api/?name=TZ&background=0ea5e9&color=fff&size=128', address: '456 Nguyễn Huệ, Q.1, TP.HCM',
    phone: '0912345678', rating: 4.8, totalProducts: 156, totalOrders: 1234, revenue: 567000000,
    status: 'approved', createdAt: new Date('2024-02-20')
  },
  {
    id: 'SHOP002', ownerId: 'USR006', shopName: 'Fashion Nova VN', description: 'Thời trang cao cấp nhập khẩu',
    logo: 'https://ui-avatars.com/api/?name=FN&background=ec4899&color=fff&size=128', address: '987 Điện Biên Phủ, Bình Thạnh',
    phone: '0956789012', rating: 4.5, totalProducts: 89, totalOrders: 567, revenue: 234000000,
    status: 'approved', createdAt: new Date('2024-05-15')
  },
  {
    id: 'SHOP003', ownerId: 'USR004', shopName: 'HomeLife Decor', description: 'Đồ gia dụng & trang trí nội thất',
    logo: 'https://ui-avatars.com/api/?name=HL&background=10b981&color=fff&size=128', address: '321 Hai Bà Trưng, Q.3',
    phone: '0934567890', rating: 4.2, totalProducts: 45, totalOrders: 234, revenue: 120000000,
    status: 'pending', createdAt: new Date('2024-06-01')
  }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _allUsers = signal<User[]>([...MOCK_USERS]);
  private readonly _allShops = signal<ShopInfo[]>([...MOCK_SHOPS]);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly userRole = computed(() => this._currentUser()?.role ?? null);
  readonly allUsers = this._allUsers.asReadonly();
  readonly allShops = this._allShops.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const savedUser = this.storage.getItem<User>('currentUser');
    const savedToken = this.storage.getItem<string>('authToken');
    if (savedUser && savedToken) {
      this._currentUser.set(savedUser);
      this._token.set(savedToken);
    }
  }

  login(request: LoginRequest): { success: boolean; message: string } {
    const user = this._allUsers().find(u => u.email === request.email);
    if (!user) {
      return { success: false, message: 'Email không tồn tại trong hệ thống' };
    }
    if (request.password.length < 6) {
      return { success: false, message: 'Mật khẩu không chính xác' };
    }
    if (user.status === 'banned') {
      return { success: false, message: 'Tài khoản đã bị khóa' };
    }
    const token = 'mock-jwt-token-' + user.id + '-' + Date.now();
    this._currentUser.set(user);
    this._token.set(token);
    this.storage.setItem('currentUser', user);
    this.storage.setItem('authToken', token);
    return { success: true, message: 'Đăng nhập thành công' };
  }

  register(request: RegisterRequest): { success: boolean; message: string } {
    const exists = this._allUsers().find(u => u.email === request.email);
    if (exists) {
      return { success: false, message: 'Email đã được sử dụng' };
    }
    const newUser: User = {
      id: 'USR' + String(this._allUsers().length + 1).padStart(3, '0'),
      fullName: request.fullName,
      email: request.email,
      phone: request.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(request.fullName)}&background=6366f1&color=fff`,
      role: request.role,
      status: 'active',
      address: '',
      createdAt: new Date()
    };
    this._allUsers.update(users => [...users, newUser]);
    const token = 'mock-jwt-token-' + newUser.id + '-' + Date.now();
    this._currentUser.set(newUser);
    this._token.set(token);
    this.storage.setItem('currentUser', newUser);
    this.storage.setItem('authToken', token);
    return { success: true, message: 'Đăng ký thành công' };
  }

  logout(): void {
    this._currentUser.set(null);
    this._token.set(null);
    this.storage.removeItem('currentUser');
    this.storage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }

  updateUser(updates: Partial<User>): void {
    const current = this._currentUser();
    if (current) {
      const updated = { ...current, ...updates };
      this._currentUser.set(updated);
      this.storage.setItem('currentUser', updated);
      this._allUsers.update(users => users.map(u => u.id === updated.id ? updated : u));
    }
  }

  updateUserStatus(userId: string, status: User['status']): void {
    this._allUsers.update(users => users.map(u => u.id === userId ? { ...u, status } : u));
  }

  getShopByOwnerId(ownerId: string): ShopInfo | undefined {
    return this._allShops().find(s => s.ownerId === ownerId);
  }

  updateShopStatus(shopId: string, status: ShopInfo['status']): void {
    this._allShops.update(shops => shops.map(s => s.id === shopId ? { ...s, status } : s));
  }

  updateShop(shopId: string, updates: Partial<ShopInfo>): void {
    this._allShops.update(shops => shops.map(s => s.id === shopId ? { ...s, ...updates } : s));
  }

  addShop(shop: Omit<ShopInfo, 'id' | 'createdAt' | 'rating' | 'totalProducts' | 'totalOrders' | 'revenue'>): ShopInfo {
    const newShop: ShopInfo = {
      ...shop,
      id: 'SHOP' + String(this._allShops().length + 1).padStart(3, '0'),
      rating: 0,
      totalProducts: 0,
      totalOrders: 0,
      revenue: 0,
      createdAt: new Date(),
    };
    this._allShops.update(shops => [...shops, newShop]);
    return newShop;
  }

  deleteShop(shopId: string): void {
    this._allShops.update(shops => shops.filter(s => s.id !== shopId));
  }

  getUserById(userId: string): User | undefined {
    return this._allUsers().find(u => u.id === userId);
  }
}
