import React from 'react';
import { useTranslation } from 'react-i18next';

const ChiffresProjetes = () => {
  const { t } = useTranslation();
  return (
    <section className="home-section home-chiffres" aria-label="Chiffres projetés">
      <div className="home-container">
        <h2 className="home-section-title">
          {t('home.chiffres.sectionTitle')} <span className="home-section-title-pink">{t('home.chiffres.sectionAccent')}</span>
        </h2>
        <div className="home-chiffres-grid">
          <article className="home-chiffre-card">
            <span className="home-chiffre-value">{t('home.chiffres.stat1Value')}</span>
            <p className="home-card-desc">{t('home.chiffres.stat1Label')}</p>
          </article>
          <article className="home-chiffre-card">
            <span className="home-chiffre-value">{t('home.chiffres.stat2Value')}</span>
            <p className="home-card-desc">{t('home.chiffres.stat2Label')}</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ChiffresProjetes;
