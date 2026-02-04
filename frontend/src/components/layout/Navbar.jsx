import React from 'react';
import { Link } from 'react-router-dom';
import Icons from '../ui/Icons';

const Navbar = () => {
  return (
    <nav className="deposit-navbar">
      <Link to="/" className="deposit-navbar-logo">
        <span className="deposit-navbar-logo-mars">mars</span>
        <span className="deposit-navbar-logo-ai">AI</span>
      </Link>

      <div className="deposit-navbar-links">
        <Link to="/" className="deposit-navbar-link">Sélections</Link>
        <Link to="/" className="deposit-navbar-link">Programme</Link>
        <Link to="/" className="deposit-navbar-link">Jury</Link>
      </div>

      <div className="deposit-navbar-actions">
        <span className="deposit-navbar-lang">en</span>
        <span className="deposit-navbar-icon" aria-hidden><Icons.ChevronDown /></span>
      </div>
    </nav>
  );
};

export default Navbar;
