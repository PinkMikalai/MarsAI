import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../service/authService';
import { ROUTES } from '../../constants/routes';
import '../../styles/pages/admin/login-admin.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Mot de passe oublié</h2>
        <p className="admin-login-desc">
          Saisissez votre email pour recevoir un lien de réinitialisation.
        </p>

        {error && (
          <div className="login-form-error" role="alert">
            {error}
          </div>
        )}

        {success ? (
          <div className="login-form-success" role="status">
            <p>Si un compte existe pour cette adresse, un lien de réinitialisation a été envoyé par email. Vérifiez votre boîte de réception.</p>
            <Link to={ROUTES.LOGIN} className="admin-login-inscription">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-form-field">
              <label htmlFor="forgot-email" className="login-form-label">
                Email
              </label>
              <input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.fr"
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
              {loading ? 'Envoi en cours…' : 'Envoyer le lien'}
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

export default ForgotPassword;
