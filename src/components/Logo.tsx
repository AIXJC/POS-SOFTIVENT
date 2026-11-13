import React from 'react';
import { Box, ShoppingBasket, Package } from 'lucide-react';
import logoSvg from '../assets/logo.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: '14px' },
    md: { icon: 32, text: '16px' },
    lg: { icon: 48, text: '20px' },
    xl: { icon: 64, text: '28px' }
  };

  const s = sizes[size];
  const style: React.CSSProperties & any = {
    '--logo-icon-size': `${s.icon}px`,
    '--logo-text-size': s.text
  };

  return (
    <div className={`logo ${className}`} style={style}>
      <div className="logo-icon">
        <img src={logoSvg} alt="Tienda de Abarrotes" />
      </div>
      {showText && (
        <div className="logo-text">
          <span className="logo-name">Tienda de Abarrotes</span>
          <span className="logo-sub">Galletas · Lácteos · Carnes · Granos · Hogar</span>
        </div>
      )}
    </div>
  );
}

export default Logo;
