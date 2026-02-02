import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';

const MarsAINight = () => {
  return (
    <section className="home-section home-mars-night" aria-label="Mars A.I. Night">
      <div className="home-container home-mars-night-inner">
        <div className="home-mars-night-content">
          <h2 className="home-section-title">
            MARS.A.I <span className="home-section-title-pink">NIGHT</span>
          </h2>
          <p className="home-section-desc">
            Soirée de clôture du festival : projections, networking et remise des prix. Réservez votre place.
          </p>
        </div>
        <div className="home-mars-night-card">
          <div className="home-mars-night-date">
            <FiClock size={24} strokeWidth={2} aria-hidden />
            <span>13 JUIN</span>
          </div>
          <Link to="/deposer-un-film" className="home-btn-gradient">RÉSERVER MA PLACE</Link>
        </div>
      </div>
    </section>
  );
};

export default MarsAINight;
