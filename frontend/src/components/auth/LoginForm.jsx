
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
        <h2 className="admin-login-title">Connexion</h2>
        <p className="admin-login-desc">
          Restricted access
        </p>

        
        {error && (
          <div className="login-form-error"  role="alert">
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
              autoComplete="email"
              placeholder="vous@exemple.fr"
              className="login-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div> 

          <div className="login-form-field">
            <label htmlFor="password" className="login-form-label">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
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
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );


}
export default LoginForm;
