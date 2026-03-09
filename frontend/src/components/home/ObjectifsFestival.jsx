import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { UserIcon, BoltIcon, ViewfinderCircleIcon } from '@heroicons/react/24/outline';
import Reveal from '../ui/common/Reveal';
import { fadeUp } from '../../utils/animations';

const ICONS  = [UserIcon, BoltIcon, ViewfinderCircleIcon];
const COLORS = ['green', 'teal', 'purple'];
const KEYS   = ['1', '2', '3'];

const ObjectifsFestival = () => {
  const { t } = useTranslation();
  return (
    <section className="home-section home-objectifs" aria-label="Objectifs du festival">
      <div className="home-container">
        <Reveal as="h2" className="home-section-title">
          {t('home.objectifs.sectionTitle')}{' '}
          <span className="home-section-title-accent">{t('home.objectifs.sectionAccent')}</span>
        </Reveal>
        <Reveal stagger as="div" className="home-objectifs-grid">
          {KEYS.map((k, i) => {
            const Icon = ICONS[i];
            return (
              <motion.article key={k} className={`home-card home-card--${COLORS[i]}`} variants={fadeUp}>
                <div className="home-card-icon">
                  <Icon width={28} height={28} aria-hidden />
                </div>
                <h3 className="home-card-title">{t(`home.objectifs.title${k}`)}</h3>
                <p className="home-card-desc">{t(`home.objectifs.desc${k}`)}</p>
              </motion.article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
};

export default ObjectifsFestival;
