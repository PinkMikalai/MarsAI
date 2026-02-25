import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiFilm, FiCpu, FiMapPin } from 'react-icons/fi';
import { PROTOCOLE_METRICS } from '../../constants/homeData';

const ICONS = [FiCalendar, FiFilm, FiCpu, FiMapPin];
const KEYS = ['1', '2', '3', '4'];

const ProtocoleTemporel = () => {
  const { t } = useTranslation();

  return (
    <section className="home-section home-protocole" aria-label="Le protocole temporel">
      <div className="home-container">
        <h2 className="home-section-title">{t('home.protocole.sectionTitle')}</h2>
        <p className="home-section-subtitle">{t('home.protocole.subtitle')}</p>
        <div className="home-protocole-grid">
          {PROTOCOLE_METRICS.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <article key={item.id} className={`home-card home-card--${item.color}`}>
                <div className="home-card-icon">
                  <Icon size={24} strokeWidth={2} aria-hidden />
                </div>
                <span className="home-protocole-value">{item.value}</span>
                <p className="home-card-desc">{t(`home.protocole.label${KEYS[i]}`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProtocoleTemporel;
