import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import LoginForm from '../../components/auth/LoginForm';
import { login, setSession } from '../../service/authService';

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async ({ email, password }) => {
    setError('');
    setIsLoading(true);
    try {
      const { user, token } = await login({ email, password });
      setSession(user, token);
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      setError(err?.message || 'Connexion impossible. Vérifiez vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Connexion</h1>
        <p className="admin-login-desc">
          Connexion réservée aux administrateurs et membres du jury.
        </p>
        <Link to={ROUTES.ADMIN_INSCRIPTION} className="admin-login-inscription">
          Pas encore de compte ? S&apos;inscrire
        </Link> */}
        <Link to={ROUTES.HOME} className="admin-login-back">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
};

export default LoginAdmin;
