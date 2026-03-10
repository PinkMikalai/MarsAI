// MarsAINight , section soirée de clôture du festival ------------//
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '../../constants/routes';
import Reveal from '../ui/common/Reveal';
import { fadeUp, staggerContainer } from '../../utils/animations';

const MarsAINight = () => {
  const { t } = useTranslation();
  return (
    <Reveal as="section" variant={staggerContainer} className="night-section" aria-label="Mars A.I. Night">
      <div className="container">
        <motion.div className="night-text" variants={fadeUp}>
          <h2 className="section-title">
            MARS.A.I <span className="title-pink">NIGHT</span>
          </h2>
          <p className="section-desc">{t('home.night.desc')}</p>
        </motion.div>
        <motion.div className="night-card" variants={fadeUp}>
          <div className="night-date">
            <ClockIcon width={24} height={24} aria-hidden />
            <span>{t('home.night.date')}</span>
          </div>
          <Link to={ROUTES.PARTICIPATE} className="btn-reserve">{t('home.night.cta')}</Link>
        </motion.div>
      </div>
    </Reveal>
  );
};

export default MarsAINight;
