import { AlertTriangle, Banknote, PackageCheck, ReceiptText, Users } from 'lucide-react';
import { formatCurrency } from '../store';
import type { Customer, Product, Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  inventory: Product[];
  customers: Customer[];
}

function Dashboard({ transactions, inventory, customers }: DashboardProps) {
  const todaySales = transactions
    .filter((transaction) => transaction.status === 'Completada')
    .reduce((sum, transaction) => sum + transaction.total, 0);
  const lowStock = inventory.filter((product) => product.stock <= product.minStock && product.minStock > 0);
  const pendingBalance = customers.reduce((sum, customer) => sum + customer.balance, 0);

  return (
    <div className="stack">
      <section className="metric-grid">
        <article className="metric-card">
          <Banknote />
          <span>Ventas registradas</span>
          <strong>{formatCurrency(todaySales)}</strong>
        </article>
        <article className="metric-card accent">
          <ReceiptText />
          <span>Tickets activos</span>
          <strong>{transactions.length}</strong>
        </article>
        <article className="metric-card warm">
          <Users />
          <span>Clientes pendientes</span>
          <strong>{formatCurrency(pendingBalance)}</strong>
        </article>
        <article className="metric-card neutral">
          <PackageCheck />
          <span>Productos bajos</span>
          <strong>{lowStock.length}</strong>
        </article>
      </section>

      <section className="split-grid">
        <article className="panel">
          <div className="panel-heading">
            <h2>Actividad reciente</h2>
            <span className="soft-badge">Hoy</span>
          </div>
          <div className="table">
            {transactions.slice(0, 5).map((transaction) => (
              <div className="table-row" key={transaction.id}>
                <span>{transaction.id}</span>
                <strong>{transaction.customer}</strong>
                <span>{transaction.method}</span>
                <span>{formatCurrency(transaction.total)}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="panel warning-panel">
          <div className="panel-heading">
            <h2>Alertas de inventario</h2>
            <AlertTriangle size={20} />
          </div>
          {lowStock.map((product) => (
            <div className="stock-alert" key={product.id}>
              <span>{product.name}</span>
              <strong>{product.stock} disponibles</strong>
            </div>
          ))}
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
