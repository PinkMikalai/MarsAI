import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CalendarIcon, FilmIcon, CpuChipIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Reveal from '../ui/common/Reveal';
import { fadeUp } from '../../utils/animations';
import { PROTOCOLE_METRICS } from '../../constants/homeData';

const ICONS = [CalendarIcon, FilmIcon, CpuChipIcon, MapPinIcon];
const KEYS  = ['1', '2', '3', '4'];

const ProtocoleTemporel = () => {
  const { t } = useTranslation();
  return (
    <section className="home-section home-protocole" aria-label="Le protocole temporel">
      <div className="home-container">
        <Reveal as="h2" className="home-section-title">
          {t('home.protocole.sectionTitle')}
        </Reveal>
        <Reveal as="p" delay={0.1} className="home-section-subtitle">
          {t('home.protocole.subtitle')}
        </Reveal>
        <Reveal stagger as="div" className="home-protocole-grid">
          {PROTOCOLE_METRICS.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.article key={item.id} className={`home-card home-card--${item.color}`} variants={fadeUp}>
                <div className="home-card-icon">
                  <Icon width={24} height={24} aria-hidden />
                </div>
                <span className="home-protocole-value">{item.value}</span>
                <p className="home-card-desc">{t(`home.protocole.label${KEYS[i]}`)}</p>
              </motion.article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
};

export default ProtocoleTemporel;
