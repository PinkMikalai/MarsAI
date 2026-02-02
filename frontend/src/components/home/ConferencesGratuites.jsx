import React from 'react';
import { FiPlay, FiTool, FiAward } from 'react-icons/fi';
import { CONFERENCE_TYPES } from '../../constants/homeData';

const ICONS = [FiPlay, FiTool, FiAward];

const ConferencesGratuites = () => {
  return (
    <section className="home-section home-conferences" aria-label="Conférences gratuites">
      <div className="home-container">
        <h2 className="home-section-title">
          DEUX JOURNÉES DE <span className="home-section-title-accent">CONFÉRENCES GRATUITES</span>
        </h2>
        <p className="home-section-desc">
          Projections, workshops et cérémonie de remise des prix. Entrée libre.
        </p>
        <a href="#programme" className="home-section-link">VOIR LE PROGRAMME &gt;</a>
        <div className="home-conferences-grid">
          {CONFERENCE_TYPES.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <article
                key={item.id}
                className={`home-conf-card ${item.highlight ? 'home-conf-card--highlight' : ''}`}
              >
                <div className="home-conf-card-icon">
                  <Icon size={28} strokeWidth={2} aria-hidden />
                </div>
                <h3 className="home-conf-card-title">{item.title}</h3>
                <p className="home-card-desc">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ConferencesGratuites;
