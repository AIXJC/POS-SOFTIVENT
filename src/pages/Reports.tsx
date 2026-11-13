import { downloadCsv, formatCurrency } from '../store';
import type { Transaction } from '../types';

interface ReportsProps {
  transactions: Transaction[];
}

function Reports({ transactions }: ReportsProps) {
  const total = transactions.reduce((sum, transaction) => sum + transaction.total, 0);
  const average = transactions.length ? total / transactions.length : 0;

  return (
    <div className="stack">
      <section className="metric-grid three">
        <article className="metric-card">
          <span>Ingresos acumulados</span>
          <strong>{formatCurrency(total)}</strong>
        </article>
        <article className="metric-card accent">
          <span>Ticket promedio</span>
          <strong>{formatCurrency(average)}</strong>
        </article>
        <article className="metric-card warm">
          <span>Operaciones</span>
          <strong>{transactions.length}</strong>
        </article>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <h2>Ventas por metodo</h2>
          <button
            className="secondary-button"
            onClick={() => downloadCsv('reporte-ventas.csv', transactions.map((transaction) => ({
              ticket: transaction.id,
              fecha: transaction.date,
              cliente: transaction.customer,
              metodo: transaction.method,
              subtotal: transaction.subtotal,
              iva: transaction.tax,
              descuento: transaction.discount,
              total: transaction.total,
              estado: transaction.status
            })))}
          >
            Descargar reporte
          </button>
        </div>
        {['Efectivo', 'Tarjeta', 'Transferencia', 'Mixto'].map((method) => {
          const amount = transactions.filter((item) => item.method === method).reduce((sum, item) => sum + item.total, 0);
          const width = total ? Math.max(8, (amount / total) * 100) : 8;
          return (
            <div className="bar-row" key={method}>
              <span>{method}</span>
              <div><i style={{ width: `${width}%` }} /></div>
              <strong>{formatCurrency(amount)}</strong>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default Reports;
