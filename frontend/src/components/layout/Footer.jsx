import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  const { t } = useTranslation();
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
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="deposit-footer-col-title">{t('footer.exploreTitle')}</h3>
            <ul className="deposit-footer-list">
              <li><Link to="/" className="deposit-footer-link">{t('footer.home')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.festival')}</Link></li>
              <li><Link to={ROUTES.GALLERY_FILMS} className="deposit-footer-link">{t('footer.filmGallery')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.competition')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.conferences')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="deposit-footer-col-title">{t('footer.festivalTitle')}</h3>
            <ul className="deposit-footer-list">
              <li><Link to="/" className="deposit-footer-link">{t('footer.venue')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.ticketing')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="deposit-footer-col-title">{t('footer.competitionTitle')}</h3>
            <ul className="deposit-footer-list">
              <li><Link to={ROUTES.PARTICIPATE} className="deposit-footer-link">{t('footer.submission')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.rules')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.prizes')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="deposit-footer-col-title">{t('footer.resourcesTitle')}</h3>
            <ul className="deposit-footer-list">
              <li><Link to="/" className="deposit-footer-link">{t('footer.faq')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.press')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.legalNotices')}</Link></li>
            </ul>
          </div>

          <div className="home-footer-connect">
            <h3 className="deposit-footer-col-title">{t('footer.stayConnected')}</h3>
            <div className="home-footer-socials">
              <a href="#" className="home-footer-social" aria-label={t('footer.facebook')}>{t('footer.facebook')}</a>
              <a href="#" className="home-footer-social" aria-label={t('footer.instagram')}>{t('footer.instagram')}</a>
              <a href="#" className="home-footer-social" aria-label={t('footer.twitter')}>{t('footer.twitter')}</a>
              <a href="#" className="home-footer-social" aria-label={t('footer.linkedin')}>{t('footer.linkedin')}</a>
            </div>
            <div className="home-footer-newsletter">
              <input type="email" placeholder={t('footer.emailPlaceholder')} className="home-footer-input" aria-label={t('footer.emailNewsletter')} />
              <button type="button" className="home-footer-go">{t('footer.go')}</button>
            </div>
          </div>
        </div>

        <div className="deposit-footer-bottom">
          <span className="deposit-footer-copyright">
            {t('footer.copyright')}
          </span>
          <div className="footer-admin-stars">
            <Link to={ROUTES.PROFILE} className="footer-admin-link footer-admin-link--orange" title={t('footer.myProfile')} aria-label={t('footer.goToProfile')}>
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
            {t('footer.taglineAlt')}
          </p>
        </div>

        <div>
          <h3 className="deposit-footer-col-title">{t('footer.navigationTitle')}</h3>
          <ul className="deposit-footer-list">
            <li><Link to={ROUTES.GALLERY_FILMS} className="deposit-footer-link">{t('footer.films')}</Link></li>
              <li><Link to={ROUTES.JURY} className="deposit-footer-link">{t('footer.jury')}</Link></li>
              <li><Link to={ROUTES.EVENTS} className="deposit-footer-link">{t('footer.events')}</Link></li>
              <li><Link to="/" className="deposit-footer-link">{t('footer.ticketing')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="deposit-footer-col-title">{t('footer.competitionTitle')}</h3>
          <ul className="deposit-footer-list">
            <li><Link to="/" className="deposit-footer-link">{t('footer.rules')}</Link></li>
            <li><Link to={ROUTES.PARTICIPATE} className="deposit-footer-link">{t('footer.submission')}</Link></li>
            <li><Link to="/" className="deposit-footer-link">{t('footer.prizes')}</Link></li>
            <li><Link to="/" className="deposit-footer-link">{t('footer.faq')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="deposit-footer-col-title">{t('footer.legalTitle')}</h3>
          <ul className="deposit-footer-list">
            <li><Link to="/" className="deposit-footer-link">{t('footer.mentions')}</Link></li>
            <li><Link to="/" className="deposit-footer-link">{t('footer.privacy')}</Link></li>
            <li><Link to="/" className="deposit-footer-link">{t('footer.cookies')}</Link></li>
            <li><Link to="/" className="deposit-footer-link">{t('footer.press')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="deposit-footer-bottom">
        <span className="deposit-footer-copyright">
          {t('footer.copyrightAlt')}
        </span>
        <div className="deposit-footer-socials">
          <a href="#" className="deposit-footer-social">{t('footer.twitter')}</a>
          <a href="#" className="deposit-footer-social">{t('footer.instagram')}</a>
          <a href="#" className="deposit-footer-social">{t('footer.linkedin')}</a>
        </div>
        <div className="footer-admin-stars">
          <Link to={ROUTES.PROFILE} className="footer-admin-link footer-admin-link--orange" title={t('footer.myProfile')} aria-label={t('footer.goToProfile')}>
            <span className="footer-admin-star" aria-hidden>★</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
