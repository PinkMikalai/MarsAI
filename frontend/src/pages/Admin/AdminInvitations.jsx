import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../../service/authService';

const AdminInvitations = () => {
  const { t } = useTranslation();

  const ROLES = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Selector', label: t('profile.roleSelector') },
    { value: 'Super_admin', label: 'Super Admin' },
  ];

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Selector');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError(t('admin.enterEmail'));
      return;
    }
    setSubmitting(true);
    try {
      await authService.inviteUser({ email: trimmedEmail, role });
      setSuccessMessage(t('admin.invitationSentMsg', {
        email: trimmedEmail,
        role: ROLES.find((r) => r.value === role)?.label || role,
      }));
      setEmail('');
      setRole('Selector');
    } catch (err) {
      setFormError(err.message || t('admin.invitationError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-overview">
      <div className="admin-overview-header">
        <div>
          <p className="admin-overview-kicker">{t('admin.kickerSuperAdmin')}</p>
          <h2 className="admin-overview-title">{t('admin.invitationsTitle')}</h2>
          <p className="admin-overview-text">
            {t('admin.invitationsSubtitle')}
          </p>
        </div>
      </div>

      <div className="admin-events-form-wrap">
        <h3 className="admin-events-form-title">{t('admin.inviteMemberTitle')}</h3>
        <form onSubmit={handleSubmit} className="admin-events-form">
          {formError && (
            <p className="admin-events-form-error" role="alert">
              {formError}
            </p>
          )}
          {successMessage && (
            <p className="admin-events-form-success" role="status">
              {successMessage}
            </p>
          )}
          <div className="admin-events-form-grid">
            <label className="admin-events-form-label admin-events-form-label--full">
              {t('admin.inviteEmailField')}
              <input
                type="email"
                name="email"
                required
                className="admin-events-form-input"
                placeholder={t('admin.inviteEmailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </label>
            <label className="admin-events-form-label admin-events-form-label--full">
              {t('admin.inviteRoleField')}
              <select
                name="role"
                required
                className="admin-events-form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={submitting}
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="admin-profile-btn admin-profile-btn--primary" disabled={submitting}>
            {submitting ? t('common.sending') : t('admin.sendInvitation')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminInvitations;
