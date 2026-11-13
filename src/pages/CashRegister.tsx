import { useMemo, useState } from 'react';
import { formatCurrency } from '../store';
import type { PosStore } from '../store';

interface CashRegisterProps {
  store: PosStore;
}

const denominations = ['$1000', '$500', '$200', '$100', '$50', '$20', 'Monedas'];

function CashRegister({ store }: CashRegisterProps) {
  const [counts, setCounts] = useState<Record<string, number>>(Object.fromEntries(denominations.map((label) => [label, 0])));
  const completed = store.transactions.filter((transaction) => transaction.status === 'Completada');
  const cash = completed.filter((transaction) => transaction.method === 'Efectivo').reduce((sum, transaction) => sum + transaction.total, 0);
  const card = completed.filter((transaction) => transaction.method === 'Tarjeta').reduce((sum, transaction) => sum + transaction.total, 0);
  const transfer = completed.filter((transaction) => transaction.method === 'Transferencia').reduce((sum, transaction) => sum + transaction.total, 0);
  const counted = useMemo(() => Object.entries(counts).reduce((sum, [label, quantity]) => {
    const value = label === 'Monedas' ? 1 : Number(label.replace('$', ''));
    return sum + value * Number(quantity);
  }, 0), [counts]);
  const expected = store.settings.openingCash + cash;

  return (
    <div className="stack">
      <section className="metric-grid three">
        <article className="metric-card">
          <span>Efectivo</span>
          <strong>{formatCurrency(cash)}</strong>
        </article>
        <article className="metric-card accent">
          <span>Tarjeta</span>
          <strong>{formatCurrency(card)}</strong>
        </article>
        <article className="metric-card warm">
          <span>Transferencias</span>
          <strong>{formatCurrency(transfer)}</strong>
        </article>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <h2>Corte de caja</h2>
          <button className="primary-button compact" onClick={() => store.closeCash(counts)}>Cerrar turno</button>
        </div>
        <div className="cash-count">
          {denominations.map((label) => (
            <label key={label}>
              {label}
              <input type="number" min="0" value={counts[label]} onChange={(event) => setCounts({ ...counts, [label]: Number(event.target.value) })} />
            </label>
          ))}
        </div>
        <div className="totals cash-summary">
          <span>Fondo inicial <strong>{formatCurrency(store.settings.openingCash)}</strong></span>
          <span>Efectivo esperado <strong>{formatCurrency(expected)}</strong></span>
          <span>Conteo fisico <strong>{formatCurrency(counted)}</strong></span>
          <span className="grand-total">Diferencia <strong>{formatCurrency(counted - expected)}</strong></span>
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <h2>Cortes guardados</h2>
          <span className="soft-badge">{store.cashClosures.length}</span>
        </div>
        <div className="table">
          {store.cashClosures.map((closure) => (
            <div className="table-row" key={closure.id}>
              <span>{closure.date}</span>
              <strong>{formatCurrency(closure.expected)}</strong>
              <span>{formatCurrency(closure.counted)}</span>
              <span className={closure.difference < 0 ? 'danger-text' : ''}>{formatCurrency(closure.difference)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CashRegister;
