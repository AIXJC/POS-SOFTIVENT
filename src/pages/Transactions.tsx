import { useState } from 'react';
import { Ban, Download, Eye } from 'lucide-react';
import { downloadCsv, formatCurrency } from '../store';
import type { PosStore } from '../store';

interface TransactionsProps {
  store: PosStore;
}

function Transactions({ store }: TransactionsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(store.transactions[0]?.id ?? null);
  const selected = store.transactions.find((transaction) => transaction.id === selectedId);

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-heading">
          <h2>Transacciones</h2>
          <button
            className="secondary-button icon-label"
            onClick={() => downloadCsv('transacciones.csv', store.transactions.map((transaction) => ({
              ticket: transaction.id,
              fecha: transaction.date,
              cliente: transaction.customer,
              metodo: transaction.method,
              total: transaction.total,
              estado: transaction.status
            })))}
          >
            <Download size={17} /> Exportar CSV
          </button>
        </div>
        <div className="data-table transaction-table">
          <strong>Ticket</strong>
          <strong>Fecha</strong>
          <strong>Cliente</strong>
          <strong>Metodo</strong>
          <strong>Total</strong>
          <strong>Estado</strong>
          <strong>Acciones</strong>
          {store.transactions.map((transaction) => (
            <div className="data-row" key={transaction.id}>
              <span>{transaction.id}</span>
              <span>{transaction.date}</span>
              <span>{transaction.customer}</span>
              <span>{transaction.method}</span>
              <span>{formatCurrency(transaction.total)}</span>
              <span className={`status ${transaction.status !== 'Completada' ? 'pending' : ''}`}>{transaction.status}</span>
              <span className="row-actions">
                <button className="icon-button" title="Ver detalle" onClick={() => setSelectedId(transaction.id)}><Eye size={16} /></button>
                <button className="icon-button danger" disabled={transaction.status !== 'Completada'} title="Cancelar ticket" onClick={() => store.cancelTransaction(transaction.id)}><Ban size={16} /></button>
              </span>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <section className="panel detail-panel">
          <div className="panel-heading">
            <h2>Detalle del ticket {selected.id}</h2>
            <span className={`status ${selected.status !== 'Completada' ? 'pending' : ''}`}>{selected.status}</span>
          </div>
          <div className="detail-grid">
            <span><small>Cliente</small><strong>{selected.customer}</strong></span>
            <span><small>Fecha</small><strong>{selected.date}</strong></span>
            <span><small>Metodo</small><strong>{selected.method}</strong></span>
            <span><small>Subtotal</small><strong>{formatCurrency(selected.subtotal ?? selected.total)}</strong></span>
            <span><small>IVA</small><strong>{formatCurrency(selected.tax ?? 0)}</strong></span>
            <span><small>Descuento</small><strong>{formatCurrency(selected.discount ?? 0)}</strong></span>
            <span><small>Total</small><strong>{formatCurrency(selected.total)}</strong></span>
          </div>
          <div className="line-items">
            {(selected.items ?? []).map((item) => (
              <div key={`${item.productId}-${item.name}`}>
                <span>{item.name}</span>
                <strong>{item.quantity} x {formatCurrency(item.price)}</strong>
              </div>
            ))}
            {!selected.items?.length && <p className="empty-state">Ticket historico sin partidas guardadas.</p>}
          </div>
        </section>
      )}
    </div>
  );
}

export default Transactions;
