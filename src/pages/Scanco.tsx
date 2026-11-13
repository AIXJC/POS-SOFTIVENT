import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Delete, LogOut, Minus, Plus, ScanLine, ShoppingBasket, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../store';
import type { PosStore } from '../store';

interface ScancoProps {
  store: PosStore;
  userName?: string;
  onExit?: () => void;
  onLogout?: () => void;
}

function Scanco({ store, userName = 'Cajero', onExit, onLogout }: ScancoProps) {
  const [query, setQuery] = useState('');
  const [customer, setCustomer] = useState('');
  const [method, setMethod] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Mixto'>('Efectivo');
  const [discount, setDiscount] = useState(0);
  const [flashId, setFlashId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const products = useMemo(
    () =>
      store.inventory.filter((p) =>
        `${p.name} ${p.sku} ${p.id} ${p.category}`.toLowerCase().includes(query.toLowerCase())
      ),
    [store.inventory, query]
  );

  function commitScan(sku: string) {
    const term = sku.trim().toLowerCase();
    if (!term) return;
    const exact = store.inventory.find((p) => p.sku.toLowerCase() === term || p.id.toLowerCase() === term);
    const target = exact ?? (products.length === 1 ? products[0] : undefined);
    if (target) {
      store.addToCart(target);
      setFlashId(target.id);
      window.setTimeout(() => setFlashId(null), 650);
      setQuery('');
    }
  }

  function handleScanEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitScan(query);
      inputRef.current?.focus();
    }
  }

  function changeQty(productId: string, delta: number) {
    const current = store.cart.find((i) => i.product.id === productId)?.quantity ?? 0;
    store.updateQuantity(productId, current + delta);
  }

  function handleCheckout() {
    store.checkout(method, customer || 'Publico general', discount);
    setDiscount(0);
    setCustomer('');
    inputRef.current?.focus();
  }

  const itemCount = store.cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = store.subtotal;
  const grandTotal = Math.max(0, store.total - discount);

  return (
    <div className="cash-screen">
      <header className="cash-top">
        <div className="cash-top-left">
          <span className="cash-logo"><ShoppingBasket size={20} /></span>
          <div>
            <strong>Tienda de Abarrotes</strong>
            <small>Modo cobro</small>
          </div>
        </div>
        <div className="cash-top-right">
          <div className="cash-clock">{new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</div>
          <div className="cash-cashier">
            <span className="cash-avatar">{userName.charAt(0).toUpperCase()}</span>
            <span>
              <small>Cajero</small>
              <strong>{userName}</strong>
            </span>
          </div>
        </div>
      </header>

      <div className="cash-body">
        <section className="cash-catalog">
          <div className="scan-bar">
            <ScanLine size={22} />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleScanEnter}
              placeholder="Escanea el código de barras o busca por nombre…"
              autoFocus
            />
            {query && (
              <button className="scan-clear" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Limpiar">
                <X size={16} />
              </button>
            )}
            <button className="scan-submit" disabled={!query.trim()} onClick={() => commitScan(query)}>
              Agregar
            </button>
          </div>

          <div className="catalog-head">
            <h3>Catálogo</h3>
            <span className="soft-badge">{products.length} productos</span>
          </div>

          <div className="cash-table">
            <div className="cash-table-head">
              <span className="col-id">ID / SKU</span>
              <span className="col-name">Producto</span>
              <span className="col-price">Precio</span>
              <span className="col-act"></span>
            </div>
            <div className="cash-table-body">
              {products.map((product) => {
                const inCart = store.cart.find((i) => i.product.id === product.id);
                return (
                  <div
                    className={`cash-table-row${flashId === product.id ? ' flash' : ''}${inCart ? ' in-cart' : ''}`}
                    key={product.id}
                    onClick={() => commitScan(product.sku)}
                  >
                    <span className="col-id">{product.sku || product.id}</span>
                    <span className="col-name">
                      {product.name}
                      {product.stock <= product.minStock && <em className="low-stock-tag">stock bajo</em>}
                    </span>
                    <span className="col-price">{formatCurrency(product.price)}</span>
                    <span className="col-act">
                      {inCart ? <CheckCircle2 size={18} className="in-cart-check" /> : <Plus size={18} />}
                    </span>
                  </div>
                );
              })}
              {!products.length && <p className="empty-state">Sin resultados para “{query}”.</p>}
            </div>
          </div>
        </section>
        <aside className="ticket-panel">
          <div className="ticket-head">
            <div>
              <h2>Ticket de venta</h2>
              <span className="soft-badge">{itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}</span>
            </div>
            {store.cart.length > 0 && (
              <button className="ticket-clear" title="Vaciar ticket" onClick={() => store.clearCart()}>
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <input
            className="ticket-customer"
            placeholder="Cliente (opcional)"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />

          <div className="ticket-list">
            {store.cart.map((item) => (
              <div className="ticket-line" key={item.product.id}>
                <div className="ticket-line-main">
                  <strong>{item.product.name}</strong>
                  <span className="ticket-line-sku">{item.product.sku || item.product.id}</span>
                </div>
                <div className="ticket-line-qty">
                  <button title="Quitar uno" onClick={() => changeQty(item.product.id, -1)}><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button title="Agregar uno" onClick={() => changeQty(item.product.id, 1)}><Plus size={14} /></button>
                </div>
                <div className="ticket-line-price">
                  <span className="unit">{formatCurrency(item.product.price)} c/u</span>
                  <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
                </div>
              </div>
            ))}
            {!store.cart.length && (
              <div className="ticket-empty">
                <ShoppingBasket size={30} />
                <p>Escanea o toca un producto para empezar la venta.</p>
              </div>
            )}
          </div>

          <div className="ticket-totals">
            <span>Subtotal <strong>{formatCurrency(subtotal)}</strong></span>
            <span>IVA <strong>{formatCurrency(store.tax)}</strong></span>
            <label className="ticket-discount">
              Descuento
              <input type="number" min="0" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
            </label>
            <span className="ticket-grand">Total a pagar <strong>{formatCurrency(grandTotal)}</strong></span>
          </div>

          <div className="ticket-methods">
            {(['Efectivo', 'Tarjeta', 'Transferencia', 'Mixto'] as const).map((m) => (
              <button key={m} className={method === m ? 'active' : ''} onClick={() => setMethod(m)}>{m}</button>
            ))}
          </div>

          <button className="ticket-pay" disabled={!store.cart.length} onClick={handleCheckout}>
            Cobrar {formatCurrency(grandTotal)}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Scanco;