import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../service/authService';
import { ROUTES } from '../../constants/routes';
import '../../styles/pages/admin/login-admin.css';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token] = useState(() => searchParams.get('token'));

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
<<<<<<< HEAD
    if (!token) setError(t('auth.invalidLinkError'));
  }, [token, t]);
=======
    if (!token) {setError(t('auth.invalidLinkError'));

    } else {window.history.replaceState({}, document.title, window.location.pathname);}
  }, []);
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmNewPassword) {
      setError(t('auth.fillBothFields'));
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }
    if (newPassword.length < 6) {
      setError(t('auth.passwordMinLength'));
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
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <h2 className="admin-login-title">{t('auth.resetTitle')}</h2>
          <p className="login-form-error">{error}</p>
          <Link to={ROUTES.FORGOT_PASSWORD} className="admin-login-inscription">
            {t('auth.requestNewLink')}
          </Link>
          <div className="admin-login-footer">
            <Link to={ROUTES.LOGIN} className="admin-login-back">
              {t('auth.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">{t('auth.resetPasswordTitle')}</h2>
        <p className="admin-login-desc">
          {t('auth.resetPasswordDesc')}
        </p>

        {error && (
          <div className="login-form-error" role="alert">
            {error}
          </div>
        )}

        {success ? (
          <div className="login-form-success" role="status">
            <p>{t('auth.passwordResetSuccess')}</p>
            <Link to={ROUTES.LOGIN} className="admin-login-inscription">
              {t('auth.goToLogin')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-form-field">
              <label htmlFor="new-password" className="login-form-label">
                {t('auth.newPasswordLabel')}
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
                {t('auth.confirmNewPasswordLabel')}
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
              {loading ? t('auth.savingPassword') : t('auth.savePassword')}
            </button>
          </form>
        )}

        <div className="admin-login-footer">
          <Link to={ROUTES.LOGIN} className="admin-login-back">
            {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
