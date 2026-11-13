import { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { formatCurrency } from '../store';
import type { PosStore } from '../store';
import type { Category } from '../types';

interface CategoriesProps {
  store: PosStore;
}

function Categories({ store }: CategoriesProps) {
  const [draft, setDraft] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    icon: 'box',
    sortOrder: 0
  });
  const [selectedId, setSelectedId] = useState<string | null>(store.categories[0]?.id ?? null);
  const selected = store.categories.find((category) => category.id === selectedId);

  function addCategory() {
    if (!draft.name.trim()) return;
    store.addCategory({ ...draft, sortOrder: 0 });
    setDraft({ name: '', description: '', icon: 'box', sortOrder: 0 });
  }

  return (
    <div className="stack">
      <section className="panel form-panel">
        <div className="panel-heading">
          <h2>Nueva categoría</h2>
          <button className="secondary-button" onClick={addCategory}>Agregar</button>
        </div>
        <div className="form-grid">
          <label>Nombre <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
          <label>Descripción <textarea value={draft.description || ''} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
          <label>Icono <input value={draft.icon} onChange={(event) => setDraft({ ...draft, icon: event.target.value })} placeholder="icono" /></label>
          <label>Orden <input type="number" min="0" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} /></label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Categorías de productos</h2>
          <span className="soft-badge">{store.categories.length} categorías</span>
        </div>
        <div className="category-list">
          {store.categories.map((category) => (
            <article className="category-row action-row" key={category.id}>
              <div>
                <strong>{category.name}</strong>
                <span>{category.description || 'Sin descripción'}</span>
              </div>
              <span>{category.icon || 'Sin icono'}</span>
              <span>Orden {category.sortOrder}</span>
              <span className="row-actions">
                <button className="icon-button" title="Ver detalle" onClick={() => setSelectedId(category.id)}><Eye size={16} /></button>
                <button className="icon-button danger" title="Eliminar categoría" onClick={() => store.deleteCategory(category.id)}><Trash2 size={16} /></button>
              </span>
            </article>
          ))}
          {!store.categories.length && <p className="empty-state">Agrega una categoría para organizar tu inventario.</p>}
        </div>
      </section>

      {selected && (
        <section className="panel detail-panel">
          <div className="panel-heading">
            <h2>Detalle de categoría</h2>
            <span className="soft-badge">Sin productos</span>
          </div>
          <div className="detail-grid">
            <span><small>Nombre</small><strong>{selected.name}</strong></span>
            <span><small>Descripción</small><strong>{selected.description || 'Sin descripción'}</strong></span>
            <span><small>Icono</small><strong>{selected.icon || 'Sin icono'}</strong></span>
            <span><small>Orden</small><strong>{selected.sortOrder}</strong></span>
          </div>
        </section>
      )}
    </div>
  );
}

export default Categories;
