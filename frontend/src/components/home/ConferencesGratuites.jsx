import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlay, FiTool, FiAward } from 'react-icons/fi';

const ICONS = [FiPlay, FiTool, FiAward];
const HIGHLIGHTS = [true, false, false];
const KEYS = ['1', '2', '3'];

const ConferencesGratuites = () => {
  const { t } = useTranslation();

  return (
    <section className="home-section home-conferences" aria-label="Conférences gratuites">
      <div className="home-container">
        <h2 className="home-section-title">
          {t('home.conferences.sectionTitle')} <span className="home-section-title-accent">{t('home.conferences.sectionAccent')}</span>
        </h2>
        <p className="home-section-desc">{t('home.conferences.desc')}</p>
        <a href="#programme" className="home-section-link">{t('home.conferences.programme')}</a>
        <div className="home-conferences-grid">
          {KEYS.map((k, i) => {
            const Icon = ICONS[i];
            return (
              <article
                key={k}
                className={`home-conf-card ${HIGHLIGHTS[i] ? 'home-conf-card--highlight' : ''}`}
              >
                <div className="home-conf-card-icon">
                  <Icon size={28} strokeWidth={2} aria-hidden />
                </div>
                <h3 className="home-conf-card-title">{t(`home.conferences.type${k}Title`)}</h3>
                <p className="home-card-desc">{t(`home.conferences.type${k}Desc`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ConferencesGratuites;
