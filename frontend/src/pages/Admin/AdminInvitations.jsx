import { useState } from 'react';
import { authService } from '../../service/authService';

const ROLES = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Selector', label: 'Sélectionneur' },
  { value: 'Super-admin', label: 'Super Admin' },
];

const AdminInvitations = () => {
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
      setFormError('Veuillez saisir une adresse email.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.inviteUser({ email: trimmedEmail, role });
      setSuccessMessage(`Invitation envoyée à ${trimmedEmail} avec le rôle ${ROLES.find((r) => r.value === role)?.label || role}.`);
      setEmail('');
      setRole('Selector');
    } catch (err) {
      setFormError(err.message || 'Erreur lors de l\'envoi de l\'invitation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-overview">
      <div className="admin-overview-header">
        <div>
          <p className="admin-overview-kicker">Super Admin</p>
          <h2 className="admin-overview-title">Invitations</h2>
          <p className="admin-overview-text">
            Envoyez une invitation par email pour ajouter un membre à l&apos;équipe (Admin, Sélectionneur ou Super Admin). Le lien expire sous 48 h.
          </p>
        </div>
      </div>

      <div className="admin-events-form-wrap">
        <h3 className="admin-events-form-title">Inviter un membre</h3>
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
              Email *
              <input
                type="email"
                name="email"
                required
                className="admin-events-form-input"
                placeholder="exemple@marsai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </label>
            <label className="admin-events-form-label admin-events-form-label--full">
              Rôle *
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
            {submitting ? 'Envoi…' : 'Envoyer l\'invitation'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminInvitations;
