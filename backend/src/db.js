const fs = require('fs');
const path = require('path');

let Database = null;
try {
  Database = require('better-sqlite3');
} catch {
  Database = null;
}

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'tienda.db');

function seedMemory() {
  return {
    mode: 'memory',
    users: [
      { id: 'u-super', name: 'Super Admin', email: 'superadmin@example.com', password: 'super123', role: 'superadmin', active: 1 },
      { id: 'u-user', name: 'Cajero', email: 'user@example.com', password: 'user123', role: 'user', active: 1 }
    ],
    products: [
      { id: 'prod-001', sku: 'SN-CHOC-01', name: 'Galletas de Chocolate', category: 'Snacks', price: 32, stock: 120, minStock: 20, taxRate: 0.16 },
      { id: 'prod-002', sku: 'SN-PAPA-02', name: 'Papas Fritas', category: 'Snacks', price: 28, stock: 80, minStock: 15, taxRate: 0.16 },
      { id: 'prod-003', sku: 'LT-3L-03', name: 'Leche Entera 3L', category: 'Lacteos', price: 76, stock: 64, minStock: 10, taxRate: 0.16 },
      { id: 'prod-011', sku: 'BD-AGR-11', name: 'Agua 1.5L (6un)', category: 'Bebidas', price: 28, stock: 56, minStock: 10, taxRate: 0.16 },
      { id: 'prod-012', sku: 'BD-GAZ-12', name: 'Gaseosa 350ml', category: 'Bebidas', price: 16, stock: 78, minStock: 15, taxRate: 0.16 }
    ],
    categories: [
      { id: 'cat-snacks', name: 'Snacks', description: 'Galletas, papas', icon: 'box', sortOrder: 1 },
      { id: 'cat-lacteos', name: 'Lacteos', description: 'Leche, yogur', icon: 'box', sortOrder: 2 },
      { id: 'cat-bebidas', name: 'Bebidas', description: 'Agua, refrescos', icon: 'box', sortOrder: 3 }
    ],
    customers: [
      { id: 'cust-001', name: 'Publico general', phone: '', email: '', balance: 0, status: 'Pagado' }
    ],
    transactions: []
  };
}

let mem = seedMemory();
try {
  const raw = fs.readFileSync(path.join(dataDir, 'tienda.json'), 'utf8');
  if (raw) mem = JSON.parse(raw);
} catch { /* usa seed */ }

function saveMem() {
  try { fs.writeFileSync(path.join(dataDir, 'tienda.json'), JSON.stringify(mem, null, 2)); } catch {}
}

let sqlite = null;
if (Database) {
  sqlite = new Database(dbPath);
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, role TEXT, active INTEGER);
    CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, sku TEXT UNIQUE, name TEXT, category TEXT, price REAL, stock INTEGER, minStock INTEGER, taxRate REAL);
    CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT UNIQUE, description TEXT, icon TEXT, sortOrder INTEGER);
    CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, name TEXT, phone TEXT, email TEXT, balance REAL, status TEXT);
    CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, date TEXT, customer TEXT, method TEXT, total REAL, status TEXT, payload TEXT);
  `);
  const count = sqlite.prepare('SELECT COUNT(*) c FROM users').get().c;
  if (count === 0) {
    const insU = sqlite.prepare('INSERT INTO users (id,name,email,password,role,active) VALUES (?,?,?,?,?,?)');
    mem.users.forEach(u => insU.run(u.id, u.name, u.email, u.password, u.role, u.active));
    const insP = sqlite.prepare('INSERT INTO products (id,sku,name,category,price,stock,minStock,taxRate) VALUES (?,?,?,?,?,?,?,?)');
    mem.products.forEach(p => { try { insP.run(p.id, p.sku, p.name, p.category, p.price, p.stock, p.minStock, p.taxRate); } catch {} });
    const insC = sqlite.prepare('INSERT OR IGNORE INTO categories (id,name,description,icon,sortOrder) VALUES (?,?,?,?,?)');
    mem.categories.forEach(c => insC.run(c.id, c.name, c.description, c.icon, c.sortOrder));
    const insCu = sqlite.prepare('INSERT OR IGNORE INTO customers (id,name,phone,email,balance,status) VALUES (?,?,?,?,?,?)');
    mem.customers.forEach(c => insCu.run(c.id, c.name, c.phone, c.email, c.balance, c.status));
  }
}

function list(table) {
  if (sqlite) return sqlite.prepare(`SELECT * FROM ${table}`).all();
  return mem[table] || [];
}
function get(table, id) {
  if (sqlite) return sqlite.prepare(`SELECT * FROM ${table} WHERE id=?`).get(id);
  return (mem[table] || []).find(r => r.id === id);
}
function insert(table, row) {
  if (sqlite) {
    const keys = Object.keys(row);
    sqlite.prepare(`INSERT OR REPLACE INTO ${table} (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`).run(...keys.map(k => typeof row[k] === 'object' ? JSON.stringify(row[k]) : row[k]));
    return row;
  }
  mem[table] = mem[table] || [];
  mem[table].unshift(row);
  saveMem();
  return row;
}
function update(table, id, patch) {
  if (sqlite) {
    const keys = Object.keys(patch);
    if (keys.length) sqlite.prepare(`UPDATE ${table} SET ${keys.map(k => `${k}=?`).join(',')} WHERE id=?`).run(...keys.map(k => patch[k]), id);
    return get(table, id);
  }
  mem[table] = (mem[table] || []).map(r => r.id === id ? { ...r, ...patch } : r);
  saveMem();
  return get(table, id);
}
function remove(table, id) {
  if (sqlite) { sqlite.prepare(`DELETE FROM ${table} WHERE id=?`).run(id); return true; }
  mem[table] = (mem[table] || []).filter(r => r.id !== id);
  saveMem();
  return true;
}

module.exports = { list, get, insert, update, remove, mode: sqlite ? 'sqlite' : 'json-memory' };
