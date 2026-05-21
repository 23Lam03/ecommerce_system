export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
  parentId: string | null;
  isActive: boolean;
}
