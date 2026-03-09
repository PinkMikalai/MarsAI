import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { videoApi, getCoverUrl } from '../../service/galleryService';
import ProgressBar from '../../components/ui/feedback/ProgressBar';
import { FILMS_PER_PAGE } from '../../constants/galleryData';
import Icons from '../../components/ui/common/Icons';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminAssignment from '../Admin/AdminAssignments.jsx'; 

let _cachedVideos = null;

const GalerieFilms = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'Super_admin';

 
  const [scrollY, setScrollY] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [videos, setVideos] = useState(_cachedVideos || []);
  const [loading, setLoading] = useState(!_cachedVideos);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  // États pour l'assignation Admin
  const [isAssignPanelOpen, setIsAssignPanelOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);


  useEffect(() => {
    if (_cachedVideos) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

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
      .finally(() => { 
        if (!cancelled) setLoading(false); 
      });

    return () => { cancelled = true; };
  }, [t]);

  
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
   
      <div
        className="galerie-parallax-bg"
        style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }}
        aria-hidden="true"
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
console.log("DEBUG GALERIE - Vidéo sélectionnée :", selectedVideo);
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
                            onError={() => setImageErrors(prev => new Set([...prev, film.id]))}
                          />
                        ) : (
                          <div className="galerie-card-image galerie-card-image--default">
                            <div className="galerie-card-image-placeholder">
                              <Icons.Image size={48} />
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
                      </div>
                    </Link>

                    {/* Bouton pour eclencher l'assignation disponible seulement pour les admins */}
                    {isAdmin && (
                      <div className="admin-actions-overlay">
                        <button 
                          className='quick-assign-btn'
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedVideo(film);
                            setIsAssignPanelOpen(true);
                          }}
                        >
                          <Icons.UserPlus /> {t('admin.assign')}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {videos.length === 0 && <p className="galerie-empty">{t('gallery.noFilms')}</p>}

           
            {videos.length > FILMS_PER_PAGE && (
              <nav className="galerie-pagination">
                <button
                  className="galerie-pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  <Icons.ChevronLeft />
                </button>
                
             
                
                <button
                  className="galerie-pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <Icons.ChevronRight />
                </button>
              </nav>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Systéme d'assignation */}
      {isAdmin && (
        <AdminAssignment
          key={selectedVideo?.id}
          isOpen={isAssignPanelOpen}
          videos={[selectedVideo]}
          onClose={() => {
            setIsAssignPanelOpen(false);
            setSelectedVideo(null);
          }}
          onSuccess={(videoId, count) => {
            console.log(`Succès : ${count} membres assignés à la vidéo ${videoId}`);
            setIsAssignPanelOpen(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
};

export default GalerieFilms;