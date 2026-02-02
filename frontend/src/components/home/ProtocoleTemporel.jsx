import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiFilm, FiCpu, FiMapPin } from 'react-icons/fi';
import { PROTOCOLE_METRICS } from '../../constants/homeData';

const ICONS = [FiCalendar, FiFilm, FiCpu, FiMapPin];

const ProtocoleTemporel = () => {
  return (
    <section className="home-section home-protocole" aria-label="Le protocole temporel">
      <div className="home-container">
        <h2 className="home-section-title">LE PROTOCOLE TEMPOREL</h2>
        <p className="home-section-subtitle">En quelques chiffres</p>
        <div className="home-protocole-grid">
          {PROTOCOLE_METRICS.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <article key={item.id} className={`home-card home-card--${item.color}`}>
                <div className="home-card-icon">
                  <Icon size={24} strokeWidth={2} aria-hidden />
                </div>
                <span className="home-protocole-value">{item.value}</span>
                <p className="home-card-desc">{item.label}</p>
              </article>
            );
          })}
        </div>
        <Link to="/deposer-un-film" className="home-btn-gradient">S&apos;INSCRIRE</Link>
      </div>
    </section>
  );
};

export default ProtocoleTemporel;
