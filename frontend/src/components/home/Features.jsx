import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ClockIcon, GiftIcon, GlobeAltIcon, TrophyIcon } from '@heroicons/react/24/outline';
import Reveal from '../ui/common/Reveal';
import { fadeUp } from '../../utils/animations';

const ICONS   = [ClockIcon, GiftIcon, GlobeAltIcon, TrophyIcon];
const COLORS  = ['purple', 'green', 'pink', 'blue'];
const KEYS    = ['1', '2', '3', '4'];

const Features = () => {
  const { t } = useTranslation();
  return (
    <section className="home-section home-features" id="en-savoir-plus" aria-label="Points clés">
      <div className="home-container">
        <Reveal stagger as="div" className="home-features-grid">
          {KEYS.map((k, i) => {
            const Icon = ICONS[i];
            return (
              <motion.article key={k} className={`home-card home-card--${COLORS[i]}`} variants={fadeUp}>
                <div className="home-card-icon">
                  <Icon width={28} height={28} aria-hidden />
                </div>
                <h3 className="home-card-title">{t(`home.features.title${k}`)}</h3>
                <p className="home-card-desc">{t(`home.features.desc${k}`)}</p>
              </motion.article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
};

export default Features;
