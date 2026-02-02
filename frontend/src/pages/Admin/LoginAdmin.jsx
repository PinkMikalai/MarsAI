import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const LoginAdmin = () => {
  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Espace Admin & Sélectionneurs</h1>
        <p className="admin-login-desc">
          Connexion réservée aux administrateurs et membres du jury.
        </p>
        {/* TODO: formulaire de connexion */}
        <p className="admin-login-placeholder">
          Formulaire de connexion à venir.
        </p>
        <Link to={ROUTES.ADMIN_INSCRIPTION} className="admin-login-inscription">
          Pas encore de compte ? S&apos;inscrire
        </Link>
        <Link to={ROUTES.HOME} className="admin-login-back">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
};

export default LoginAdmin;
