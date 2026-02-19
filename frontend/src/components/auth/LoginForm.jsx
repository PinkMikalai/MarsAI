
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../service/authService';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (e) => {

    console.log("Data", email, password);

    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required!')
      return;
    }
    setLoading(true);

    try {
      const data = await authService.login({
        email: email.trim(),
        password
      })
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
      setError(err.message || 'Username or password not valid')

    } finally {
      setLoading(false)
    }

  }
  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Connection</h2>
        <p className="admin-login-desc">
          Restricted access
        </p>


        {error && (
          <div className="login-form-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>

          <div className="login-form-field">
            <label htmlFor="email" className="login-form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="none"
              placeholder="vous@exemple.fr"
              className="login-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="login-form-field">
            <label htmlFor="password" className="login-form-label">Password</label>
            <Link to={ROUTES.FORGOT_PASSWORD} className="login-form-forgot">
              Mot de passe oublié ?
            </Link>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
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
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to={ROUTES.HOME} className="admin-login-back">
            Home
          </Link>
        </div>
      </div>
    </div>
  );


}
export default LoginForm;
