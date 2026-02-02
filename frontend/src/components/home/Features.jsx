import React from 'react';
import { FiClock, FiGift, FiGlobe, FiAward } from 'react-icons/fi';
import { FEATURES } from '../../constants/homeData';

const ICONS = { clock: FiClock, gift: FiGift, globe: FiGlobe, award: FiAward };
const iconKeys = ['clock', 'gift', 'globe', 'award'];

const Features = () => {
  return (
    <section className="home-section home-features" id="en-savoir-plus" aria-label="Points clés">
      <div className="home-container">
        <div className="home-features-grid">
          {FEATURES.map((item, i) => {
            const Icon = ICONS[iconKeys[i]];
            return (
              <article key={item.id} className={`home-card home-card--${item.color}`}>
                <div className="home-card-icon">
                  <Icon size={28} strokeWidth={2} aria-hidden />
                </div>
                <h3 className="home-card-title">{item.title}</h3>
                <p className="home-card-desc">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
