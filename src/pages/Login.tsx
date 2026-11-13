import { Check, Store } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
  onLogin: (user: { name: string; role: 'superadmin' | 'user' }) => void;
}

const demo = [
  { role: 'superadmin', name: 'Super Admin', email: 'superadmin@example.com', password: 'super123', label: 'Super administrador' },
  { role: 'user', name: 'Cajero', email: 'user@example.com', password: 'user123', label: 'Usuario de punto de venta' }
];

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'superadmin' | 'user'>('superadmin');

  const tryLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cred = demo.find(d => d.role === mode && d.email === email && d.password === password);
    if (!cred) {
      setError('Correo o contraseña incorrectos');
      return;
    }
    onLogin({ name: cred.name, role: mode });
  };

  return (
    <main className="login-screen">
      <section className="login-panel">
        <div className="login-brand">
          <span className="brand-mark large"><Store size={30} /></span>
          <div>
            <p className="eyebrow">Punto de venta</p>
            <h1>Abarrotes</h1>
          </div>
        </div>
        <form className="login-form" onSubmit={tryLogin}>
          <label>
            Rol
            <select value={mode} onChange={(e) => setMode(e.target.value as 'superadmin' | 'user')}>
              <option value="superadmin">Super administrador</option>
              <option value="user">Usuario / Punto de venta</option>
            </select>
          </label>
          <label>
            Correo
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@tienda.com" />
          </label>
          <label>
            Contraseña
            <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
          </label>
          <button className="primary-button" type="submit">Entrar</button>
          {error && <div className="error-message">{error}</div>}
        </form>
        <div className="demo-creds">
          <p><b>Super admin:</b> superadmin@example.com / super123</p>
          <p><b>Usuario:</b> user@example.com / user123</p>
        </div>
      </section>
      <section className="login-summary">
        <div className="summary-inner">
          <h2>Todo tu negocio, claro y rápido</h2>
          <p className="summary-sub">Controla ventas, inventario y caja desde un solo lugar.</p>
          <ul className="summary-list">
            <li><Check size={18} /> Cobra en segundos con escáner de códigos</li>
            <li><Check size={18} /> Inventario y stock siempre al día</li>
            <li><Check size={18} /> Reportes de ventas al instante</li>
          </ul>
          <div className="summary-stats">
            <div><strong>+2,400</strong><span>tickets / mes</span></div>
            <div><strong>99.9%</strong><span>uptime local</span></div>
            <div><strong>0</strong><span>internet requerido</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
