// MarsAINight , section soirée de clôture du festival ------------//
import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';

const MarsAINight = () => (
  <section className="night-section" aria-label="Mars A.I. Night">
    <div className="container">
      <div className="night-text">
        <h2 className="section-title">
          MARS.A.I <span className="title-pink">NIGHT</span>
        </h2>
        <p className="section-desc">
          Soirée de clôture du festival : projections, networking et remise des prix. Réservez votre place.
        </p>
      </div>
      <div className="night-card">
        <div className="night-date">
          <FiClock size={24} strokeWidth={2} aria-hidden />
          <span>13 JUIN</span>
        </div>
        <Link to="/deposer-un-film" className="btn-reserve">RÉSERVER MA PLACE</Link>
      </div>
    </div>
  </section>
);

export default MarsAINight;
