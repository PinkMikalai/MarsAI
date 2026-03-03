import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { videoApi, getCoverUrl } from '../../service/galleryService';
import ProgressBar from '../../components/ui/feedback/ProgressBar';
import { FILMS_PER_PAGE } from '../../constants/galleryData';
import Icons from '../../components/ui/common/Icons';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminAssignment from '../Admin/AdminAssignments.jsx';
import SearchBar from '../../components/ui/search/SearchBar';

let _cachedVideos = null;

const GalerieFilms = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || 'Super_admin';
  const [scrollY, setScrollY] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [videos, setVideos] = useState(_cachedVideos || []);
  const [loading, setLoading] = useState(!_cachedVideos);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());
  // Etats pour l'assignation des films aux selectionneurs par l'admin
  const [isAssignPanelOpen, setIsAssignPanelOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selector, setSelector] = useState([]);

  // Etats pour la recherche
  const [search, setSearch] = useState('');
  const [selectionStatus, setSelectionStatus] = useState(null);
  const [adminStatus, setAdminStatus] = useState(null);
  const [rated, setRated] = useState(null);
  const [unrated, setUnrated] = useState(null);

  useEffect(() => {
    if (_cachedVideos) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    //ici on gene notre liste de films aleatoirement

    videoApi.getAllVideos()
      .then((res) => {
        if (cancelled) return;
        if (res?.success && Array.isArray(res.data)) {
          const shuffled = [...res.data];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          _cachedVideos = shuffled;
          setVideos(shuffled);
        } else {
          setVideos([]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.error || err?.message || t('gallery.loadError'));
          setVideos([]);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

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

  

  const filteredVideos = videos;
  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / FILMS_PER_PAGE));
  const start = (currentPage - 1) * FILMS_PER_PAGE;
  const filmsOnPage = filteredVideos.slice(start, start + FILMS_PER_PAGE);

  return (
    <div className="galerie-page">
      <div
        className="galerie-parallax-bg"
        style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }}
        aria-hidden
      >
     
      </div>


      <main className="galerie-main">
        <h1 className="galerie-title">
          {t('gallery.title')} <span className="galerie-title-accent">{t('gallery.titleAccent')}</span>
        </h1>

        {loading && (
          <ProgressBar
            label={t('gallery.loadingFilms')}
            value={45}
            variant="brand"
            className="my-8 w-full"
          />
        )}
        {error && <p className="galerie-error" role="alert">{error}</p>}

        {!loading && !error && (
          <>
            <div className="galerie-grid">
              {filmsOnPage.map((film) => {
                const title = film.title || film.title_en || t('gallery.noImage');
                const director = [film.realisator_firstname, film.realisator_lastname].filter(Boolean).join(' ') || '–';
                const coverUrl = getCoverUrl(film.cover);
                const hasImageError = imageErrors.has(film.id);

                return (
                  <article key={film.id} className="galerie-card">
                    <Link to={`/watch/${film.id}`} className="galerie-card-link">
                      <div className="galerie-card-image-wrap">
                        {coverUrl && !hasImageError ? (
                          <img
                            src={coverUrl}
                            alt={title}
                            className="galerie-card-image galerie-card-image--img"
                            loading="lazy"
                            decoding="async"
                            onError={() => setImageErrors(prev => new Set([...prev, film.id]))}
                          />
                        ) : (
                          <div className="galerie-card-image galerie-card-image--default">
                            <div className="galerie-card-image-placeholder">
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="galerie-card-image-placeholder-text">{t('gallery.noImage')}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="galerie-card-body">
                        <h2 className="galerie-card-title">{title}</h2>
                        <p className="galerie-card-meta">
                          <span className="galerie-card-meta-label">{t('gallery.director')}</span> {director}
                        </p>
                        {film.country && (
                          <p className="galerie-card-meta">
                            <span className="galerie-card-meta-label">{t('gallery.origin')}</span> {film.country}
                          </p>
                        )}
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>

            {videos.length === 0 && <p className="galerie-empty">{t('gallery.noFilms')}</p>}

            {filteredVideos.length > 0 && (
              <>
                <nav className="galerie-pagination" aria-label="Pagination">
                  <button
                    type="button"
                    className="galerie-pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-label={t('gallery.prevPage')}
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
                    aria-label={t('gallery.nextPage')}
                  >
                    <Icons.ChevronRight />
                  </button>
                </nav>
                <p className="galerie-pagination-info">
                  PAGE {currentPage} SUR {totalPages} – {filteredVideos.length} FILM{filteredVideos.length > 1 ? 'S' : ''} {t('gallery.found', { count: filteredVideos.length, defaultValue: 'TROUVÉ' })}
                </p>
              </>
            )}
          </>
        )}
      </main>

    </div>
  );
};

export default GalerieFilms;
