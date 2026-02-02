import React from 'react';
import { FiUser, FiZap, FiTarget } from 'react-icons/fi';
import { OBJECTIFS } from '../../constants/homeData';

const ICONS = [FiUser, FiZap, FiTarget];

const ObjectifsFestival = () => {
  return (
    <section className="home-section home-objectifs" aria-label="Objectifs du festival">
      <div className="home-container">
        <h2 className="home-section-title">
          OBJECTIFS DU <span className="home-section-title-accent">FESTIVAL</span>
        </h2>
        <div className="home-objectifs-grid">
          {OBJECTIFS.map((item, i) => {
            const Icon = ICONS[i];
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

export default ObjectifsFestival;
