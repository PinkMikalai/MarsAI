import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from "../../service/authService.js";
import { ROUTES } from '../../constants/routes';

const RegisterForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  // Données récupérées du token (Email / Role)
  const [userData, setUserData] = useState({ email: '', role: '' });
  
  // Données saisies par l'utilisateur
  const [form, setForm] = useState({ firstname: '', lastname: '', password: '', passwordConfirm: ''});

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  //Vérification du token 
  useEffect(() => {
    // verification de la présence du token
    const checkToken = async () => {
    if (!token) {
      setError("A token is mandatory")
      setLoading(false)
      return;
      }
    // récupération de la data du token
    try {
      const response = await authService.verifyInvitation(token);
      const data = response.data 
      console.log("verif data token", data);
      
      if(data) {
      setUserData({ email: data.email , role: data.role}) }
    } catch(err){
      setError('Invalid or expired link')
    } finally {
      setLoading(false);
    } 
  }; checkToken();}, [token]);

// remplissage du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation de la saise de password
    if (form.password !== form.passwordConfirm) {
      setError(`Passwords don't match`);
      return;
    }

    try {
      // Envoi au backend : on fusionne les données du formulaire + le token
      await authService.register({
        token: token,
        firstname: form.firstname,
        lastname: form.lastname,
        password: form.password,
        confirmPassword: form.passwordConfirm
        
      });

      alert('Profile created successfully !');
      navigate(ROUTES.LOGIN);
    } catch (err) {
        console.log("Détail erreur reçue:", err.response?.data);
      setError(err.response?.data?.message || "An error occured during the registration");
    }
  };
 
  // Chargement
  if (loading) {
    return <div className="admin-inscription-page" >Loading...</div>;
  }

  // Erreur ou probléme de token
  if (error && !userData.email) {
    return (
      <div className="admin-inscription-page">
        <div className="admin-inscription-card">
          <h2 className='admin-inscription-card-error'>{error}</h2>
          <Link to={ROUTES.LOGIN} className="admin-inscription-back">Return to login</Link>
        </div>
      </div>
    );
  }


  return (
    <div className="admin-inscription-page">
      <div className="admin-inscription-card">
        <h1 className="admin-inscription-title">Finalise your registration</h1>
        <p className="admin-inscription-desc">
          Welcome to the marsAI film festival team <strong>{userData.role}</strong>.
        </p>

        {error && <div className="login-form-error" >{error}</div>}

        <form onSubmit={handleSubmit} className="admin-inscription-form">
          
          {/* Email pré-rempli et verrouillé) */}
          <div className="admin-inscription-field">
            <label className="admin-inscription-label">Email</label>
            <input
              type="email"
              value={userData.email}
              className="admin-inscription-input disabled-field"
              readOnly
              disabled
            />
          </div>

          <div className="admin-inscription-row">
            {/* Prénom à compléter par user*/}
            <div className="admin-inscription-field">
              <label htmlFor="firstname" className="admin-inscription-label">Prénom</label>
              <input
                id="firstname"
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                className="admin-inscription-input"
                placeholder="Votre prénom"
                required
              />
            </div>
            {/* Nom  à compléter par user*/}
            <div className="admin-inscription-field">
              <label htmlFor="lastname" className="admin-inscription-label">Nom</label>
              <input
                id="lastname"
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                className="admin-inscription-input"
                placeholder="Votre nom"
                required
              />
            </div>
          </div>

          {/* Rôle pré-rempli et verrouillé) */}
          <div className="admin-inscription-field">
            <label className="admin-inscription-label">Rôle attribué</label>
            <input
              type="text"
              value={userData.role}
              className="admin-inscription-input disabled-field"
              readOnly
              disabled
            />
          </div>

          {/* Mot de passe à compléter par user */}
          <div className="admin-inscription-field">
            <label htmlFor="password" className="admin-inscription-label">Mot de passe</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="admin-inscription-input"
              placeholder="6 caractères minimum"
              minLength={6}
              required
            />
          </div>

          {/* Confirmation du mot passe par user */}
          <div className="admin-inscription-field">
            <label htmlFor="passwordConfirm" className="admin-inscription-label">Confirmation mot de passe</label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className="admin-inscription-input"
              placeholder="Confirmez votre mot de passe"
              required
            />
          </div>

          <button type="submit" className="admin-inscription-submit">
            Submit
          </button>
        </form>

        <Link to={ROUTES.LOGIN} className="admin-inscription-back">
          I already have a profile ? Log in
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;