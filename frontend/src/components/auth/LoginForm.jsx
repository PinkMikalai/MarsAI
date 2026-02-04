/* LoginForm.jsx - Formulaire de connexion (email + mot de passe) pour tous les profils */

import React, { useState } from 'react';

const LoginForm = ({ onSubmit, isLoading = false, error: externalError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError('Veuillez saisir votre adresse email.');
      return;
    }
    if (!password) {
      setLocalError('Veuillez saisir votre mot de passe.');
      return;
    }
    onSubmit({ email: trimmedEmail, password });
  };

  const error = externalError || localError;

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form-field">
        <label htmlFor="login-email" className="login-form-label">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.fr"
          className="login-form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="login-form-field">
        <label htmlFor="login-password" className="login-form-label">
          Mot de passe
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="login-form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      {error && (
        <p className="login-form-error" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="login-form-submit"
        disabled={isLoading}
      >
        {isLoading ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
};

export default LoginForm;
