import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../service/authService';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { useNavigate } from 'react-router-dom';

const getRoleLabel = (role, t) => {
  const r = (role || '').replace(/-/g, '_');
  if (r === 'Super_admin') return 'Super Admin';
  if (role === 'Admin') return 'Admin';
  if (role === 'Selector') return t ? t('profile.roleSelector') : 'Sélectionneur';
  return role || '—';
};

const AdminProfileContent = ({ profile, loading }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modalEdit, setModalEdit] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordLinkSent, setPasswordLinkSent] = useState(false);
  const [passwordSending, setPasswordSending] = useState(false);

  const closePasswordModal = () => {
    setModalPassword(false);
    setPasswordLinkSent(false);
    setPasswordSending(false);
    setPasswordError('');
  };

  const data = profile || user;
  const displayName = data?.firstname && data?.lastname
    ? `${data.firstname} ${data.lastname}`
    : data?.email?.split('@')[0] || 'Utilisateur';
  const roleLabel = getRoleLabel(data?.role, t);

  return (
    <>
      <section className="admin-overview">
        <div className="admin-overview-header">
          <div>
            <p className="admin-overview-kicker">{t('profile.overview')}</p>
            <h2 className="admin-overview-title">{t('profile.adminProfileTitle')}</h2>
            <p className="admin-overview-text">
              {t('profile.adminProfileText')}
            </p>
          </div>
        </div>

        <div className="admin-profile-card">
          <div className="admin-profile-head">
            <div className="admin-profile-identity">
              <span className="admin-profile-username">{displayName}</span>
              <span className="admin-profile-role-label">{roleLabel}</span>
            </div>
            <div className="admin-profile-actions">
              <button
                type="button"
                className="admin-profile-btn admin-profile-btn--primary"
                onClick={() => setModalEdit(true)}
              >
                {t('profile.editProfile')}
              </button>
              <button
                type="button"
                className="admin-profile-btn admin-profile-btn--secondary"
                onClick={() => navigate(ROUTES.UPDATE_PASSWORD)}
              >
                {t('profile.changePassword')}
              </button>
            </div>
          </div>
          <div className="admin-profile-grid">
            <div className="admin-profile-col">
              <dl className="admin-profile-dl">
                <dt>{t('profile.emailLabel')}</dt>
                <dd>{data?.email || '—'}</dd>
              </dl>
              <dl className="admin-profile-dl">
                <dt>{t('profile.fullName')}</dt>
                <dd>{data?.firstname && data?.lastname ? `${data.firstname} ${data.lastname}` : '—'}</dd>
              </dl>
              <dl className="admin-profile-dl">
                <dt>{t('profile.passwordLabel')}</dt>
                <dd className="admin-profile-password">••••••••••••</dd>
              </dl>
            </div>
            <div className="admin-profile-col">
              <dl className="admin-profile-dl">
                <dt>{t('profile.roleLabel')}</dt>
                <dd>
                  <span className="admin-profile-pill admin-profile-pill--role">{roleLabel}</span>
                </dd>
              </dl>
              <dl className="admin-profile-dl">
                <dt>{t('profile.lastLogin')}</dt>
                <dd>—</dd>
              </dl>
              <dl className="admin-profile-dl">
                <dt>{t('profile.accountStatus')}</dt>
                <dd>
                  <span className="admin-profile-pill admin-profile-pill--active">{t('profile.active')}</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {loading && <p className="admin-profile-loading">{t('profile.loadingData')}</p>}
      </section>

      {modalEdit && (
        <div className="admin-profile-modal-overlay" onClick={() => setModalEdit(false)} role="dialog" aria-modal="true" aria-labelledby="modal-edit-title">
          <div className="admin-profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-edit-title" className="admin-profile-modal-title">{t('profile.editModalTitle')}</h3>
            <p className="admin-profile-modal-text">{t('profile.editModalText')}</p>
            <button type="button" className="admin-profile-btn admin-profile-btn--primary" onClick={() => setModalEdit(false)}>{t('common.close')}</button>
          </div>
        </div>
      )}
      {modalPassword && (
        <div className="admin-profile-modal-overlay" onClick={closePasswordModal} role="dialog" aria-modal="true" aria-labelledby="modal-password-title">
          <div className="admin-profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-password-title" className="admin-profile-modal-title">{t('profile.passwordModalTitle')}</h3>

            {passwordLinkSent ? (
              <>
                <p className="admin-profile-modal-success">
                  {t('profile.passwordLinkSentMsg', { email: data?.email })}
                </p>
                <div className="admin-profile-modal-actions">
                  <button type="button" className="admin-profile-btn admin-profile-btn--primary" onClick={closePasswordModal}>
                    {t('common.close')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="admin-profile-modal-text">
                  {t('profile.passwordModalDesc')}
                </p>
                {data?.email && (
                  <p className="admin-profile-modal-email">
                    {t('profile.passwordModalEmail')} <strong>{data.email}</strong>
                  </p>
                )}
                {passwordError && <p className="admin-profile-modal-error" role="alert">{passwordError}</p>}
                <div className="admin-profile-modal-actions">
                  <button
                    type="button"
                    className="admin-profile-btn admin-profile-btn--primary"
                    disabled={passwordSending || !data?.email}
                    onClick={async () => {
                      setPasswordError('');
                      const emailToUse = data?.email || user?.email;
                      if (!emailToUse) {
                        setPasswordError(t('profile.noEmailLinked'));
                        return;
                      }
                      setPasswordSending(true);
                      try {
                        await authService.forgotPassword(emailToUse);
                        setPasswordLinkSent(true);
                      } catch (err) {
                        setPasswordError(err.message || t('profile.emailError'));
                      } finally {
                        setPasswordSending(false);
                      }
                    }}
                  >
                    {passwordSending ? t('profile.sendingLink') : t('profile.sendPasswordLink')}
                  </button>
                  <button type="button" className="admin-profile-btn admin-profile-btn--secondary" onClick={closePasswordModal}>
                    {t('common.cancel')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Profile = () => {
  const { t } = useTranslation();
  const { user, isAdmin, isSuperAdmin, isSelector } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdminProfile = isAdmin || isSuperAdmin || isSelector;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError(t('profile.notLoggedIn'));
      return;
    }
    setLoading(true);
    authService.profile()
      .then((data) => {
        setProfile(data.result || data);
      })
      .catch((err) => {
        setError(err.message || t('common.error'));
      })
      .finally(() => setLoading(false));
  }, [user, t]);

  if (!user) {
    return (
      <div className="profile-page">
        <main className="profile-container">
          <h1 className="profile-title">{t('profile.title')}</h1>
          <div className="profile-error">
            <p>{error || t('profile.notLoggedIn')}</p>
            <Link to={ROUTES.LOGIN} className="profile-link">{t('profile.goToLogin')}</Link>
          </div>
        </main>
      </div>
    );
  }

  if (isAdminProfile) {
    return (
      <AdminLayout>
        <AdminProfileContent profile={profile} loading={loading} />
      </AdminLayout>
    );
  }

  return (
    <div className="profile-page">
      <main className="profile-container">
        <h1 className="profile-title">{t('profile.title')}</h1>

        {loading && <p className="profile-loading">{t('profile.loading')}</p>}
        {error && (
          <div className="profile-error">
            <p>{error}</p>
            <Link to={ROUTES.LOGIN} className="profile-link">{t('profile.goToLogin')}</Link>
          </div>
        )}

        {!loading && !error && profile && (
          <div className="profile-card">
            <p><strong>{t('profile.firstnameLabel')}</strong> {profile.firstname || '—'}</p>
            <p><strong>{t('profile.lastnameLabel')}</strong> {profile.lastname || '—'}</p>
            <p><strong>{t('profile.emailLabel2')}</strong> {profile.email || '—'}</p>
            <p><strong>{t('profile.roleLabel2')}</strong> {profile.role || profile.role_name || '—'}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
