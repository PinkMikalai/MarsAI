import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const canAccessEvents = isAdmin || isSuperAdmin;
  const canAccessSponsors = isAdmin || isSuperAdmin;
  const canAccessJury = isAdmin || isSuperAdmin;
  const canAccessInvitations = isSuperAdmin;
  const canAccessParticipations = isAdmin || isSuperAdmin;
  const isProfile = location.pathname === ROUTES.PROFILE;
  const isEvents = location.pathname === ROUTES.ADMIN_EVENTS;
  const isSponsors = location.pathname === ROUTES.ADMIN_SPONSORS;
  const isJury = location.pathname === ROUTES.ADMIN_JURY;
  const isInvitations = location.pathname === ROUTES.ADMIN_INVITATIONS;
  const isParticipations = location.pathname === ROUTES.ADMIN_PARTICIPATIONS;

  const NAV_ITEMS = [
    { id: 'overview', label: t('admin.navItems.overview'), path: ROUTES.PROFILE },
    { id: 'films', label: t('admin.navItems.films'), path: ROUTES.PROFILE },
    { id: 'participations', label: 'Participations', path: ROUTES.ADMIN_PARTICIPATIONS },
    { id: 'jury', label: t('admin.navItems.jury'), path: ROUTES.ADMIN_JURY },
    { id: 'results', label: t('admin.navItems.results'), path: ROUTES.PROFILE },
    { id: 'leaderboard', label: t('admin.navItems.leaderboard'), path: ROUTES.PROFILE },
    { id: 'events', label: t('admin.navItems.events'), path: ROUTES.ADMIN_EVENTS },
    { id: 'sponsors', label: t('admin.navItems.sponsors'), path: ROUTES.ADMIN_SPONSORS },
    { id: 'cms', label: t('admin.navItems.cms'), path: ROUTES.ADMIN_CMS },
    { id: 'invitations', label: t('admin.navItems.invitations'), path: ROUTES.ADMIN_INVITATIONS },
    { id: 'messages', label: t('admin.navItems.messages'), path: ROUTES.PROFILE },
    { id: 'festival-box', label: t('admin.navItems.festivalBox'), path: ROUTES.PROFILE },
    { id: 'settings', label: t('admin.navItems.settings'), path: ROUTES.PROFILE },
  ];

  const navItems = NAV_ITEMS.filter((item) => {
    if (item.id === 'events' && !canAccessEvents) return false;
    if (item.id === 'sponsors' && !canAccessSponsors) return false;
    if (item.id === 'jury' && !canAccessJury) return false;
    if (item.id === 'invitations' && !canAccessInvitations) return false;
    if (item.id === 'participations' && !canAccessParticipations) return false;
    return true;
  });

  const displayName = user?.firstname && user?.lastname
    ? `${user.firstname} ${user.lastname}`
    : user?.email?.split('@')[0] || 'Utilisateur';
  const roleLabel = user?.role === 'Super_admin' ? 'Super Admin' : user?.role === 'Admin' ? 'Admin' : user?.role === 'Selector' ? t('profile.roleLabel') : user?.role || '—';
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const handleLogout = () => {
    logout?.();
    navigate(ROUTES.HOME);
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <Link to={ROUTES.HOME} className="deposit-navbar-logo admin-sidebar-logo-wrap" aria-label={t('navbar.backHome')}>
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
      <nav className="admin-sidebar-nav" aria-label={t('admin.navAriaLabel')}>
        <ul className="admin-sidebar-nav-list">
          {navItems.map((item) => {
            const isActive = (item.id === 'overview' && isProfile) || (item.id === 'events' && isEvents) || (item.id === 'sponsors' && isSponsors) || (item.id === 'jury' && isJury) || (item.id === 'invitations' && isInvitations) || (item.id === 'participations' && isParticipations);
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`admin-sidebar-nav-item ${isActive ? 'admin-sidebar-nav-item--active' : ''}`}
                >
                  <span className="admin-sidebar-nav-bullet" aria-hidden />
                  <span className="admin-sidebar-nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="admin-sidebar-footer">
        <button type="button" className="admin-sidebar-logout" onClick={handleLogout}>
          {t('admin.logout')}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
