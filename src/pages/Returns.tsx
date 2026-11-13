import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { formatCurrency } from '../store';
import type { PosStore } from '../store';

interface ReturnsProps {
  store: PosStore;
}

function Returns({ store }: ReturnsProps) {
  const refundable = useMemo(() => store.transactions.filter((transaction) => transaction.status === 'Completada'), [store.transactions]);
  const [ticketId, setTicketId] = useState(refundable[0]?.id ?? '');
  const [reason, setReason] = useState('Cambio de talla');
  const [notes, setNotes] = useState('');
  const selectedTicket = store.transactions.find((transaction) => transaction.id === ticketId);

  function registerReturn() {
    if (!ticketId) return;
    const ok = store.registerReturn(ticketId, reason, notes);
    if (ok) {
      setNotes('');
      setTicketId('');
    }
  }

  return (
    <div className="stack">
      <section className="panel form-panel">
        <div className="panel-heading">
          <h2>Devoluciones</h2>
          <RotateCcw size={20} />
        </div>
        <div className="form-grid">
          <label>
            Ticket
            <select value={ticketId} onChange={(event) => setTicketId(event.target.value)}>
              <option value="">Seleccionar ticket</option>
              {refundable.map((transaction) => (
                <option key={transaction.id} value={transaction.id}>{transaction.id} - {transaction.customer} - {formatCurrency(transaction.total)}</option>
              ))}
            </select>
          </label>
          <label>
            Motivo
            <select value={reason} onChange={(event) => setReason(event.target.value)}>
              <option>Cambio de talla</option>
              <option>Producto defectuoso</option>
              <option>Cancelacion de servicio</option>
            </select>
          </label>
          <label className="wide">
            Observaciones
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Detalle de la solicitud" />
          </label>
        </div>
        <button className="primary-button compact" disabled={!ticketId} onClick={registerReturn}>Registrar devolucion</button>
      </section>

      {selectedTicket && (
        <section className="panel detail-panel">
          <div className="panel-heading">
            <h2>Detalle del ticket a devolver</h2>
            <span className="status">{selectedTicket.status}</span>
          </div>
          <div className="detail-grid">
            <span><small>Ticket</small><strong>{selectedTicket.id}</strong></span>
            <span><small>Cliente</small><strong>{selectedTicket.customer}</strong></span>
            <span><small>Metodo</small><strong>{selectedTicket.method}</strong></span>
            <span><small>Total</small><strong>{formatCurrency(selectedTicket.total)}</strong></span>
          </div>
          <div className="line-items">
            {(selectedTicket.items ?? []).map((item) => (
              <div key={`${item.productId}-${item.name}`}>
                <span>{item.name}</span>
                <strong>{item.quantity} x {formatCurrency(item.price)}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panel">
        <div className="panel-heading">
          <h2>Historial de devoluciones</h2>
          <span className="soft-badge">{store.returnRecords.length}</span>
        </div>
        <div className="table">
          {store.returnRecords.map((record) => (
            <div className="table-row" key={record.id}>
              <span>{record.ticketId}</span>
              <strong>{record.reason}</strong>
              <span>{record.date}</span>
              <span>{formatCurrency(record.amount)}</span>
              <small>{record.notes || 'Sin observaciones'}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Returns;
