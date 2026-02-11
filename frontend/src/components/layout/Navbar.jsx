import React from 'react';
import { Link } from 'react-router-dom';
import Icons from '../ui/common/Icons';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const current = i18n.language === 'en' ? 'en' : 'fr';

  const toggleLang = () => {
    i18n.changeLanguage(current === 'fr' ? 'en' : 'fr');
  };

  return (
    <nav className="deposit-navbar">
      <Link to="/" className="deposit-navbar-logo">
        <span className="deposit-navbar-logo-mars">mars</span>
        <span className="deposit-navbar-logo-ai">AI</span>
      </Link>

      <div className="deposit-navbar-links">
        <Link to="/" className="deposit-navbar-link">{t('navbar.selections')}</Link>
        <Link to="/" className="deposit-navbar-link">{t('navbar.programme')}</Link>
        <Link to="/" className="deposit-navbar-link">{t('navbar.jury')}</Link>
      </div>

      <div className="deposit-navbar-actions">
        <button
          type="button"
          className="deposit-navbar-lang"
          onClick={toggleLang}
          aria-label="Changer de langue"
        >
          {current.toUpperCase()}
        </button>
        <span className="deposit-navbar-icon" aria-hidden>
          <Icons.ChevronDown />
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
