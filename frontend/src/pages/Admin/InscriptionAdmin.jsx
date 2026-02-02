import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const InscriptionAdmin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    nom: '',
    prenom: '',
    role: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!form.email || !form.nom || !form.prenom || !form.role || !form.password) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    // TODO: envoi au backend
    alert('Inscription envoyée (à brancher sur l\'API).');
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <div className="admin-inscription-page">
      <div className="admin-inscription-card">
        <h1 className="admin-inscription-title">Inscription Admin & Sélectionneurs</h1>
        <p className="admin-inscription-desc">
          Créez un compte pour accéder à l&apos;espace administrateur ou jury.
        </p>

        <form onSubmit={handleSubmit} className="admin-inscription-form">
          <div className="admin-inscription-field">
            <label htmlFor="inscription-email" className="admin-inscription-label">Email</label>
            <input
              id="inscription-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="admin-inscription-input"
              placeholder="votre@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-inscription-row">
            <div className="admin-inscription-field">
              <label htmlFor="inscription-prenom" className="admin-inscription-label">Prénom</label>
              <input
                id="inscription-prenom"
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                className="admin-inscription-input"
                placeholder="Prénom"
                autoComplete="given-name"
                required
              />
            </div>
            <div className="admin-inscription-field">
              <label htmlFor="inscription-nom" className="admin-inscription-label">Nom</label>
              <input
                id="inscription-nom"
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                className="admin-inscription-input"
                placeholder="Nom"
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div className="admin-inscription-field">
            <label htmlFor="inscription-role" className="admin-inscription-label">Rôle</label>
            <select
              id="inscription-role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="admin-inscription-input admin-inscription-select"
              required
            >
              <option value="">Choisir un rôle</option>
              <option value="admin">Admin</option>
              <option value="selectioneur">Sélectionneur</option>
            </select>
          </div>

          <div className="admin-inscription-field">
            <label htmlFor="inscription-password" className="admin-inscription-label">Mot de passe</label>
            <input
              id="inscription-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="admin-inscription-input"
              placeholder="Mot de passe"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className="admin-inscription-field">
            <label htmlFor="inscription-password-confirm" className="admin-inscription-label">Confirmation mot de passe</label>
            <input
              id="inscription-password-confirm"
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className="admin-inscription-input"
              placeholder="Confirmer le mot de passe"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="admin-inscription-submit">
            S&apos;inscrire
          </button>
        </form>

        <Link to={ROUTES.ADMIN_LOGIN} className="admin-inscription-back">
          Déjà un compte ? Connexion
        </Link>
      </div>
    </div>
  );
};

export default InscriptionAdmin;
