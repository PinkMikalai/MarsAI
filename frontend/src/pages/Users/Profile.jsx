import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../service/authService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!token || !user?.id) {
      setLoading(false);
      setError('Connecte-toi pour voir ton profil.');
      return;
    }

    authService.profile(user.id, token)
      .then((res) => {
        setProfile(res.data?.result || res.data?.user || res.data || null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Impossible de charger le profil.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <h1 className="profile-title">Mon profil</h1>

        {loading && <p className="profile-loading">Chargement...</p>}
        {error && (
          <div className="profile-error">
            <p>{error}</p>
            <Link to={ROUTES.LOGIN} className="profile-link">Aller au login</Link>
          </div>
        )}

        {!loading && !error && profile && (
          <div className="profile-card">
            <p><strong>Prénom :</strong> {profile.firstname || '—'}</p>
            <p><strong>Nom :</strong> {profile.lastname || '—'}</p>
            <p><strong>Email :</strong> {profile.email || '—'}</p>
            <p><strong>Rôle :</strong> {profile.role || profile.role_name || '—'}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
