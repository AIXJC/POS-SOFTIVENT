import { useState } from 'react';
import { CreditCard, Eye, Trash2 } from 'lucide-react';
import { formatCurrency } from '../store';
import type { PosStore } from '../store';
import type { Customer } from '../types';

interface StudentsProps {
  store: PosStore;
}

function Clients({ store }: StudentsProps) {
  const [draft, setDraft] = useState<Omit<Customer, 'id' | 'status'>>({
    name: '',
    phone: '',
    email: '',
    balance: 0
  });
  const [selectedId, setSelectedId] = useState<string | null>(store.customers[0]?.id ?? null);
  const selected = store.customers.find((customer) => customer.id === selectedId);

  function addCustomer() {
    if (!draft.name.trim()) return;
    store.addCustomer({ ...draft, balance: Number(draft.balance) });
    setDraft({ name: '', phone: '', email: '', balance: 0 });
  }

  return (
    <div className="stack">
      <section className="panel form-panel">
        <div className="panel-heading">
          <h2>Registrar cliente</h2>
          <button className="secondary-button" onClick={addCustomer}>Agregar</button>
        </div>
        <div className="form-grid">
          <label>Nombre <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
          <label>Teléfono <input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /></label>
          <label>Email <input value={draft.email || ''} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
          <label>Saldo inicial <input type="number" min="0" value={draft.balance} onChange={(event) => setDraft({ ...draft, balance: Number(event.target.value) })} /></label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Clientes</h2>
          <span className="soft-badge">{store.customers.length} registrados</span>
        </div>
        <div className="student-grid">
          {store.customers.map((customer) => (
            <article className="student-card" key={customer.id}>
              <div>
                <strong>{customer.name}</strong>
                <select value={customer.status} onChange={(event) => store.updateCustomer(customer.id, { status: event.target.value as 'Pagado' | 'Pendiente' | 'Credito' })}>
                  <option value="Pagado">Pagado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Credito">Crédito</option>
                </select>
              </div>
              <p>{customer.email || 'Sin email'} · {customer.phone}</p>
              <footer>
                <span className={`status ${customer.status === 'Pendiente' ? 'pending' : ''}`}>{customer.status}</span>
                <strong>{formatCurrency(customer.balance)}</strong>
              </footer>
              <div className="row-actions">
                <button className="icon-button" title="Ver detalle" onClick={() => setSelectedId(customer.id)}><Eye size={16} /></button>
                <button className="icon-button" title="Registrar pago total" onClick={() => store.payCustomer(customer.id, customer.balance, 'Efectivo')}><CreditCard size={16} /></button>
                <button className="icon-button danger" title="Eliminar cliente" onClick={() => store.deleteCustomer(customer.id)}><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selected && (
        <section className="panel detail-panel">
          <div className="panel-heading">
            <h2>Ficha del cliente</h2>
            <span className={`status ${selected.status === 'Pendiente' ? 'pending' : ''}`}>{selected.status}</span>
          </div>
          <div className="detail-grid">
            <span><small>Nombre</small><strong>{selected.name}</strong></span>
            <span><small>Teléfono</small><strong>{selected.phone || 'Sin telefono'}</strong></span>
            <span><small>Email</small><strong>{selected.email || 'Sin email'}</strong></span>
            <span><small>Saldo</small><strong>{formatCurrency(selected.balance)}</strong></span>
          </div>
        </section>
      )}
    </div>
  );
}

export default Clients;

