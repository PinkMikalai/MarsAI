import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiMapPin } from 'react-icons/fi';

const LaPlateforme = () => {
  const { t } = useTranslation();
  return (
    <section className="home-section home-plateforme" aria-label="La plateforme">
      <div className="home-container">
        <h2 className="home-section-title home-section-title--outline">{t('home.plateforme.sectionTitle')}</h2>
        <p className="home-section-subtitle">{t('home.plateforme.subtitle')}</p>
        <p className="home-section-desc">{t('home.plateforme.city')}</p>
        <div className="home-plateforme-cards">
          <article className="home-card home-card--dark">
            <h3 className="home-card-title">{t('home.plateforme.hall1Title')}</h3>
            <p className="home-card-desc">{t('home.plateforme.hall1Desc')}</p>
          </article>
          <article className="home-card home-card--dark">
            <h3 className="home-card-title">{t('home.plateforme.hall2Title')}</h3>
            <p className="home-card-desc">{t('home.plateforme.hall2Desc')}</p>
          </article>
        </div>
        <div className="home-map-wrap">
          <div className="home-map-placeholder">
            <FiMapPin size={48} strokeWidth={1.5} aria-hidden />
            <span>{t('home.plateforme.map')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaPlateforme;
