import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ROUTES } from '../../constants/routes';
import { authService } from '../../service/authService';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user} = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    console.log("Data user", user);
     

    if (!user) {
      setLoading(false);
      setError('Login is neccessary to acces tour profile');
      return;
    }
    setLoading(true);

    authService.profile()
      .then((data) => {
        console.log("Check data.result", data.result);
        console.log("Check data", data);
        
        
        setProfile(data.result || data );
      })
      .catch((err) => {
        setError(err.message || 'Error during profile loading.');
      })
      .finally(() => setLoading(false));
  }, [user]);

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
