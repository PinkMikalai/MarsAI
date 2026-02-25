import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icons from '../ui/common/Icons';
const Navbar = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || i18n.language || 'fr';

  const toggleLang = () => {
    i18n.changeLanguage(currentLang === 'fr' ? 'en' : 'fr');
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
          aria-label={currentLang === 'fr' ? 'Switch to English' : 'Passer en français'}
        >
          {currentLang === 'fr' ? 'EN' : 'FR'}
        </button>
        <span className="deposit-navbar-icon" aria-hidden>
          <Icons.ChevronDown />
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
