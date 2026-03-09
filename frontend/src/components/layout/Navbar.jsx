import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../constants/routes';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const currentLang = i18n.resolvedLanguage || i18n.language || 'fr';

  const toggleLang = () => {
    i18n.changeLanguage(currentLang === 'fr' ? 'en' : 'fr');
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  // initiales pour l'avatar (prénom + nom, ou email)
  const initials = user
    ? [user.firstname, user.lastname]
        .filter(Boolean)
        .map((s) => s[0])
        .join('')
        .toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
    : '';

  return (
    <nav className="deposit-navbar">
      <Link to={ROUTES.HOME} className="deposit-navbar-logo">
        <span className="deposit-navbar-logo-mars">mars</span>
        <span className="deposit-navbar-logo-ai">AI</span>
      </Link>

      <div className="deposit-navbar-links">
        <Link to={ROUTES.GALLERY_FILMS} className="deposit-navbar-link">{t('navbar.selections')}</Link>
        <Link to={ROUTES.JURY} className="deposit-navbar-link">{t('navbar.jury')}</Link>
        <Link to={ROUTES.EVENTS} className="deposit-navbar-link">{t('navbar.events')}</Link>
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

        {isAuthenticated && (
          <div className="deposit-navbar-user">
            <Link to={ROUTES.PROFILE} className="deposit-navbar-avatar" title={`${user?.firstname || ''} ${user?.lastname || ''}`.trim()}>
              {initials}
            </Link>
            <button
              type="button"
              className="deposit-navbar-logout"
              onClick={handleLogout}
              aria-label="Se déconnecter"
            >
              {t('navbar.logout', { defaultValue: 'Déconnexion' })}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
