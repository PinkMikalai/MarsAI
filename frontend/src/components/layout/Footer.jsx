import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  if (isHome) {
    return (
      <footer className="deposit-footer home-footer">
        <div className="deposit-footer-grid home-footer-grid">
          <div>
            <div className="deposit-footer-brand-logo">
              <span className="deposit-footer-brand-mars">MARS</span>
              <span className="deposit-footer-brand-ai">A.I</span>
            </div>
            <p className="deposit-footer-tagline">
              Imaginez des futurs souhaitables.
            </p>
          </div>

          <div>
            <h3 className="deposit-footer-col-title">Explorer</h3>
            <ul className="deposit-footer-list">
              <li><Link to="/" className="deposit-footer-link">Accueil</Link></li>
              <li><Link to="/" className="deposit-footer-link">Festival</Link></li>
              <li><Link to={ROUTES.GALERIE_FILMS} className="deposit-footer-link">Galerie des films</Link></li>
              <li><Link to="/" className="deposit-footer-link">Compétition</Link></li>
              <li><Link to="/" className="deposit-footer-link">Conférences</Link></li>
              <li><Link to="/" className="deposit-footer-link">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="deposit-footer-col-title">Festival</h3>
            <ul className="deposit-footer-list">
              <li><Link to="/" className="deposit-footer-link">Programme</Link></li>
              <li><Link to="/" className="deposit-footer-link">Lieu</Link></li>
              <li><Link to="/" className="deposit-footer-link">Billetterie</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="deposit-footer-col-title">Compétition</h3>
            <ul className="deposit-footer-list">
              <li><Link to={ROUTES.DEPOSER_UN_FILM} className="deposit-footer-link">Soumission</Link></li>
              <li><Link to="/" className="deposit-footer-link">Règlement</Link></li>
              <li><Link to="/" className="deposit-footer-link">Prix</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="deposit-footer-col-title">Ressources</h3>
            <ul className="deposit-footer-list">
              <li><Link to="/" className="deposit-footer-link">FAQ</Link></li>
              <li><Link to="/" className="deposit-footer-link">Presse</Link></li>
              <li><Link to="/" className="deposit-footer-link">Mentions légales</Link></li>
            </ul>
          </div>

          <div className="home-footer-connect">
            <h3 className="deposit-footer-col-title">RESTEZ CONNECTÉ</h3>
            <div className="home-footer-socials">
              <a href="#" className="home-footer-social" aria-label="Facebook">Facebook</a>
              <a href="#" className="home-footer-social" aria-label="Instagram">Instagram</a>
              <a href="#" className="home-footer-social" aria-label="Twitter">Twitter</a>
              <a href="#" className="home-footer-social" aria-label="LinkedIn">LinkedIn</a>
            </div>
            <div className="home-footer-newsletter">
              <input type="email" placeholder="Votre email" className="home-footer-input" aria-label="Email newsletter" />
              <button type="button" className="home-footer-go">GO</button>
            </div>
          </div>
        </div>

        <div className="deposit-footer-bottom">
          <span className="deposit-footer-copyright">
            © 2026 MARS.A.I • Tous droits réservés
          </span>
          <div className="footer-admin-stars">
            <Link to={ROUTES.ADMIN_INSCRIPTION} className="footer-admin-link footer-admin-link--blue" title="Inscription Admin & Sélectionneurs" aria-label="S'inscrire (Admin et Sélectionneurs)">
              <span className="footer-admin-star" aria-hidden>★</span>
            </Link>
            <Link to={ROUTES.ADMIN_LOGIN} className="footer-admin-link" title="Connexion Admin & Sélectionneurs" aria-label="Connexion Admin et Sélectionneurs">
              <span className="footer-admin-star" aria-hidden>★</span>
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="deposit-footer">
      <div className="deposit-footer-grid">
        <div>
          <div className="deposit-footer-brand-logo">
            <span className="deposit-footer-brand-mars">mars</span>
            <span className="deposit-footer-brand-ai">AI</span>
          </div>
          <p className="deposit-footer-tagline">
            La plateforme mondiale de la narration générative.
          </p>
        </div>

        <div>
          <h3 className="deposit-footer-col-title">Navigation</h3>
          <ul className="deposit-footer-list">
            <li><Link to="/" className="deposit-footer-link">Programme</Link></li>
            <li><Link to={ROUTES.GALERIE_FILMS} className="deposit-footer-link">Films</Link></li>
            <li><Link to="/" className="deposit-footer-link">Jury</Link></li>
            <li><Link to="/" className="deposit-footer-link">Billetterie</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="deposit-footer-col-title">Compétition</h3>
          <ul className="deposit-footer-list">
            <li><Link to="/" className="deposit-footer-link">Règlement</Link></li>
            <li><Link to={ROUTES.DEPOSER_UN_FILM} className="deposit-footer-link">Soumission</Link></li>
            <li><Link to="/" className="deposit-footer-link">Prix</Link></li>
            <li><Link to="/" className="deposit-footer-link">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="deposit-footer-col-title">Légal</h3>
          <ul className="deposit-footer-list">
            <li><Link to="/" className="deposit-footer-link">Mentions</Link></li>
            <li><Link to="/" className="deposit-footer-link">Confidentialité</Link></li>
            <li><Link to="/" className="deposit-footer-link">Cookies</Link></li>
            <li><Link to="/" className="deposit-footer-link">Presse</Link></li>
          </ul>
        </div>
      </div>

      <div className="deposit-footer-bottom">
        <span className="deposit-footer-copyright">
          © 2026 marsAI Protocol • Tous droits réservés
        </span>
        <div className="deposit-footer-socials">
          <a href="#" className="deposit-footer-social">Twitter</a>
          <a href="#" className="deposit-footer-social">Instagram</a>
          <a href="#" className="deposit-footer-social">LinkedIn</a>
        </div>
        <div className="footer-admin-stars">
          <Link to={ROUTES.ADMIN_INSCRIPTION} className="footer-admin-link footer-admin-link--blue" title="Inscription Admin & Sélectionneurs" aria-label="S'inscrire (Admin et Sélectionneurs)">
            <span className="footer-admin-star" aria-hidden>★</span>
          </Link>
          <Link to={ROUTES.ADMIN_LOGIN} className="footer-admin-link" title="Connexion Admin & Sélectionneurs" aria-label="Connexion Admin et Sélectionneurs">
            <span className="footer-admin-star" aria-hidden>★</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
