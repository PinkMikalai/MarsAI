import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PlayIcon, WrenchScrewdriverIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Reveal from '../ui/common/Reveal';
import { fadeUp } from '../../utils/animations';

const ICONS      = [PlayIcon, WrenchScrewdriverIcon, TrophyIcon];
const HIGHLIGHTS = [true, false, false];
const KEYS       = ['1', '2', '3'];

const ConferencesGratuites = () => {
  const { t } = useTranslation();
  return (
    <section className="home-section home-conferences" aria-label="Conférences gratuites">
      <div className="home-container">
        <Reveal as="h2" className="home-section-title">
          {t('home.conferences.sectionTitle')}{' '}
          <span className="home-section-title-accent">{t('home.conferences.sectionAccent')}</span>
        </Reveal>
        <Reveal as="p" delay={0.1} className="home-section-desc">
          {t('home.conferences.desc')}
        </Reveal>
        <Reveal stagger as="div" className="home-conferences-grid">
          {KEYS.map((k, i) => {
            const Icon = ICONS[i];
            return (
              <motion.article
                key={k}
                className={`home-conf-card${HIGHLIGHTS[i] ? ' home-conf-card--highlight' : ''}`}
                variants={fadeUp}
              >
                <div className="home-conf-card-icon">
                  <Icon width={28} height={28} aria-hidden />
                </div>
                <h3 className="home-conf-card-title">{t(`home.conferences.type${k}Title`)}</h3>
                <p className="home-card-desc">{t(`home.conferences.type${k}Desc`)}</p>
              </motion.article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
};

export default ConferencesGratuites;
