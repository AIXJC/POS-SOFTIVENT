import { useState } from 'react';
import { Eye, Plus, Save, Trash2 } from 'lucide-react';
import { formatCurrency } from '../store';
import type { PosStore } from '../store';
import type { Product } from '../types';

interface InventoryProps {
  store: PosStore;
  readOnly?: boolean;
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  sku: '',
  category: 'Accesorios',
  price: 0,
  stock: 0,
  minStock: 0,
  taxRate: 0.16
};

function Inventory({ store, readOnly = false }: InventoryProps) {
  const [draft, setDraft] = useState(emptyProduct);
  const [editing, setEditing] = useState<Record<string, Product>>({});
  const [selectedId, setSelectedId] = useState<string | null>(store.inventory[0]?.id ?? null);
  const selected = store.inventory.find((product) => product.id === selectedId);

  function addProduct() {
    if (!draft.name.trim() || !draft.sku.trim()) return;
    store.addProduct({
      ...draft,
      price: Number(draft.price),
      stock: Number(draft.stock),
      minStock: Number(draft.minStock),
      taxRate: Number(draft.taxRate)
    });
    setDraft(emptyProduct);
  }

  return (
    <div className="stack">
      {!readOnly && (
      <section className="panel form-panel">
        <div className="panel-heading">
          <h2>Nuevo producto</h2>
          <button className="secondary-button icon-label" onClick={addProduct}><Plus size={17} /> Agregar</button>
        </div>
        <div className="form-grid">
          <label>Producto <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
          <label>SKU <input value={draft.sku} onChange={(event) => setDraft({ ...draft, sku: event.target.value })} /></label>
          <label>Categoria <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></label>
          <label>Precio <input type="number" min="0" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} /></label>
          <label>Stock <input type="number" min="0" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} /></label>
          <label>Minimo <input type="number" min="0" value={draft.minStock} onChange={(event) => setDraft({ ...draft, minStock: Number(event.target.value) })} /></label>
        </div>
      </section>
      )}

      <section className="panel">
        <div className="panel-heading">
          <h2>Inventario</h2>
          <span className="soft-badge">{store.inventory.length} articulos</span>
        </div>
        <div className="data-table inventory-table editable-table">
          <strong>Producto</strong>
          <strong>SKU</strong>
          <strong>Categoria</strong>
          <strong>Stock</strong>
          <strong>Precio</strong>
          {!readOnly && <strong>Acciones</strong>}
          {store.inventory.map((product) => {
            const row = editing[product.id] ?? product;
            return (
              <div className="data-row" key={product.id}>
                <span><input disabled={readOnly} value={row.name} onChange={(event) => setEditing((current) => ({ ...current, [product.id]: { ...row, name: event.target.value } }))} /></span>
                <span><input disabled={readOnly} value={row.sku} onChange={(event) => setEditing((current) => ({ ...current, [product.id]: { ...row, sku: event.target.value } }))} /></span>
                <span><input disabled={readOnly} value={row.category} onChange={(event) => setEditing((current) => ({ ...current, [product.id]: { ...row, category: event.target.value } }))} /></span>
                <span><input disabled={readOnly} className={row.stock <= row.minStock && row.minStock > 0 ? 'danger-text' : ''} type="number" min="0" value={row.stock} onChange={(event) => setEditing((current) => ({ ...current, [product.id]: { ...row, stock: Number(event.target.value) } }))} /></span>
                <span><input disabled={readOnly} type="number" min="0" value={row.price} onChange={(event) => setEditing((current) => ({ ...current, [product.id]: { ...row, price: Number(event.target.value) } }))} title={formatCurrency(row.price)} /></span>
                {!readOnly && (
                <span className="row-actions">
                  <button className="icon-button" title="Ver detalle" onClick={() => setSelectedId(product.id)}><Eye size={16} /></button>
                  <button className="icon-button" title="Guardar" onClick={() => { store.updateProduct(product.id, row); setEditing((current) => { const next = { ...current }; delete next[product.id]; return next; }); }}><Save size={16} /></button>
                  <button className="icon-button danger" title="Eliminar" onClick={() => store.deleteProduct(product.id)}><Trash2 size={16} /></button>
                </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {selected && (
        <section className="panel detail-panel">
          <div className="panel-heading">
            <h2>Detalle de producto</h2>
            <span className={selected.stock <= selected.minStock && selected.minStock > 0 ? 'status pending' : 'status'}>{selected.stock <= selected.minStock && selected.minStock > 0 ? 'Stock bajo' : 'Disponible'}</span>
          </div>
          <div className="detail-grid">
            <span><small>Producto</small><strong>{selected.name}</strong></span>
            <span><small>SKU</small><strong>{selected.sku}</strong></span>
            <span><small>Categoria</small><strong>{selected.category}</strong></span>
            <span><small>Precio</small><strong>{formatCurrency(selected.price)}</strong></span>
            <span><small>Existencia</small><strong>{selected.stock}</strong></span>
            <span><small>Minimo</small><strong>{selected.minStock}</strong></span>
            <span><small>IVA</small><strong>{Math.round(selected.taxRate * 100)}%</strong></span>
          </div>
        </section>
      )}
    </div>
  );
}

export default Inventory;
