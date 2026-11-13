import { useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { PosStore } from '../store';
import type { Promotion } from '../types';

interface PromotionsProps {
  store: PosStore;
}

function Promotions({ store }: PromotionsProps) {
  const [draft, setDraft] = useState<Omit<Promotion, 'id' | 'active'>>({
    title: '',
    description: '',
    value: '',
    endsAt: ''
  });
  const [selectedId, setSelectedId] = useState<string | null>(store.promotions[0]?.id ?? null);
  const selected = store.promotions.find((promo) => promo.id === selectedId);

  function addPromotion() {
    if (!draft.title.trim()) return;
    store.addPromotion(draft);
    setDraft({ title: '', description: '', value: '', endsAt: '' });
  }

  return (
    <div className="stack">
      <section className="panel form-panel">
        <div className="panel-heading">
          <h2>Nueva promocion</h2>
          <button className="secondary-button" onClick={addPromotion}>Agregar</button>
        </div>
        <div className="form-grid">
          <label>Titulo <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
          <label>Valor <input value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} placeholder="15% / $399" /></label>
          <label>Vigencia <input type="date" value={draft.endsAt} onChange={(event) => setDraft({ ...draft, endsAt: event.target.value })} /></label>
          <label className="wide">Descripcion <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Promociones</h2>
          <span className="soft-badge">{store.promotions.filter((promo) => promo.active).length} activas</span>
        </div>
        <div className="promo-grid">
          {store.promotions.map((promo) => (
            <article className="promo-card" key={promo.id}>
              <button className={`status ${promo.active ? '' : 'pending'}`} onClick={() => store.togglePromotion(promo.id)}>
                {promo.active ? 'Activa' : 'Inactiva'}
              </button>
              <strong>{promo.title}</strong>
              <p>{promo.description}</p>
              <footer>
                <b>{promo.value}</b>
                <span>Hasta {promo.endsAt || 'sin fecha'}</span>
              </footer>
              <button className="icon-button" title="Ver detalle" onClick={() => setSelectedId(promo.id)}><Eye size={16} /></button>
              <button className="icon-button danger" title="Eliminar promocion" onClick={() => store.deletePromotion(promo.id)}><Trash2 size={16} /></button>
            </article>
          ))}
        </div>
      </section>

      {selected && (
        <section className="panel detail-panel">
          <div className="panel-heading">
            <h2>Detalle de promocion</h2>
            <span className={`status ${selected.active ? '' : 'pending'}`}>{selected.active ? 'Activa' : 'Inactiva'}</span>
          </div>
          <div className="detail-grid">
            <span><small>Promocion</small><strong>{selected.title}</strong></span>
            <span><small>Valor</small><strong>{selected.value || 'Sin valor'}</strong></span>
            <span><small>Vigencia</small><strong>{selected.endsAt || 'Sin fecha'}</strong></span>
            <span><small>Descripcion</small><strong>{selected.description || 'Sin descripcion'}</strong></span>
          </div>
        </section>
      )}
    </div>
  );
}

export default Promotions;
