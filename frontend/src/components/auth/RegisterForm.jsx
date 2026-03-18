import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../service/authService.js';
import { ROUTES } from '../../constants/routes';

const RegisterForm = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [userData, setUserData] = useState({ email: '', role: '' });
  const [form, setForm] = useState({ firstname: '', lastname: '', password: '', passwordConfirm: '' });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setError(t('auth.tokenRequired'));
        setLoading(false);
        return;
      }
      try {
        const response = await authService.verifyInvitation(token);
        if (response) {
          setUserData({ email: response.email, role: response.role });
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        setError(err.response?.data.message || t('auth.invalidOrExpiredLink'));
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [token, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.passwordConfirm) {
      setError(t('auth.passwordsMismatch'));
      return;
    }

    try {
      await authService.register({
        token,
        firstname: form.firstname,
        lastname: form.lastname,
        password: form.password,
        confirmPassword: form.passwordConfirm,
      });

      alert(t('auth.profileCreatedSuccess'));
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError(err.response?.data?.message || t('auth.registrationError'));
    }
  };

  if (loading) {
    return <div className="admin-inscription-page">{t('auth.loadingToken')}</div>;
  }

  if (error && !userData.email) {
    return (
      <div className="admin-inscription-page">
        <div className="admin-inscription-card">
          <h2 className="admin-inscription-card-error">{error}</h2>
          <Link to={ROUTES.LOGIN} className="admin-inscription-back">
            {t('auth.backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-inscription-page">
      <div className="admin-inscription-card">
        <h1 className="admin-inscription-title">{t('auth.registerTitle')}</h1>
        <p className="admin-inscription-desc">
          {t('auth.welcomeTeam')} <strong>{userData.role}</strong>.
        </p>

        {error && <div className="login-form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-inscription-form">
          <div className="admin-inscription-field">
            <label className="admin-inscription-label">{t('auth.emailLabel')}</label>
            <input
              type="email"
              value={userData.email}
              className="admin-inscription-input disabled-field"
              readOnly
              disabled
            />
          </div>

          <div className="admin-inscription-row">
            <div className="admin-inscription-field">
              <label htmlFor="firstname" className="admin-inscription-label">{t('auth.firstnameLabel')}</label>
              <input
                id="firstname"
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                className="admin-inscription-input"
                placeholder={t('auth.firstnamePlaceholder')}
                required
              />
            </div>
            <div className="admin-inscription-field">
              <label htmlFor="lastname" className="admin-inscription-label">{t('auth.lastnameName')}</label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                className="admin-inscription-input"
                placeholder={t('auth.lastnamePlaceholder')}
                required
              />
            </div>
          </div>

          <div className="admin-inscription-field">
            <label className="admin-inscription-label">{t('auth.assignedRole')}</label>
            <input
              type="text"
              value={userData.role}
              className="admin-inscription-input disabled-field"
              readOnly
              disabled
            />
          </div>

          <div className="admin-inscription-field">
            <label htmlFor="password" className="admin-inscription-label">{t('auth.passwordLabel2')}</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="admin-inscription-input"
              placeholder={t('auth.passwordMinPlaceholder')}
              minLength={6}
              required
            />
          </div>

          <div className="admin-inscription-field">
            <label htmlFor="passwordConfirm" className="admin-inscription-label">{t('auth.confirmPasswordLabel')}</label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className="admin-inscription-input"
              placeholder={t('auth.confirmPasswordPlaceholder')}
              required
            />
          </div>

          <button type="submit" className="admin-inscription-submit">
            {t('auth.submitBtn')}
          </button>
        </form>

        <Link to={ROUTES.LOGIN} className="admin-inscription-back">
          {t('auth.alreadyHaveProfile')}
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
