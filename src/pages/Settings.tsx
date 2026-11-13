import { useState } from 'react';
import type { PosStore } from '../store';

interface SettingsProps {
  store: PosStore;
}

function Settings({ store }: SettingsProps) {
  const [draft, setDraft] = useState(store.settings);

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h2>Ajustes del sistema</h2>
        <div className="row-actions">
          <button className="secondary-button" onClick={() => store.resetDemoData()}>Restaurar demo</button>
          <button className="primary-button compact" onClick={() => store.saveSettings(draft)}>Guardar</button>
        </div>
      </div>
      <div className="form-grid">
        <label>
          Sucursal
          <input value={draft.branch} onChange={(event) => setDraft({ ...draft, branch: event.target.value })} />
        </label>
        <label>
          Puerto local
          <input value={draft.localPort} readOnly />
        </label>
        <label>
          Caja inicial
          <input value={draft.openingCash} type="number" onChange={(event) => setDraft({ ...draft, openingCash: Number(event.target.value) })} />
        </label>
        <label>
          Moneda
          <select value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value })}>
            <option>MXN</option>
            <option>USD</option>
          </select>
        </label>
        <label className="wide check-line">
          <input type="checkbox" checked={draft.persistData} onChange={(event) => setDraft({ ...draft, persistData: event.target.checked })} />
          Mantener datos en este navegador
        </label>
      </div>
    </section>
  );
}

export default Settings;
