import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiUser, FiZap, FiTarget } from 'react-icons/fi';

const ICONS = [FiUser, FiZap, FiTarget];
const COLORS = ['green', 'teal', 'purple'];
const KEYS = ['1', '2', '3'];

const ObjectifsFestival = () => {
  const { t } = useTranslation();

  return (
    <section className="home-section home-objectifs" aria-label="Objectifs du festival">
      <div className="home-container">
        <h2 className="home-section-title">
          {t('home.objectifs.sectionTitle')} <span className="home-section-title-accent">{t('home.objectifs.sectionAccent')}</span>
        </h2>
        <div className="home-objectifs-grid">
          {KEYS.map((k, i) => {
            const Icon = ICONS[i];
            return (
              <article key={k} className={`home-card home-card--${COLORS[i]}`}>
                <div className="home-card-icon">
                  <Icon size={28} strokeWidth={2} aria-hidden />
                </div>
                <h3 className="home-card-title">{t(`home.objectifs.title${k}`)}</h3>
                <p className="home-card-desc">{t(`home.objectifs.desc${k}`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ObjectifsFestival;
