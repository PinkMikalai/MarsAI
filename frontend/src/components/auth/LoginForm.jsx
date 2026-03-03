import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../service/authService';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError(t('auth.emailPasswordRequired'));
      return;
    }
    setLoading(true);

    try {
      const data = await authService.login({
        email: email.trim(),
        password,
      });
      const token = data.token?.access_token || data.token;
      const user = data.user || data.token?.user;

      if (token && user) {
        if (typeof login === 'function') {
          try {
            login(token, user);
            navigate(ROUTES.PROFILE, { replace: true });
          } catch (e) {
            console.error("ERREUR DANS L'EXÉCUTION DE LOGIN:", e);
          }
        } else {
          navigate(ROUTES.PROFILE);
        }
      }
    } catch (err) {
      setError(err.message || t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">{t('auth.connexionTitle')}</h2>
        <p className="admin-login-desc">{t('auth.restrictedAccess')}</p>

        {error && (
          <div className="login-form-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="login-form-field">
            <label htmlFor="email" className="login-form-label">{t('auth.emailLabel')}</label>
            <input
              id="email"
              name="email"
              type="email"
<<<<<<< HEAD
              autoComplete="email"
=======
              autoComplete="off"
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
              placeholder={t('auth.emailPlaceholder')}
              className="login-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="login-form-field">
            <label htmlFor="password" className="login-form-label">{t('auth.passwordLabel')}</label>
<<<<<<< HEAD
            <Link to={ROUTES.FORGOT_PASSWORD} className="login-form-forgot">
              {t('auth.forgotPasswordLink')}
            </Link>
=======
            
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="login-form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="login-form-submit"
            disabled={loading}
          >
            {loading ? t('auth.signingIn') : t('auth.signIn')}
          </button>
        </form>
        <div className="admin-login-footer">
          <Link to={ROUTES.FORGOT_PASSWORD} className="login-form-forgot">
              {t('auth.forgotPasswordLink')}
            </Link>
        </div>

        <div className="admin-login-footer">
          <Link to={ROUTES.HOME} className="admin-login-back">
            {t('auth.homeBack')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
