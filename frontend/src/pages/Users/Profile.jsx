import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../service/authService';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';

const Profile = () => {
  const { user, isAdmin, isSuperAdmin, isSelector } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
   const isAdminProfile = isAdmin || isSuperAdmin || isSelector;




  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError('Login is necessary to access your profile');
      return;
    }
    setLoading(true);
    authService.profile()
      .then((data) => {
        setProfile(data.result || data);
      })
      .catch((err) => {
        setError(err.message || 'Error during profile loading.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  /* Non connecté : message + lien login */
  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <main className="profile-container">
          <h1 className="profile-title">Mon profil</h1>
          <div className="profile-error">
            <p>{error || 'Connexion nécessaire pour accéder à votre profil.'}</p>
            <Link to={ROUTES.LOGIN} className="profile-link">Aller au login</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* Admin / Super Admin / Sélectionneur : layout admin (contenu vide pour l'instant) */
  if (isAdminProfile) {
    return (
      <AdminLayout>
        <section className="admin-overview">
          {/* Contenu à venir */}
        </section>
      </AdminLayout>
    );
  }

  /* Utilisateur simple : fiche profil */
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
