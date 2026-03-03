import React from 'react';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
=======
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
import { FiCalendar, FiFilm, FiCpu, FiMapPin } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';
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
<<<<<<< HEAD
        <Link to={ROUTES.PARTICIPATE} className="home-btn-gradient">{t('home.protocole.cta')}</Link>
=======
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
      </div>
    </section>
  );
};

export default ProtocoleTemporel;
