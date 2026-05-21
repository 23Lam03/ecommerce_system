export type UserRole = 'customer' | 'shop' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'banned';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  address: string;
  createdAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ShopInfo {
  id: string;
  ownerId: string;
  shopName: string;
  description: string;
  logo: string;
  address: string;
  phone: string;
  rating: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: Date;
}

export interface AdminStaff {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  permissions: string[];
  status: UserStatus;
}
