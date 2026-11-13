import { useState } from 'react';
import Layout from './components/layout/Layout';
import CashRegister from './pages/CashRegister';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Groups';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import MonthlyPayments from './pages/MonthlyPayments';
import POS from './pages/POS';
import Promotions from './pages/Promotions';
import Reports from './pages/Reports';
import Returns from './pages/Returns';
import Settings from './pages/Settings';
import Clients from './pages/Students';
import Scanco from './pages/Scanco';
import Transactions from './pages/Transactions';
import { usePosStore } from './store';
import type { PageId } from './types';

const titles: Record<PageId, string> = {
  dashboard: 'Panel de control',
  pos: 'Punto de venta',
  scan: 'Cobro por escáner',
  cash: 'Caja',
  inventory: 'Inventario',
  clients: 'Clientes',
  categories: 'Categorías',
  payments: 'Pagos',
  transactions: 'Tickets',
  returns: 'Devoluciones',
  promotions: 'Promos',
  reports: 'Reportes',
  settings: 'Configuracion'
};

function App() {
  const [session, setSession] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'superadmin' | 'user' } | null>(null);
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const store = usePosStore();
  const role = currentUser?.role ?? 'superadmin';

  function handleLogin(user: { name: string; role: 'superadmin' | 'user' }) {
    setSession(true);
    setCurrentUser(user);
    setActivePage(user.role === 'user' ? 'scan' : 'dashboard');
  }

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  const isAdmin = role === 'superadmin';

  return (
    <Layout
      activePage={activePage}
      title={titles[activePage]}
      cartCount={store.cart.reduce((total, item) => total + item.quantity, 0)}
      onNavigate={setActivePage}
      onLogout={() => { setSession(false); setCurrentUser(null); }}
      role={role}
      userName={currentUser?.name ?? 'Admin'}
    >
      {isAdmin ? (
        <>
          {activePage === 'dashboard' && (
            <Dashboard transactions={store.transactions} inventory={store.inventory} customers={store.customers} />
          )}
          {activePage === 'pos' && <POS store={store} />}
          {activePage === 'scan' && <Scanco store={store} />}
          {activePage === 'cash' && <CashRegister store={store} />}
          {activePage === 'inventory' && <Inventory store={store} />}
          {activePage === 'clients' && <Clients store={store} />}
          {activePage === 'categories' && <Categories store={store} />}
          {activePage === 'payments' && <MonthlyPayments store={store} />}
          {activePage === 'transactions' && <Transactions store={store} />}
          {activePage === 'returns' && <Returns store={store} />}
          {activePage === 'promotions' && <Promotions store={store} />}
          {activePage === 'reports' && <Reports transactions={store.transactions} />}
          {activePage === 'settings' && <Settings store={store} />}
        </>
      ) : (
        <>
          {(activePage === 'dashboard') && (
            <Dashboard transactions={store.transactions} inventory={store.inventory} customers={store.customers} />
          )}
          {(activePage === 'scan' || activePage === 'pos') && <Scanco store={store} />}
          {(activePage === 'inventory') && <Inventory store={store} readOnly />}
          {activePage === 'transactions' && <Transactions store={store} />}
          {(activePage === 'cash' || activePage === 'clients' || activePage === 'categories' || activePage === 'payments' || activePage === 'returns' || activePage === 'promotions' || activePage === 'reports' || activePage === 'settings') && <Scanco store={store} />}
        </>
      )}
    </Layout>
  );
}

export default App;
