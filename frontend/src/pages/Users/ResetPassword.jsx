import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { authService } from '../../service/authService';
import { ROUTES } from '../../constants/routes';
import '../../styles/pages/admin/login-admin.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError('Lien invalide ou expiré. Demandez un nouveau lien.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmNewPassword) {
      setError('Veuillez remplir les deux champs.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword,
        confirmNewPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 2500);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Le lien a peut-être expiré.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <h2 className="admin-login-title">Réinitialisation</h2>
          <p className="login-form-error">{error}</p>
          <Link to={ROUTES.FORGOT_PASSWORD} className="admin-login-inscription">
            Demander un nouveau lien
          </Link>
          <div className="admin-login-footer">
            <Link to={ROUTES.LOGIN} className="admin-login-back">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Nouveau mot de passe</h2>
        <p className="admin-login-desc">
          Choisissez un nouveau mot de passe sécurisé (min. 6 caractères, au moins un chiffre).
        </p>

        {error && (
          <div className="login-form-error" role="alert">
            {error}
          </div>
        )}

        {success ? (
          <div className="login-form-success" role="status">
            <p>Votre mot de passe a été réinitialisé. Redirection vers la connexion…</p>
            <Link to={ROUTES.LOGIN} className="admin-login-inscription">
              Aller à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-form-field">
              <label htmlFor="new-password" className="login-form-label">
                Nouveau mot de passe
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="login-form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="login-form-field">
              <label htmlFor="confirm-new-password" className="login-form-label">
                Confirmer le mot de passe
              </label>
              <input
                id="confirm-new-password"
                name="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="login-form-input"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              className="login-form-submit"
              disabled={loading}
            >
              {loading ? 'Enregistrement…' : 'Enregistrer le mot de passe'}
            </button>
          </form>
        )}

        <div className="admin-login-footer">
          <Link to={ROUTES.LOGIN} className="admin-login-back">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
