import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { GALERIE_FILMS, FILMS_PER_PAGE } from '../../constants/galerieData';
import { ROUTES } from '../../constants/routes';
import Icons from '../../components/ui/Icons';

const GalerieFilms = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const totalPages = Math.ceil(GALERIE_FILMS.length / FILMS_PER_PAGE);
  const start = (currentPage - 1) * FILMS_PER_PAGE;
  const filmsOnPage = GALERIE_FILMS.slice(start, start + FILMS_PER_PAGE);

  return (
    <div className="galerie-page">
      {/* Parallax background */}
      <div
        className="galerie-parallax-bg"
        style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }}
        aria-hidden
      >
        <div className="galerie-parallax-shape galerie-parallax-shape--1" />
        <div className="galerie-parallax-shape galerie-parallax-shape--2" />
        <div className="galerie-parallax-shape galerie-parallax-shape--3" />
      </div>

      <header className="galerie-header">
        <Navbar />
      </header>

      <main className="galerie-main">
        <h1 className="galerie-title">
          LA GALERIE <span className="galerie-title-accent">DES FILMS</span>
        </h1>

        <div className="galerie-grid">
          {filmsOnPage.map((film) => (
            <article key={film.id} className="galerie-card">
              <div
                className="galerie-card-image"
                style={{ background: film.imageGradient }}
              />
              <h2 className="galerie-card-title">{film.title}</h2>
            </article>
          ))}
        </div>

        <nav className="galerie-pagination" aria-label="Pagination">
          <button
            type="button"
            className="galerie-pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Page précédente"
          >
            <Icons.ChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              className={`galerie-pagination-num ${p === currentPage ? 'galerie-pagination-num--current' : ''}`}
              onClick={() => setCurrentPage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className="galerie-pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Page suivante"
          >
            <Icons.ChevronRight />
          </button>
        </nav>
        <p className="galerie-pagination-info">
          PAGE {currentPage} SUR {totalPages} – {GALERIE_FILMS.length} FILMS TROUVÉS
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default GalerieFilms;
