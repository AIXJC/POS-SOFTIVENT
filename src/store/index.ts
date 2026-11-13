import { useEffect, useMemo, useState } from 'react';
import type {
  AppSettings,
  CartItem,
  CashClosure,
  Category,
  Customer,
  PaymentMethod,
  Product,
  Promotion,
  ReturnRecord,
  Transaction
} from '../types';
import {
  cashClosures as seedCashClosures,
  categories as seedCategories,
  customers as seedCustomers,
  products as seedProducts,
  promotions as seedPromotions,
  returnRecords as seedReturns,
  settings as seedSettings,
  transactions as seedTransactions
} from '../data/mockData';

const money = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
});

export function formatCurrency(value: number) {
  return money.format(value);
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function today() {
  return new Date().toLocaleString('es-MX', { hour12: false });
}

function normalizeNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const rawValue = window.localStorage.getItem(key);
      if (!rawValue) return initialValue;
      const parsed = JSON.parse(rawValue) as T;
      // Si esperamos arreglo pero hay objeto corrupto de versiones viejas, resetea
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) return initialValue;
      if (parsed === null || parsed === undefined) return initialValue;
      return parsed;
    } catch {
      try { window.localStorage.removeItem(key); } catch { /* noop */ }
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage lleno o bloqueado: no rompemos la app
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function usePosStore() {
  const [inventoryRaw, setInventory] = usePersistentState<Product[]>('dm-inventory', seedProducts);
  const [customersRaw, setCustomers] = usePersistentState<Customer[]>('dm-customers', seedCustomers);
  const [categoriesRaw, setCategories] = usePersistentState<Category[]>('dm-categories', seedCategories);
  const [cartRaw, setCart] = useState<CartItem[]>([]);
  const [transactionsRaw, setTransactions] = usePersistentState<Transaction[]>('dm-transactions', seedTransactions);
  const [promotionsRaw, setPromotions] = usePersistentState<Promotion[]>('dm-promotions', seedPromotions);
  const [returnRecordsRaw, setReturnRecords] = usePersistentState<ReturnRecord[]>('dm-returns', seedReturns);
  const [cashClosuresRaw, setCashClosures] = usePersistentState<CashClosure[]>('dm-cash-closures', seedCashClosures);
  const [settings, setSettings] = usePersistentState<AppSettings>('dm-settings', seedSettings);

  const inventory = Array.isArray(inventoryRaw) ? inventoryRaw : seedProducts;
  const customers = Array.isArray(customersRaw) ? customersRaw : seedCustomers;
  const categories = Array.isArray(categoriesRaw) ? categoriesRaw : seedCategories;
  const cart = Array.isArray(cartRaw) ? cartRaw : [];
  const transactions = Array.isArray(transactionsRaw) ? transactionsRaw : seedTransactions;
  const promotions = Array.isArray(promotionsRaw) ? promotionsRaw : seedPromotions;
  const returnRecords = Array.isArray(returnRecordsRaw) ? returnRecordsRaw : seedReturns;
  const cashClosures = Array.isArray(cashClosuresRaw) ? cashClosuresRaw : seedCashClosures;

  const subtotal = useMemo(() => cart.reduce((total, item) => total + item.product.price * item.quantity, 0), [cart]);
  const tax = useMemo(
    () => cart.reduce((total, item) => total + item.product.price * item.quantity * item.product.taxRate, 0),
    [cart]
  );
  const total = subtotal + tax;

  function addToCart(product: Product) {
    if (product.stock <= 0 && product.stock < 900) return;
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        if (product.stock < 900 && existing.quantity >= product.stock) return current;
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setCart((current) =>
      current
        .map((item) => {
          if (item.product.id !== productId) return item;
          const max = item.product.stock >= 900 ? quantity : Math.min(quantity, item.product.stock);
          return { ...item, quantity: Math.max(0, max) };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function checkout(method: PaymentMethod, customer = 'Publico general', discount = 0) {
    if (!cart.length) return;
    const safeDiscount = Math.min(Math.max(normalizeNumber(discount), 0), subtotal + tax);
    const finalTotal = subtotal + tax - safeDiscount;

    const transaction: Transaction = {
      id: `T-${Date.now().toString().slice(-6)}`,
      date: today(),
      customer,
      method,
      subtotal,
      tax,
      discount: safeDiscount,
      total: finalTotal,
      status: 'Completada',
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      }))
    };

    const stockByProduct = new Map(cart.map((item) => [item.product.id, item.quantity]));
    setInventory((current) =>
      current.map((product) => ({
        ...product,
        stock: product.stock >= 900 ? product.stock : Math.max(0, product.stock - (stockByProduct.get(product.id) ?? 0))
      }))
    );
    setTransactions((current) => [transaction, ...current]);
    setCart([]);
  }

  function addProduct(product: Omit<Product, 'id'>) {
    setInventory((current) => [{ id: makeId('p'), ...product }, ...current]);
  }

  function updateProduct(productId: string, patch: Partial<Product>) {
    setInventory((current) => current.map((product) => (product.id === productId ? { ...product, ...patch } : product)));
  }

  function deleteProduct(productId: string) {
    setInventory((current) => current.filter((product) => product.id !== productId));
    setCart((current) => current.filter((item) => item.product.id !== productId));
  }

  function addCustomer(customer: Omit<Customer, 'id' | 'status'>) {
    setCustomers((current) => [
      {
        id: makeId('cust'),
        ...customer,
        balance: normalizeNumber(customer.balance),
        status: customer.balance > 0 ? 'Pendiente' : 'Pagado'
      },
      ...current
    ]);
  }

  function updateCustomer(customerId: string, patch: Partial<Customer>) {
    setCustomers((current) =>
      current.map((customer) => {
        if (customer.id !== customerId) return customer;
        const next = { ...customer, ...patch };
        return { ...next, status: next.balance > 0 ? 'Pendiente' : next.status === 'Credito' ? 'Credito' : 'Pagado' };
      })
    );
  }

  function deleteCustomer(customerId: string) {
    setCustomers((current) => current.filter((customer) => customer.id !== customerId));
  }

  function payCustomer(customerId: string, amount: number, method: PaymentMethod) {
    const customer = customers.find((item) => item.id === customerId);
    if (!customer) return;
    const paid = Math.min(Math.max(normalizeNumber(amount), 0), customer.balance);
    if (paid <= 0) return;
    updateCustomer(customerId, { balance: customer.balance - paid });
    setTransactions((current) => [
      {
        id: `T-${Date.now().toString().slice(-6)}`,
        date: today(),
        customer: customer.name,
        method,
        subtotal: paid,
        tax: 0,
        discount: 0,
        total: paid,
        status: 'Completada',
        items: [{ productId: 'customer-payment', name: 'Pago del cliente', quantity: 1, price: paid }]
      },
      ...current
    ]);
  }

  function addCategory(category: Omit<Category, 'id'>) {
    setCategories((current) => [{
      id: makeId('cat'),
      ...category,
      sortOrder: current.reduce((max, c) => Math.max(max, c.sortOrder), 0) + 1
    }, ...current]);
  }

  function updateCategory(categoryId: string, patch: Partial<Category>) {
    setCategories((current) => current.map((category) => category.id === categoryId ? { ...category, ...patch } : category));
  }

  function deleteCategory(categoryId: string) {
    setCategories((current) => current.filter((category) => category.id !== categoryId));
    setInventory((current) => current.filter((product) => product.category !== categoryId));
  }

  function addPromotion(promotion: Omit<Promotion, 'id' | 'active'>) {
    setPromotions((current) => [{ id: makeId('promo'), ...promotion, active: true }, ...current]);
  }

  function togglePromotion(promotionId: string) {
    setPromotions((current) =>
      current.map((promotion) => (promotion.id === promotionId ? { ...promotion, active: !promotion.active } : promotion))
    );
  }

  function deletePromotion(promotionId: string) {
    setPromotions((current) => current.filter((promotion) => promotion.id !== promotionId));
  }

  function cancelTransaction(transactionId: string) {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === transactionId && transaction.status === 'Completada'
          ? { ...transaction, status: 'Cancelada' }
          : transaction
      )
    );
  }

  function registerReturn(ticketId: string, reason: string, notes: string) {
    const transaction = transactions.find((item) => item.id === ticketId);
    if (!transaction || transaction.status !== 'Completada') return false;

    setTransactions((current) =>
      current.map((item) => (item.id === ticketId ? { ...item, status: 'Devuelta' } : item))
    );
    setReturnRecords((current) => [
      { id: makeId('ret'), ticketId, reason, notes, date: today(), amount: transaction.total },
      ...current
    ]);

    const quantities = new Map(transaction.items?.map((item) => [item.productId, item.quantity]) ?? []);
    setInventory((current) =>
      current.map((product) => ({
        ...product,
        stock: product.stock >= 900 ? product.stock : product.stock + (quantities.get(product.id) ?? 0)
      }))
    );
    return true;
  }

  function closeCash(denominations: Record<string, number>) {
    const cashSales = transactions
      .filter((transaction) => transaction.status === 'Completada' && transaction.method === 'Efectivo')
      .reduce((sum, transaction) => sum + transaction.total, 0);
    const expected = settings.openingCash + cashSales;
    const counted = Object.entries(denominations).reduce((sum, [label, quantity]) => {
      const value = label === 'Monedas' ? 1 : Number(label.replace('$', ''));
      return sum + value * normalizeNumber(quantity);
    }, 0);
    setCashClosures((current) => [
      {
        id: makeId('cash'),
        date: today(),
        expected,
        counted,
        difference: counted - expected,
        denominations
      },
      ...current
    ]);
  }

  function saveSettings(nextSettings: AppSettings) {
    setSettings(nextSettings);
  }

  function resetDemoData() {
    setInventory(seedProducts);
    setCustomers(seedCustomers);
    setCategories(seedCategories);
    setCart([]);
    setTransactions(seedTransactions);
    setPromotions(seedPromotions);
    setReturnRecords(seedReturns);
    setCashClosures(seedCashClosures);
    setSettings(seedSettings);
  }

  return {
    inventory,
    customers,
    categories,
    cart,
    transactions,
    promotions,
    returnRecords,
    cashClosures,
    settings,
    subtotal,
    tax,
    total,
    addToCart,
    updateQuantity,
    checkout,
    clearCart: () => setCart([]),
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    payCustomer,
    addCategory,
    updateCategory,
    deleteCategory,
    addPromotion,
    togglePromotion,
    deletePromotion,
    cancelTransaction,
    registerReturn,
    closeCash,
    saveSettings,
    resetDemoData
  };
}

export type PosStore = ReturnType<typeof usePosStore>;

export function downloadCsv(filename: string, rows: Array<Record<string, string | number | undefined>>) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | undefined) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
