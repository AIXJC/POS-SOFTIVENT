import {
  BadgePercent,
  BarChart3,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  RotateCcw,
  ScanBarcode,
  Settings,
  ShoppingBag,
  Users,
  WalletCards
} from 'lucide-react';
import type { NavItem, PageId, UserRole } from '../../types';

interface NavGroup {
  section: string;
  items: NavItem[];
}

const adminGroups: NavGroup[] = [
  {
    section: 'Operación',
    items: [
      { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
      { id: 'pos', label: 'Venta', icon: ShoppingBag },
      { id: 'scan', label: 'Escáner', icon: ScanBarcode },
      { id: 'cash', label: 'Caja', icon: WalletCards }
    ]
  },
  {
    section: 'Catálogo',
    items: [
      { id: 'inventory', label: 'Inventario', icon: Package },
      { id: 'categories', label: 'Categorías', icon: ClipboardList }
    ]
  },
  {
    section: 'Clientes',
    items: [
      { id: 'clients', label: 'Clientes', icon: Users },
      { id: 'payments', label: 'Pagos', icon: CreditCard }
    ]
  },
  {
    section: 'Análisis',
    items: [
      { id: 'transactions', label: 'Tickets', icon: ReceiptText },
      { id: 'returns', label: 'Devoluciones', icon: RotateCcw },
      { id: 'promotions', label: 'Promos', icon: BadgePercent },
      { id: 'reports', label: 'Reportes', icon: BarChart3 }
    ]
  },
  {
    section: 'Sistema',
    items: [{ id: 'settings', label: 'Ajustes', icon: Settings }]
  }
];

const userGroups: NavGroup[] = [
  {
    section: 'Cobro',
    items: [{ id: 'scan', label: 'Cobrar', icon: ScanBarcode }]
  },
  {
    section: 'Consulta',
    items: [
      { id: 'inventory', label: 'Productos', icon: Package },
      { id: 'transactions', label: 'Tickets', icon: ReceiptText }
    ]
  }
];

interface SidebarProps {
  activePage: PageId;
  collapsed: boolean;
  onNavigate: (page: PageId) => void;
  onToggle: () => void;
  role?: UserRole;
  userName?: string;
}

function Sidebar({ activePage, collapsed, onNavigate, onToggle, role = 'superadmin', userName = 'Admin' }: SidebarProps) {
  const ToggleIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  const groups = role === 'user' ? userGroups : adminGroups;

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <button className="brand" onClick={() => onNavigate('dashboard')} title="Inicio">
          <span className="brand-mark">TA</span>
          <span>
            <strong>Abarrotes</strong>
            <small>Tienda local</small>
          </span>
        </button>
        <button
          className="sidebar-toggle"
          onClick={onToggle}
          title={collapsed ? 'Expandir menu' : 'Contraer menu'}
          aria-label={collapsed ? 'Expandir menu' : 'Contraer menu'}
        >
          <ToggleIcon size={18} />
        </button>
      </div>

      <nav aria-label="Menu principal">
        {groups.map((group) => (
          <div className="nav-group" key={group.section}>
            {!collapsed && <p className="nav-section">{group.section}</p>}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={activePage === item.id ? 'nav-item active' : 'nav-item'}
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-user-avatar">{userName.charAt(0).toUpperCase()}</span>
        <span className="sidebar-user-meta">
          <small>{userName}</small>
          <small className="user-role">{role === 'user' ? 'Cajero' : 'Admin'}</small>
        </span>
      </div>
    </aside>
  );
}

export default Sidebar;
