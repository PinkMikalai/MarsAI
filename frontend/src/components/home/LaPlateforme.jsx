import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPinIcon } from '@heroicons/react/24/outline';
import Reveal from '../ui/common/Reveal';
import { fadeUp } from '../../utils/animations';

const LaPlateforme = () => {
  const { t } = useTranslation();
  return (
    <section className="home-section home-plateforme" aria-label="La plateforme">
      <div className="home-container">
        <Reveal as="h2" className="home-section-title home-section-title--outline">
          {t('home.plateforme.sectionTitle')}
        </Reveal>
        <Reveal as="p" delay={0.1} className="home-section-subtitle">
          {t('home.plateforme.subtitle')}
        </Reveal>
        <Reveal as="p" delay={0.15} className="home-section-desc">
          {t('home.plateforme.city')}
        </Reveal>
        <Reveal stagger as="div" className="home-plateforme-cards">
          <motion.article className="home-card home-card--dark" variants={fadeUp}>
            <h3 className="home-card-title">{t('home.plateforme.hall1Title')}</h3>
            <p className="home-card-desc">{t('home.plateforme.hall1Desc')}</p>
          </motion.article>
          <motion.article className="home-card home-card--dark" variants={fadeUp}>
            <h3 className="home-card-title">{t('home.plateforme.hall2Title')}</h3>
            <p className="home-card-desc">{t('home.plateforme.hall2Desc')}</p>
          </motion.article>
        </Reveal>
        <Reveal as="div" delay={0.2} className="home-map-wrap">
          <div className="home-map-placeholder">
            <MapPinIcon width={48} height={48} strokeWidth={1.5} aria-hidden />
            <span>{t('home.plateforme.map')}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default LaPlateforme;
