// MarsAINight , section soirée de clôture du festival ------------//
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { FiClock } from 'react-icons/fi';

const MarsAINight = () => {
  const { t } = useTranslation();
  return (
    <section className="night-section" aria-label="Mars A.I. Night">
      <div className="container">
        <div className="night-text">
          <h2 className="section-title">
            MARS.A.I <span className="title-pink">NIGHT</span>
          </h2>
          <p className="section-desc">{t('home.night.desc')}</p>
        </div>
        <div className="night-card">
          <div className="night-date">
            <FiClock size={24} strokeWidth={2} aria-hidden />
            <span>{t('home.night.date')}</span>
          </div>
          <Link to={ROUTES.PARTICIPATE} className="btn-reserve">{t('home.night.cta')}</Link>
        </div>
      </div>
    </section>
  );
};

export default MarsAINight;
