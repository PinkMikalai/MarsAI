import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
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
            <li><Link to="/" className="deposit-footer-link">Films</Link></li>
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
      </div>
    </footer>
  );
};

export default Footer;
