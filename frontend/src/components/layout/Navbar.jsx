import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROUTES } from '../../constants/routes';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const currentLang = i18n.resolvedLanguage || i18n.language || 'fr';

  const toggleLang = () => {
    i18n.changeLanguage(currentLang === 'fr' ? 'en' : 'fr');
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  // Ferme le menu quand on change de page
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Ferme le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const initials = user
    ? [user.firstname, user.lastname]
        .filter(Boolean)
        .map((s) => s[0])
        .join('')
        .toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
    : '';

  return (
    <nav className={`deposit-navbar${menuOpen ? ' deposit-navbar--open' : ''}`} ref={menuRef}>
      {/* Logo */}
      <Link to={ROUTES.HOME} className="deposit-navbar-logo" onClick={() => setMenuOpen(false)}>
        <span className="deposit-navbar-logo-mars">mars</span>
        <span className="deposit-navbar-logo-ai">AI</span>
      </Link>

      {/* Liens desktop */}
      <div className="deposit-navbar-links">
        <Link to={ROUTES.GALLERY_FILMS} className="deposit-navbar-link">{t('navbar.selections')}</Link>
        <Link to={ROUTES.JURY} className="deposit-navbar-link">{t('navbar.jury')}</Link>
        <Link to={ROUTES.EVENTS} className="deposit-navbar-link">{t('navbar.events')}</Link>
      </div>

      {/* Actions desktop */}
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

      {/* Burger mobile (droite) */}
      <button
        type="button"
        className="deposit-navbar-burger"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOpen}
      >
        <span className="deposit-navbar-burger-bar" />
        <span className="deposit-navbar-burger-bar" />
        <span className="deposit-navbar-burger-bar" />
      </button>

      {/* Menu déroulant mobile */}
      {menuOpen && (
        <div className="deposit-navbar-mobile-menu">
          <Link to={ROUTES.GALLERY_FILMS} className="deposit-navbar-mobile-link" onClick={() => setMenuOpen(false)}>
            {t('navbar.selections')}
          </Link>
          <Link to={ROUTES.JURY} className="deposit-navbar-mobile-link" onClick={() => setMenuOpen(false)}>
            {t('navbar.jury')}
          </Link>
          <Link to={ROUTES.EVENTS} className="deposit-navbar-mobile-link" onClick={() => setMenuOpen(false)}>
            {t('navbar.events')}
          </Link>

          <div className="deposit-navbar-mobile-divider" />

          <div className="deposit-navbar-mobile-bottom">
            <button
              type="button"
              className="deposit-navbar-lang"
              onClick={() => { toggleLang(); setMenuOpen(false); }}
              aria-label={currentLang === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
              {currentLang === 'fr' ? 'EN' : 'FR'}
            </button>

            {isAuthenticated && (
              <>
                <Link
                  to={ROUTES.PROFILE}
                  className="deposit-navbar-mobile-link deposit-navbar-mobile-link--profile"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('navbar.profile', { defaultValue: 'Mon profil' })}
                </Link>
                <button
                  type="button"
                  className="deposit-navbar-mobile-logout"
                  onClick={handleLogout}
                >
                  {t('navbar.logout', { defaultValue: 'Déconnexion' })}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
