import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { formatCurrency } from '../store';
import type { PosStore } from '../store';
import type { PaymentMethod, Customer } from '../types';

interface MonthlyPaymentsProps {
  store: PosStore;
}

const methods: PaymentMethod[] = ['Efectivo', 'Tarjeta', 'Transferencia', 'Mixto'];

function MonthlyPayments({ store }: MonthlyPaymentsProps) {
  const pending = store.customers.filter((customer) => customer.balance > 0);
  const [method, setMethod] = useState<PaymentMethod>('Efectivo');

  function handlePay(customerId: string, amount: number) {
    store.payCustomer(customerId, amount, method);
  }

  return (
    <section className="split-grid">
      <article className="panel">
        <div className="panel-heading">
          <h2>Pagos pendientes</h2>
          <CreditCard size={20} />
        </div>
        <div className="segmented compact-segmented">
          {methods.map((item) => (
            <button key={item} className={method === item ? 'active' : ''} onClick={() => setMethod(item)}>{item}</button>
          ))}
        </div>
        <div className="table payments-table">
          {pending.map((customer) => (
            <div className="table-row payment-row" key={customer.id}>
              <span>{customer.name}</span>
              <span>{customer.email || 'Sin email'} · {customer.phone}</span>
              <span>{formatCurrency(customer.balance)}</span>
              <button className="secondary-button compact" onClick={() => handlePay(customer.id, customer.balance)}>Pagar</button>
            </div>
          ))}
          {!pending.length && <p className="empty-state">No hay pagos pendientes.</p>}
        </div>
      </article>
      <article className="panel highlight-panel">
        <h2>Resumen de deudas</h2>
        <p className="big-number">{formatCurrency(pending.reduce((sum, customer) => sum + customer.balance, 0))}</p>
        <span className="muted">Total de saldos pendientes de clientes activos.</span>
      </article>
    </section>
  );
}

export default MonthlyPayments;
