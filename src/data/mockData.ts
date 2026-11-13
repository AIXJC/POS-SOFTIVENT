import type { AppSettings, CashClosure, Customer, Product, Promotion, ReturnRecord, Transaction, Category } from '../types';

export const categories: Category[] = [
  { id: 'cat-snacks', name: 'Snacks', description: 'Galletas, papas, frutos secos', icon: 'snackbar', sortOrder: 1 },
  { id: 'cat-lacteos', name: 'Lácteos', description: 'Leche, yogur, quesos', icon: 'cheese', sortOrder: 2 },
  { id: 'cat-carnes', name: 'Carnes', description: 'Pollo, res, cerdo', icon: 'meat', sortOrder: 3 },
  { id: 'cat-granos', name: 'Granos', description: 'Arroz, pasta, harinas', icon: 'box', sortOrder: 4 },
  { id: 'cat-conservas', name: 'Conservas', description: 'Sopas, vegetales, atun', icon: 'can', sortOrder: 5 },
  { id: 'cat-bebidas', name: 'Bebidas', description: 'Agua, gaseosas, jugos', icon: 'cup-soda', sortOrder: 6 },
  { id: 'cat-congelados', name: 'Congelados', description: 'Hamburguesas, panes, helado', icon: 'snowflake', sortOrder: 7 },
  { id: 'cat-hogar', name: 'Hogar', description: 'Limpiadores, papelería', icon: 'square', sortOrder: 8 }
];

export const products: Product[] = [
  { id: 'prod-001', name: 'Galletas de Chocolate', sku: 'SN-CHOC-01', category: 'Snacks', price: 32, stock: 120, minStock: 20, taxRate: 0.16 },
  { id: 'prod-002', name: 'Papas Fritas Medio Folio', sku: 'SN-PAPA-02', category: 'Snacks', price: 28, stock: 80, minStock: 15, taxRate: 0.16 },
  { id: 'prod-003', name: 'Leche Entera 3L', sku: 'LT-3L-03', category: 'Lácteos', price: 76, stock: 64, minStock: 10, taxRate: 0.16 },
  { id: 'prod-004', name: 'Yogur Natural 12ud', sku: 'LT-YOG-04', category: 'Lácteos', price: 48, stock: 48, minStock: 10, taxRate: 0.16 },
  { id: 'prod-005', name: 'Queso Fresco 1kg', sku: 'LT-QUE-05', category: 'Lácteos', price: 110, stock: 28, minStock: 8, taxRate: 0.16 },
  { id: 'prod-006', name: 'Pollo Madurado 500g', sku: 'CA-POL-06', category: 'Carnes', price: 95, stock: 30, minStock: 8, taxRate: 0.16 },
  { id: 'prod-007', name: 'Res Ralla 1kg', sku: 'CA-RES-07', category: 'Carnes', price: 120, stock: 22, minStock: 6, taxRate: 0.16 },
  { id: 'prod-008', name: 'Arroz Ceniza 5L', sku: 'GR-ARZO-08', category: 'Granos', price: 105, stock: 46, minStock: 10, taxRate: 0.16 },
  { id: 'prod-009', name: 'Pasta Grange 1kg', sku: 'GR-PAST-09', category: 'Granos', price: 24, stock: 92, minStock: 15, taxRate: 0.16 },
  { id: 'prod-010', name: 'Sopa Conchas 220g', sku: 'CO-SOPA-10', category: 'Conservas', price: 18, stock: 200, minStock: 30, taxRate: 0.16 },
  { id: 'prod-011', name: 'Agua 1.5L (6un)', sku: 'BD-AGR-11', category: 'Bebidas', price: 28, stock: 56, minStock: 10, taxRate: 0.16 },
  { id: 'prod-012', name: 'Gaseosa 350ml', sku: 'BD-GAZ-12', category: 'Bebidas', price: 16, stock: 78, minStock: 15, taxRate: 0.16 },
  { id: 'prod-013', name: 'Pan Integral 6ud', sku: 'CG-PAN-13', category: 'Congelados', price: 34, stock: 34, minStock: 8, taxRate: 0.16 },
  { id: 'prod-014', name: 'Crema de Leche 300ml', sku: 'CG-CRE-14', category: 'Congelados', price: 52, stock: 20, minStock: 5, taxRate: 0.16 },
  { id: 'prod-015', name: 'Papelera Larga 60ud', sku: 'HG-PAP-15', category: 'Hogar', price: 42, stock: 40, minStock: 8, taxRate: 0.16 }
];

export const customers: Customer[] = [
  { id: 'cust-001', name: 'Carlos Mendoza', phone: '555-1001', email: 'carlos@example.com', balance: 0, status: 'Pagado' },
  { id: 'cust-002', name: 'Laura López', phone: '555-1002', email: 'laura@example.com', balance: 140, status: 'Pendiente' },
  { id: 'cust-003', name: 'Miguel Herrera', phone: '555-1003', email: 'miguel@example.com', balance: 350, status: 'Credito' },
  { id: 'cust-004', name: 'Ana Ruiz', phone: '555-1004', email: 'ana@example.com', balance: 0, status: 'Pagado' }
];

export const transactions: Transaction[] = [
  { id: 'T-2001', date: '2026-07-23 10:18', customer: 'Lucía Campos', method: 'Tarjeta', subtotal: 293.1, tax: 46.9, discount: 0, total: 340, status: 'Completada', items: [] },
  { id: 'T-2002', date: '2026-07-23 09:42', customer: 'Carlos Mendoza', method: 'Efectivo', subtotal: 181.03, tax: 28.97, discount: 0, total: 210, status: 'Completada', items: [] },
  { id: 'T-2003', date: '2026-07-22 18:06', customer: 'Miguel Herrera', method: 'Transferencia', subtotal: 301.72, tax: 48.28, discount: 0, total: 350, status: 'Completada', items: [] },
  { id: 'T-2004', date: '2026-07-22 17:51', customer: 'Laura López', method: 'Mixto', subtotal: 103.45, tax: 16.55, discount: 0, total: 120, status: 'Devuelta', items: [] }
];

export const promotions: Promotion[] = [
  { id: 'promo-01', title: 'Compra 2, lleva 1 gratis', description: 'Solo en productos de granos y conservas', value: '3x2', active: true, endsAt: '2026-08-15' },
  { id: 'promo-02', title: 'Descuento por volumen', description: '10% de descuento en compras superiores a 500', value: '10%', active: true, endsAt: '2026-07-31' },
  { id: 'promo-03', title: 'Inicio de semana', description: 'Talleres y promociones especiales', value: 'Sin costo', active: false, endsAt: '2026-06-30' }
];

export const returnRecords: ReturnRecord[] = [];

export const cashClosures: CashClosure[] = [];

export const settings: AppSettings = {
  branch: 'Tienda de Abarrotes',
  localPort: '5175',
  openingCash: 500,
  currency: 'MXN',
  persistData: true
};

export function safeArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}
