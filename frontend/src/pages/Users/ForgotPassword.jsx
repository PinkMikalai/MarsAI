import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../service/authService';
import { ROUTES } from '../../constants/routes';
import '../../styles/pages/admin/login-admin.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError(t('auth.enterEmail'));
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">{t('auth.forgotPasswordTitle')}</h2>
        <p className="admin-login-desc">
          {t('auth.forgotPasswordDesc')}
        </p>

        {error && (
          <div className="login-form-error" role="alert">
            {error}
          </div>
        )}

        {success ? (
          <div className="login-form-success" role="status">
            <p>{t('auth.resetLinkSentMsg')}</p>
            <Link to={ROUTES.LOGIN} className="admin-login-inscription">
              {t('auth.backToLogin')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-form-field">
              <label htmlFor="forgot-email" className="login-form-label">
                {t('auth.emailLabel')}
              </label>
              <input
                id="forgot-email"
                name="email"
                type="email"
<<<<<<< HEAD
                autoComplete="email"
=======
                autoComplete="new-password"
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
                placeholder={t('auth.emailPlaceholder')}
                className="login-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              className="login-form-submit"
              disabled={loading}
            >
              {loading ? t('auth.sendingLink') : t('auth.sendLink')}
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

export default ForgotPassword;
