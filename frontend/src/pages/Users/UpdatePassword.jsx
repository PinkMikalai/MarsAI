import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../service/authService';
import { ROUTES } from '../../constants/routes';
import '../../styles/pages/admin/login-admin.css';

const UpdatePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [ oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError(t('auth.fillAllFields'));
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
      await authService.updatePassword({
        oldPassword,
        newPassword,
        confirmNewPassword
      });
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.PROFILE), 2000);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">{t('auth.updatePasswordTitle')}</h2>
        
        {error && <div className="login-form-error" role="alert">{error}</div>}
        
        {success ? (
          <div className="login-form-success" role="status">
            <p>{t('auth.passwordUpdateSuccess')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form" noValidate>
          
            <div className="login-form-field">
              <label htmlFor="old-password" className="login-form-label">{t('auth.oldPasswordLabel')}</label>
              <input
                id="old-password"
                type="password"
                autoComplete="new-password"
                className="login-form-input"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="login-form-field">
                <label htmlFor="new-password" className="login-form-label">
                {t('auth.newPasswordLabel')}
              </label>
              <input
                id="new-password"
                type="password"
                className="login-form-input"
                placeholder="••••••••"
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
                id="confirm-password"
                type="password"
                className="login-form-input"
                placeholder="••••••••"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="login-form-submit" disabled={loading}>
              {loading ? t('auth.updating') : t('auth.updatePasswordButton')}
            </button>
          </form>
        )}

        <div className="admin-login-footer">
          <Link to={ROUTES.PROFILE} className="admin-login-back">
            {t('auth.backToProfile')}
          </Link>
        </div>
      </div>
    </div>
  );

};

export default UpdatePassword;
