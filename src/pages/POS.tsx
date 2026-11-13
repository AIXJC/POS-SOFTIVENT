import { Eye, Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '../store';
import type { PosStore } from '../store';
import type { PaymentMethod } from '../types';

interface POSProps {
  store: PosStore;
}

const methods: PaymentMethod[] = ['Efectivo', 'Tarjeta', 'Transferencia', 'Mixto'];

function POS({ store }: POSProps) {
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('Efectivo');
  const [customer, setCustomer] = useState('Publico general');
  const [discount, setDiscount] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(store.inventory[0]?.id ?? null);
  const products = store.inventory.filter((product) =>
    `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase())
  );
  const selected = store.inventory.find((product) => product.id === selectedId);
  const grandTotal = Math.max(0, store.total - discount);

  function checkout() {
    store.checkout(method, customer, discount);
    setDiscount(0);
    setCustomer('Publico general');
  }

  return (
    <section className="pos-grid">
      <div className="panel">
        <div className="panel-heading">
          <h2>Catalogo</h2>
          <input className="inline-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar producto" />
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <button className="product-card" key={product.id} onClick={() => store.addToCart(product)} onMouseEnter={() => setSelectedId(product.id)}>
              <span>{product.category}</span>
              <strong>{product.name}</strong>
              <small>{product.sku}</small>
              <small>Stock: {product.stock >= 900 ? 'Servicio' : product.stock}</small>
              <b>{formatCurrency(product.price)}</b>
            </button>
          ))}
        </div>
        {selected && (
          <div className="inline-detail">
            <Eye size={17} />
            <span><strong>{selected.name}</strong> Â· {selected.sku} Â· {selected.category} Â· IVA {Math.round(selected.taxRate * 100)}% Â· Stock {selected.stock >= 900 ? 'servicio ilimitado' : selected.stock}</span>
          </div>
        )}
      </div>

      <aside className="panel cart-panel">
        <div className="panel-heading">
          <h2>Ticket actual</h2>
          <button className="icon-button" title="Vaciar ticket" onClick={store.clearCart}>
            <Trash2 size={17} />
          </button>
        </div>
        <input className="inline-input full" value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Cliente" />
        <select className="inline-input full" onChange={(event) => setCustomer(event.target.value)} defaultValue="">
          <option value="">Seleccionar cliente</option>
          {store.customers.map((customer) => (
            <option key={customer.id}>{customer.name}</option>
          ))}
        </select>
        <div className="cart-list">
          {store.cart.map((item) => (
            <div className="cart-line" key={item.product.id}>
              <div>
                <strong>{item.product.name}</strong>
                <span>{formatCurrency(item.product.price)}</span>
              </div>
              <div className="stepper">
                <button onClick={() => store.updateQuantity(item.product.id, item.quantity - 1)}><Minus size={14} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => store.updateQuantity(item.product.id, item.quantity + 1)}><Plus size={14} /></button>
              </div>
            </div>
          ))}
          {!store.cart.length && <p className="empty-state">Agrega productos para iniciar una venta.</p>}
        </div>
        <div className="totals">
          <span>Subtotal <strong>{formatCurrency(store.subtotal)}</strong></span>
          <span>IVA <strong>{formatCurrency(store.tax)}</strong></span>
          <label className="discount-line">
            Descuento
            <input type="number" min="0" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} />
          </label>
          <span className="grand-total">Total <strong>{formatCurrency(grandTotal)}</strong></span>
        </div>
        <div className="segmented">
          {methods.map((item) => (
            <button key={item} className={method === item ? 'active' : ''} onClick={() => setMethod(item)}>{item}</button>
          ))}
        </div>
        <button className="primary-button" disabled={!store.cart.length} onClick={checkout}>
          Cobrar venta
        </button>
      </aside>
    </section>
  );
}

export default POS;

