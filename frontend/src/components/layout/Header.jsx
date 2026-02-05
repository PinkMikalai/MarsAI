// Header , en-tête de page avec badge et titre ------------//
import React from 'react';
import Icons from '../ui/common/Icons';

const Header = ({ badge, title }) => {
  return (
    <header className="deposit-header">
      {badge && (
        <div className="deposit-badge">
          <span className="deposit-badge-icon" aria-hidden><Icons.Award /></span>
          {badge}
          <span className="deposit-badge-icon" aria-hidden><Icons.Award /></span>
        </div>
      )}
      {title && <h1 className="deposit-title">{title}</h1>}
    </header>
  );
};

export default Header;
