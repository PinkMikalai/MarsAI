import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiClock, FiGift, FiGlobe, FiAward } from 'react-icons/fi';

const ICONS = [FiClock, FiGift, FiGlobe, FiAward];
const COLORS = ['purple', 'green', 'pink', 'blue'];
const KEYS = ['1', '2', '3', '4'];

const Features = () => {
  const { t } = useTranslation();

  return (
    <section className="home-section home-features" id="en-savoir-plus" aria-label="Points clés">
      <div className="home-container">
        <div className="home-features-grid">
          {KEYS.map((k, i) => {
            const Icon = ICONS[i];
            return (
              <article key={k} className={`home-card home-card--${COLORS[i]}`}>
                <div className="home-card-icon">
                  <Icon size={28} strokeWidth={2} aria-hidden />
                </div>
                <h3 className="home-card-title">{t(`home.features.title${k}`)}</h3>
                <p className="home-card-desc">{t(`home.features.desc${k}`)}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
