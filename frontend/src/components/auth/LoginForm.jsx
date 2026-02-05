import { useState } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import { authService } from '../../service/authService';
import {ROUTES } from '../../constants/routes';

const LoginForm = () => {
const [email, setEmail] = useState('');
const [ password, setPassword] = useState('');
const [ error, setError] = useState('');
const [loading, setLoading] = useState(false);

const navigate = useNavigate();


const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  if(!email.trim() || !password) {
    setError('Email and password are required!')
    return;
  }
 setLoading(true);

 try {
  const response = await authService.login( {
    email: email.trim(),
    password
  })
 const { user, token} = response.data;

 if( token) {
  localStorage.setItem('token',token) };
 if ( user ) { 
  localStorage.setItem('user', JSON.stringify(user)) };

  navigate(ROUTES.HOME , {replace: true})
 
 } catch(err){
  setError(err.response?.data?.message || 'Username or password not valid')

 }finally{
  setLoading(false)
 }

}
return(
  <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Connexion/connexion</h2>
        <p className="admin-login-desc">
          Connexion réservée aux administrateurs et aux sélectionneurs.
        </p>

        {/* Affichage des erreurs comme dans ton RegisterForm */}
        {error && (
          <div className="alert-error" style={{ color: 'red', marginBottom: '10px' }} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          
          <div className="admin-login-field">
            <label htmlFor="email" className="admin-login-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.fr"
              className="admin-login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div> 

          <div className="admin-login-field">
            <label htmlFor="password" className="admin-login-label">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="admin-login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
        className="admin-login-submit" 
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to={ROUTES.HOME} className="admin-login-back">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );


}
export default LoginForm;
