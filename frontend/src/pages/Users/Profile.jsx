import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../service/authService';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

const getRoleLabel = (role) => {
  const r = (role || '').replace(/-/g, '_');
  if (r === 'Super_admin') return 'Super Admin';
  if (role === 'Admin') return 'Admin';
  if (role === 'Selector') return 'Sélectionneur';
  return role || '—';
};

const AdminProfileContent = ({ profile, loading }) => {
  const { user } = useAuth();
  const [modalEdit, setModalEdit] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const closePasswordModal = () => {
    setModalPassword(false);
    setPasswordSuccess(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
  };

  const data = profile || user;
  const displayName = data?.firstname && data?.lastname
    ? `${data.firstname} ${data.lastname}`
    : data?.email?.split('@')[0] || 'Utilisateur';
  const roleLabel = getRoleLabel(data?.role);

  return (
    <>
      <section className="admin-overview">
        <div className="admin-overview-header">
          <div>
            <p className="admin-overview-kicker">Vue d&apos;ensemble</p>
            <h2 className="admin-overview-title">Profil administrateur</h2>
            <p className="admin-overview-text">
              Consultez et modifiez les informations de votre compte.
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
                Modifier le profil
              </button>
              <button
                type="button"
                className="admin-profile-btn admin-profile-btn--secondary"
                onClick={() => setModalPassword(true)}
              >
                Changer le mot de passe
              </button>
            </div>
          </div>
          <div className="admin-profile-grid">
            <div className="admin-profile-col">
              <dl className="admin-profile-dl">
                <dt>Adresse email</dt>
                <dd>{data?.email || '—'}</dd>
              </dl>
              <dl className="admin-profile-dl">
                <dt>Nom complet</dt>
                <dd>{data?.firstname && data?.lastname ? `${data.firstname} ${data.lastname}` : '—'}</dd>
              </dl>
              <dl className="admin-profile-dl">
                <dt>Mot de passe</dt>
                <dd className="admin-profile-password">••••••••••••</dd>
              </dl>
            </div>
            <div className="admin-profile-col">
              <dl className="admin-profile-dl">
                <dt>Rôle</dt>
                <dd>
                  <span className="admin-profile-pill admin-profile-pill--role">{roleLabel}</span>
                </dd>
              </dl>
              <dl className="admin-profile-dl">
                <dt>Dernière connexion</dt>
                <dd>—</dd>
              </dl>
              <dl className="admin-profile-dl">
                <dt>Statut du compte</dt>
                <dd>
                  <span className="admin-profile-pill admin-profile-pill--active">Actif</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {loading && <p className="admin-profile-loading">Chargement des données…</p>}
      </section>

      {modalEdit && (
        <div className="admin-profile-modal-overlay" onClick={() => setModalEdit(false)} role="dialog" aria-modal="true" aria-labelledby="modal-edit-title">
          <div className="admin-profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-edit-title" className="admin-profile-modal-title">Modifier le profil</h3>
            <p className="admin-profile-modal-text">Cette fonctionnalité sera disponible prochainement. Vous pourrez alors modifier votre prénom, nom et email.</p>
            <button type="button" className="admin-profile-btn admin-profile-btn--primary" onClick={() => setModalEdit(false)}>Fermer</button>
          </div>
        </div>
      )}
      {modalPassword && (
        <div className="admin-profile-modal-overlay" onClick={closePasswordModal} role="dialog" aria-modal="true" aria-labelledby="modal-password-title">
          <div className="admin-profile-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="modal-password-title" className="admin-profile-modal-title">Changer le mot de passe</h3>
            <p className="admin-profile-modal-text">
              Saisissez votre mot de passe actuel puis le nouveau (min. 6 caractères, au moins un chiffre).
            </p>

            {passwordSuccess ? (
              <>
                <p className="admin-profile-modal-success">Votre mot de passe a été mis à jour.</p>
                <div className="admin-profile-modal-actions">
                  <button type="button" className="admin-profile-btn admin-profile-btn--primary" onClick={closePasswordModal}>
                    Fermer
                  </button>
                </div>
              </>
            ) : (
              <form
                className="admin-profile-modal-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setPasswordError('');
                  if (!oldPassword || !newPassword || !confirmNewPassword) {
                    setPasswordError('Veuillez remplir tous les champs.');
                    return;
                  }
                  if (newPassword !== confirmNewPassword) {
                    setPasswordError('Les deux nouveaux mots de passe ne correspondent pas.');
                    return;
                  }
                  if (newPassword.length < 6) {
                    setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
                    return;
                  }
                  setPasswordSubmitting(true);
                  try {
                    await authService.updatePassword({ oldPassword, newPassword, confirmNewPassword });
                    setPasswordSuccess(true);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                  } catch (err) {
                    setPasswordError(err.message || 'Erreur lors de la mise à jour du mot de passe.');
                  } finally {
                    setPasswordSubmitting(false);
                  }
                }}
              >
                {passwordError && <p className="admin-profile-modal-error" role="alert">{passwordError}</p>}
                <div className="admin-profile-modal-field">
                  <label htmlFor="profile-old-password" className="admin-profile-modal-label">Mot de passe actuel</label>
                  <input
                    id="profile-old-password"
                    type="password"
                    autoComplete="current-password"
                    className="admin-profile-modal-input"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={passwordSubmitting}
                    placeholder="••••••••"
                  />
                </div>
                <div className="admin-profile-modal-field">
                  <label htmlFor="profile-new-password" className="admin-profile-modal-label">Nouveau mot de passe</label>
                  <input
                    id="profile-new-password"
                    type="password"
                    autoComplete="new-password"
                    className="admin-profile-modal-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={passwordSubmitting}
                    placeholder="••••••••"
                  />
                </div>
                <div className="admin-profile-modal-field">
                  <label htmlFor="profile-confirm-password" className="admin-profile-modal-label">Confirmer le nouveau mot de passe</label>
                  <input
                    id="profile-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    className="admin-profile-modal-input"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={passwordSubmitting}
                    placeholder="••••••••"
                  />
                </div>
                <div className="admin-profile-modal-actions">
                  <button type="submit" className="admin-profile-btn admin-profile-btn--primary" disabled={passwordSubmitting}>
                    {passwordSubmitting ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                  <button type="button" className="admin-profile-btn admin-profile-btn--secondary" onClick={closePasswordModal}>
                    Annuler
                  </button>
                </div>
              </form>
            )}

            {!passwordSuccess && (
              <Link to={ROUTES.FORGOT_PASSWORD} className="admin-profile-forgot-link" onClick={closePasswordModal}>
                Mot de passe oublié ? Envoyer un lien de réinitialisation
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const Profile = () => {
  const { user, isAdmin, isSuperAdmin, isSelector } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdminProfile = isAdmin || isSuperAdmin || isSelector;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError('Login is necessary to access your profile');
      return;
    }
    setLoading(true);
    authService.profile()
      .then((data) => {
        setProfile(data.result || data);
      })
      .catch((err) => {
        setError(err.message || 'Error during profile loading.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  /* Non connecté : message + lien login */
  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-container">
          <h1 className="profile-title">Mon profil</h1>
          <div className="profile-error">
            <p>{error || 'Connexion nécessaire pour accéder à votre profil.'}</p>
            <Link to={ROUTES.LOGIN} className="profile-link">Aller au login</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* Admin / Super Admin / Sélectionneur : même design pour les trois rôles */
  if (isAdminProfile) {
    return (
      <AdminLayout>
        <AdminProfileContent profile={profile} loading={loading} />
      </AdminLayout>
    );
  }

  /* Utilisateur simple : fiche profil */
  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <h1 className="profile-title">Mon profil</h1>

        {loading && <p className="profile-loading">Chargement...</p>}
        {error && (
          <div className="profile-error">
            <p>{error}</p>
            <Link to={ROUTES.LOGIN} className="profile-link">Aller au login</Link>
          </div>
        )}

        {!loading && !error && profile && (
          <div className="profile-card">
            <p><strong>Prénom :</strong> {profile.firstname || '—'}</p>
            <p><strong>Nom :</strong> {profile.lastname || '—'}</p>
            <p><strong>Email :</strong> {profile.email || '—'}</p>
            <p><strong>Rôle :</strong> {profile.role || profile.role_name || '—'}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
