const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

app.get('/api/health', async (_req, res) => {
  res.json({ ok: true, message: 'API local lista (SQLite/JSON, sin MariaDB externa)', mode: db.mode });
});

function requireAdmin(req, res, next) {
  const role = req.headers['x-role'];
  if (role !== 'superadmin') return res.status(403).json({ ok: false, message: 'Solo superadmin' });
  next();
}

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, message: 'Email y contraseña requeridos' });
  const user = db.list('users').find((u) => u.email === email && String(u.password) === String(password) && u.active);
  if (!user) return res.status(401).json({ ok: false, message: 'Credenciales inválidas' });
  return res.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/products', async (_req, res) => {
  res.json({ ok: true, data: db.list('products') });
});
app.post('/api/products', requireAdmin, async (req, res) => {
  const row = { id: uid('prod'), minStock: 0, taxRate: 0.16, ...req.body };
  res.json({ ok: true, data: db.insert('products', row) });
});
app.put('/api/products/:id', requireAdmin, async (req, res) => {
  res.json({ ok: true, data: db.update('products', req.params.id, req.body) });
});
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  db.remove('products', req.params.id);
  res.json({ ok: true });
});

app.get('/api/categories', async (_req, res) => {
  res.json({ ok: true, data: db.list('categories') });
});
app.post('/api/categories', requireAdmin, async (req, res) => {
  res.json({ ok: true, data: db.insert('categories', { id: uid('cat'), ...req.body }) });
});
app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  db.remove('categories', req.params.id);
  res.json({ ok: true });
});

app.get('/api/customers', async (_req, res) => {
  res.json({ ok: true, data: db.list('customers') });
});
app.post('/api/customers', requireAdmin, async (req, res) => {
  res.json({ ok: true, data: db.insert('customers', { id: uid('cust'), balance: 0, status: 'Pagado', ...req.body }) });
});

app.get('/api/transactions', async (_req, res) => {
  res.json({ ok: true, data: db.list('transactions') });
});
app.post('/api/transactions', async (req, res) => {
  const body = req.body || {};
  const items = body.items || [];
  // descuenta stock estilo Walmart/HB
  items.forEach((it) => {
    const p = db.get('products', it.productId);
    if (p) db.update('products', p.id, { stock: Math.max(0, Number(p.stock) - Number(it.quantity || 0)) });
  });
  const row = { id: body.id || uid('T'), date: new Date().toLocaleString('es-MX'), status: 'Completada', ...body, payload: JSON.stringify(body) };
  res.json({ ok: true, data: db.insert('transactions', row) });
});

app.get('/api/dashboard', async (_req, res) => {
  const products = db.list('products');
  const txs = db.list('transactions');
  res.json({ ok: true, data: { activeProducts: products.length, tickets: txs.length, total: txs.reduce((s, t) => s + Number(t.total || 0), 0) } });
});

// Front compilado (dist) servido desde el mismo back para evitar CORS/puertos
const distDir = path.join(__dirname, '..', '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  // Fallback SPA: cualquier ruta que no sea /api ni un asset, devuelve index.html
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Backend running on http://127.0.0.1:${port} mode=${db.mode}`);
});
