import { Bell, LogOut, Search, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  title: string;
  cartCount: number;
  onLogout: () => void;
  role?: 'superadmin' | 'user';
  userName?: string;
}

function Header({ title, cartCount, onLogout, role = 'superadmin', userName = 'Admin' }: HeaderProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{role === 'user' ? 'Modo cobro' : 'Tienda de Abarrotes'}</p>
        <h1>{title}</h1>
      </div>

      <div className="topbar-actions">
        <label className="searchbox">
          <Search size={18} aria-hidden="true" />
          <input placeholder="Buscar producto o ticket" />
        </label>
        <div className="user-chip" title={role === 'user' ? 'Cajero' : 'Super administrador'}>
          <span className="user-avatar">{userName.charAt(0).toUpperCase()}</span>
          <span className="user-meta">
            <small>{userName}</small>
            <small className="user-role">{role === 'user' ? 'Cajero' : 'Admin'}</small>
          </span>
        </div>
        <button className="icon-button" aria-label="Notificaciones" title="Notificaciones">
          <Bell size={18} />
        </button>
        <button className="cart-pill" aria-label="Carrito" title="Carrito activo">
          <ShoppingCart size={18} />
          <span>{cartCount}</span>
        </button>
        <button className="icon-button danger" aria-label="Cerrar sesion" title="Cerrar sesion" onClick={onLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;
