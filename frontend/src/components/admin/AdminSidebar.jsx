import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { id: 'overview', label: 'Vue d\'ensemble' },
  { id: 'films', label: 'Gestion films' },
  { id: 'jury', label: 'Distribution & Jury' },
  { id: 'results', label: 'Résultats & classement' },
  { id: 'leaderboard', label: 'Leaderboard officiel' },
  { id: 'events', label: 'Évènements' },
  { id: 'messages', label: 'Messages' },
  { id: 'festival-box', label: 'Festival Box' },
  { id: 'settings', label: 'Configuration Festival' },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isProfile = location.pathname === ROUTES.PROFILE;

  const displayName = user?.firstname && user?.lastname
    ? `${user.firstname} ${user.lastname}`
    : user?.email?.split('@')[0] || 'Utilisateur';
  const roleLabel = user?.role === 'Super_admin' ? 'Super Admin' : user?.role === 'Admin' ? 'Admin' : user?.role === 'Selector' ? 'Sélectionneur' : user?.role || '—';
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const handleLogout = () => {
    logout?.();
    navigate(ROUTES.HOME);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link to={ROUTES.HOME} className="deposit-navbar-logo admin-sidebar-logo-wrap" aria-label="Retour à l'accueil">
          <span className="deposit-navbar-logo-mars">mars</span>
          <span className="deposit-navbar-logo-ai">AI</span>
        </Link>
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-user-avatar">{initials}</div>
          <div className="admin-sidebar-user-meta">
            <span className="admin-sidebar-user-name">{displayName}</span>
            <span className="admin-sidebar-user-role">{roleLabel}</span>
          </div>
        </div>
      </div>
      <nav className="admin-sidebar-nav" aria-label="Navigation espace admin">
        <ul className="admin-sidebar-nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <Link
                to={ROUTES.PROFILE}
                className={`admin-sidebar-nav-item ${item.id === 'overview' && isProfile ? 'admin-sidebar-nav-item--active' : ''}`}
              >
                <span className="admin-sidebar-nav-bullet" aria-hidden />
                <span className="admin-sidebar-nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="admin-sidebar-footer">
        <button type="button" className="admin-sidebar-logout" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
