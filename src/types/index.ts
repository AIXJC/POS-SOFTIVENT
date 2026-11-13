import type { LucideIcon } from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'pos'
  | 'scan'
  | 'cash'
  | 'inventory'
  | 'clients'
  | 'categories'
  | 'payments'
  | 'transactions'
  | 'returns'
  | 'promotions'
  | 'reports'
  | 'settings';

export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Mixto';

export interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  taxRate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  balance: number;
  status: 'Pagado' | 'Pendiente' | 'Credito';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon: string;
  sortOrder: number;
}

export interface Transaction {
  id: string;
  date: string;
  customer: string;
  method: PaymentMethod;
  subtotal?: number;
  tax?: number;
  discount?: number;
  total: number;
  status: 'Completada' | 'Cancelada' | 'Devuelta';
  items?: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  value: string;
  active: boolean;
  endsAt: string;
}

export interface ReturnRecord {
  id: string;
  ticketId: string;
  reason: string;
  notes: string;
  date: string;
  amount: number;
}

export interface CashClosure {
  id: string;
  date: string;
  expected: number;
  counted: number;
  difference: number;
  denominations: Record<string, number>;
}

export interface AppSettings {
  branch: string;
  localPort: string;
  openingCash: number;
  currency: string;
  persistData: boolean;
}

export type UserRole = 'superadmin' | 'user';

export interface AppSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
