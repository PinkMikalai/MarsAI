import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { videosService, getCoverImageUrl } from '../../service/galerieService';
import TagFilter from '../../components/ui/tags/TagFilter';
import { FILMS_PER_PAGE } from '../../constants/galerieData';
import Icons from '../../components/ui/common/Icons';

const GalerieFilms = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [videosWithTags, setVideosWithTags] = useState([]);
  const [selectedFilterTags, setSelectedFilterTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTags, setLoadingTags] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour charger les tags de toutes les vidéos
  const loadVideoTags = useCallback(async (videosList) => {
    try {
      setLoadingTags(true);
      const videosWithTagsPromises = videosList.map(async (video) => {
        const tags = await videosService.getVideoTags(video.id);
        return {
          ...video,
          tags: tags.map(t => t.name?.toLowerCase() || t.toLowerCase())
        };
      });
      
      const videosWithTagsData = await Promise.all(videosWithTagsPromises);
      setVideosWithTags(videosWithTagsData);
    } catch (error) {
      console.error('Erreur lors du chargement des tags:', error);
      // En cas d'erreur, on garde les vidéos sans tags
      setVideosWithTags(videosList.map(v => ({ ...v, tags: [] })));
    } finally {
      setLoadingTags(false);
    }
  }, []);

  // Fetch des 25 vidéos depuis la base de données (insert.sql)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    
    console.log('🔵 GalerieFilms: Début du fetch des vidéos');
    // choper les videos de base de donnees
    videosService.getAllVideos()
      .then((res) => {
        console.log('🟢 GalerieFilms: Réponse reçue:', res);
        if (!cancelled && res?.success && Array.isArray(res.data)) {
          console.log('✅ GalerieFilms: Nombre de vidéos:', res.data.length);
          console.log('✅ GalerieFilms: Première vidéo:', res.data[0]);
          setVideos(res.data);
          
          
          if (res.data.length > 0) {
            setLoadingTags(true);
            loadVideoTags(res.data);
          }
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
  }, [loadVideoTags]);

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

  // Filtrer les vidéos selon les tags sélectionnés
  const filteredVideos = useMemo(() => {
    if (selectedFilterTags.length === 0) {
      return videosWithTags.length > 0 ? videosWithTags : videos;
    }

    return (videosWithTags.length > 0 ? videosWithTags : videos).filter((video) => {
      const videoTags = video.tags || [];
      // Une vidéo correspond si elle a au moins un des tags sélectionnés
      return selectedFilterTags.some(tag => videoTags.includes(tag));
    });
  }, [selectedFilterTags, videosWithTags, videos]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilterTags]);

  const totalPages = Math.max(1, Math.ceil(filteredVideos.length / FILMS_PER_PAGE));
  const start = (currentPage - 1) * FILMS_PER_PAGE;
  const filmsOnPage = filteredVideos.slice(start, start + FILMS_PER_PAGE);

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
            {/* Filtre de tags */}
            <TagFilter 
              selectedTags={selectedFilterTags}
              onFilterChange={setSelectedFilterTags}
            />

            {loadingTags && (
              <p className="galerie-loading-tags">Chargement des tags…</p>
            )}

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
                          <span className="galerie-card-meta-label">Origine</span> {film.country}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {filteredVideos.length === 0 && videos.length > 0 && (
              <p className="galerie-empty">
                Aucun film ne correspond aux filtres sélectionnés.
              </p>
            )}
            {videos.length === 0 && <p className="galerie-empty">Aucun film pour le moment.</p>}

            {filteredVideos.length > 0 && (
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
                  PAGE {currentPage} SUR {totalPages} – {filteredVideos.length} FILM{filteredVideos.length > 1 ? 'S' : ''} TROUVÉ{filteredVideos.length > 1 ? 'S' : ''}
                  {selectedFilterTags.length > 0 && ` (filtré${selectedFilterTags.length > 1 ? 's' : ''} par ${selectedFilterTags.length} tag${selectedFilterTags.length > 1 ? 's' : ''})`}
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
