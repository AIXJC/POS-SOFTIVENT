import { useState, type PropsWithChildren } from 'react';
import Header from './Header';
import Sidebar from './Siderbar';
import type { PageId, UserRole } from '../../types';

interface LayoutProps extends PropsWithChildren {
  activePage: PageId;
  title: string;
  cartCount: number;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
  role?: UserRole;
  userName?: string;
}

function Layout({ activePage, title, cartCount, children, onNavigate, onLogout, role = 'superadmin', userName = 'Admin' }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={collapsed ? 'app-shell sidebar-collapsed' : 'app-shell'}>
      <Sidebar activePage={activePage} collapsed={collapsed} onNavigate={onNavigate} onToggle={() => setCollapsed((value) => !value)} role={role} userName={userName} />
      <div className="workspace">
        <Header title={title} cartCount={cartCount} onLogout={onLogout} role={role} userName={userName} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
