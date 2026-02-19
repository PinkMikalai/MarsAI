import React from 'react';
import { SPONSORS } from '../../constants/homeData';

const Sponsors = () => {
  return (
    <section className="home-section home-sponsors" aria-label="Partenaires">
      <div className="home-container">
        <h2 className="home-section-title">
          ILS SOUTIENNENT <span className="home-section-title-blue">LE FUTUR</span>
        </h2>
        <div className="home-sponsors-grid">
          {SPONSORS.map((item) => (
            <div key={item.id} className="home-sponsor-card">
              <span className="home-sponsor-name">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default Sponsors;
