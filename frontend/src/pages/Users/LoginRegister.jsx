import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const LoginRegister = () => {
  const navigate = useNavigate();

  return (
    <div className="login-register-page">
      <h1 className="login-register-title">Page Formulaire (Login/Register)</h1>
      <p className="login-register-desc">Ceci est un placeholder pour ton futur formulaire.</p>
      <div className="login-register-actions">
        <Button variant="primary" onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default LoginRegister;
