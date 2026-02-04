import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { videosService, getCoverImageUrl } from '../../service/galerieService';
import { FILMS_PER_PAGE } from '../../constants/galerieData';
import Icons from '../../components/ui/Icons';

const GalerieFilms = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch des 25 vidéos depuis la base de données (insert.sql)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    
    console.log('🔵 GalerieFilms: Début du fetch des vidéos');
    
    videosService.getAllVideos()
      .then((res) => {
        console.log('🟢 GalerieFilms: Réponse reçue:', res);
        if (!cancelled && res?.success && Array.isArray(res.data)) {
          console.log('✅ GalerieFilms: Nombre de vidéos:', res.data.length);
          console.log('✅ GalerieFilms: Première vidéo:', res.data[0]);
          setVideos(res.data);
        } else if (!cancelled) {
          console.warn('⚠️ GalerieFilms: Réponse invalide:', res);
          setVideos([]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('🔴 GalerieFilms: Erreur lors du fetch:', err);
          console.error('🔴 GalerieFilms: Détails:', err.response?.data);
          setError(err?.response?.data?.error || err?.message || 'Impossible de charger les vidéos.');
          setVideos([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          console.log('🏁 GalerieFilms: Fetch terminé');
          setLoading(false);
        }
      });
    
    return () => { cancelled = true; };
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(videos.length / FILMS_PER_PAGE));
  const start = (currentPage - 1) * FILMS_PER_PAGE;
  const filmsOnPage = videos.slice(start, start + FILMS_PER_PAGE);

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

        {loading && <p className="galerie-loading">Chargement des films…</p>}
        {error && <p className="galerie-error" role="alert">{error}</p>}

        {!loading && !error && (
          <>
            <div className="galerie-grid">
              {filmsOnPage.map((film) => {
                const title = film.title || film.title_en || 'Sans titre';
                const director = [film.realisator_firstname, film.realisator_lastname].filter(Boolean).join(' ') || '–';
                const coverUrl = getCoverImageUrl(film.cover);
                
                return (
                  <article key={film.id} className="galerie-card">
                    <div className="galerie-card-image-wrap">
                      {coverUrl ? (
                        <img src={coverUrl} alt="" className="galerie-card-image galerie-card-image--img" />
                      ) : (
                        <div className="galerie-card-image" style={{ background: 'linear-gradient(135deg, #2B7FFF 0%, #9810FA 100%)' }} />
                      )}
                    </div>
                    <div className="galerie-card-body">
                      <h2 className="galerie-card-title">{title}</h2>
                      <p className="galerie-card-meta">
                        <span className="galerie-card-meta-label">Réalisateur</span> {director}
                      </p>
                      {film.country && (
                        <p className="galerie-card-meta">
                          <Icons.Globe /> <span className="galerie-card-meta-label">Origine</span> {film.country}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {videos.length === 0 && <p className="galerie-empty">Aucun film pour le moment.</p>}

            {videos.length > 0 && (
              <>
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
                  PAGE {currentPage} SUR {totalPages} – {videos.length} FILMS TROUVÉS
                </p>
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default GalerieFilms;
