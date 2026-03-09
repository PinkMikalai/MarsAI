import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Reveal from '../ui/common/Reveal';
import { fadeUp } from '../../utils/animations';

const ChiffresProjetes = () => {
  const { t } = useTranslation();
  return (
    <section className="home-section home-chiffres" aria-label="Chiffres projetés">
      <div className="home-container">
        <Reveal as="h2" className="home-section-title">
          {t('home.chiffres.sectionTitle')}{' '}
          <span className="home-section-title-pink">{t('home.chiffres.sectionAccent')}</span>
        </Reveal>
        <Reveal stagger as="div" className="home-chiffres-grid">
          <motion.article className="home-chiffre-card" variants={fadeUp}>
            <span className="home-chiffre-value">{t('home.chiffres.stat1Value')}</span>
            <p className="home-card-desc">{t('home.chiffres.stat1Label')}</p>
          </motion.article>
          <motion.article className="home-chiffre-card" variants={fadeUp}>
            <span className="home-chiffre-value">{t('home.chiffres.stat2Value')}</span>
            <p className="home-card-desc">{t('home.chiffres.stat2Label')}</p>
          </motion.article>
        </Reveal>
      </div>
    </section>
  );
};

export default ChiffresProjetes;
