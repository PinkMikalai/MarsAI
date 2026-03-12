import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { videoApi, getCoverUrl } from '../../service/galleryService';
import ProgressBar from '../../components/ui/feedback/ProgressBar';
import SearchBar from '../../components/ui/search/SearchBar';
import Icons from '../../components/ui/common/Icons';
import { FILMS_PER_PAGE } from '../../constants/galleryData';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminAssignment from '../Admin/AdminAssignments.jsx';

let _cachedVideos = null;

//=====================================================
// GALLERY FILMS
//=====================================================

const GalleryFilms = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [selectedVideoIds, setSelectedVideoIds] = useState(new Set());
    const canAssign = user && (user.role_id === 1 || user.role_id === 3);

    const [videos, setVideos] = useState(_cachedVideos || []);
    const [loading, setLoading] = useState(!_cachedVideos);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ adminStatus: '', selectionStatus: '', rated: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [scrollY, setScrollY] = useState(0);
    const [imageErrors, setImageErrors] = useState(new Set());

    // chargement initial de toutes les videos (melangees, mises en cache)
    async function fetchAllVideos() {
        console.log("fetchAllVideos — chargement initial");
        setLoading(true);
        setError(null);

        try {
            const res = await videoApi.getAllVideos();
            console.log("videos recuperees:", res);

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
        } catch (error) {
            console.error("erreur fetchAllVideos:", error);
            setError(error?.message || t('gallery.loadError'));
            setVideos([]);
        } finally {
            setLoading(false);
        }
    }


    // recherche via api — tags, admin_status et selection_status geres cote backend
    async function fetchSearchVideos(query, activeFilters) {
        console.log("fetchSearchVideos — query:", query, "| filters:", activeFilters);
        setSearchLoading(true);
        setError(null);

        try {
            const res = await videoApi.searchVideos(query, activeFilters);
            console.log("resultats recherche:", res);

            if (res?.success && Array.isArray(res.data)) {
                setVideos(res.data);
            } else {
                setVideos([]);
            }
        } catch (error) {
            console.error("erreur fetchSearchVideos:", error);
            setError(error?.message || t('gallery.loadError'));
            setVideos([]);
        } finally {
            setSearchLoading(false);
        }
    }
    // interface permettant aux admins connectés d'assigner des films à des selectionneurs
    const openAssignmentPanel = (film) => {
        setSelectedVideos([film]);
        setIsAssignmentOpen(true);
    };
    // chargement initial
    useEffect(() => {
        if (_cachedVideos) { setVideos(_cachedVideos); return; }
        fetchAllVideos();
    }, []);

    // declenchement recherche ou filtre
    useEffect(() => {
        const hasFilter = filters.adminStatus || filters.selectionStatus || filters.rated;
        if (!search.trim() && !hasFilter) {
            setError(null);
            setVideos(_cachedVideos || []);
            return;
        }
        fetchSearchVideos(search, filters);
    }, [search, filters]);

    // parallax scroll
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => { setScrollY(window.scrollY); ticking = false; });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    function handleSearch(query) {
        console.log("handleSearch — query:", query);
        setSearch(query);
        setCurrentPage(1);
    }

    function handleFilterChange(newFilters) {
        console.log("handleFilterChange — filters:", newFilters);
        setFilters(prev => ({ ...prev, ...newFilters }));
        setCurrentPage(1);
    }

    function handleImageError(filmId) {
        setImageErrors(prev => new Set([...prev, filmId]));
    }
    // mise en place l'interface d'assignation disponible que pour les admins
    // selectionner et desélecvtionner une videos

    const toggleVideoSelection = (videoId) => {
        setSelectedVideoIds(prev => {
            const next = new Set(prev);
            if (next.has(videoId)) next.delete(videoId);
            else next.add(videoId);
            return next;
        });
    };
    // selectionner des videos pour ouvrir l'interface 
    const openMassAssignment = () => {
        const videosToAssign = videos.filter(v => selectedVideoIds.has(v.id));
        setSelectedVideos(videosToAssign);
        setIsAssignmentOpen(true);
    };


    const totalPages = Math.max(1, Math.ceil(videos.length / FILMS_PER_PAGE));
    const filmsOnPage = videos.slice((currentPage - 1) * FILMS_PER_PAGE, currentPage * FILMS_PER_PAGE);

    //=====================================================
    // RENDER
    //=====================================================

    return (
        <div className="galerie-page">
            <div
                className="galerie-parallax-bg"
                style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }}
                aria-hidden
            />

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

                <SearchBar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    loading={searchLoading}
                    resultsCount={videos.length}
                />

                {error && <p className="galerie-error" role="alert">{error}</p>}

                {!loading && (
                    <>
                        {videos.length === 0 ? (
                            <p className="galerie-empty">{t('gallery.noFilms')}</p>
                        ) : (
                            <>
                                <div className="galerie-grid">
                                    {filmsOnPage.map((film) => {
                                        console.log("Données du film :", film)
                                        const title = film.title || film.title_en || t('gallery.noTitle');
                                        const director = [film.realisator_firstname, film.realisator_lastname]
                                            .filter(Boolean).join(' ') || '–';
                                        const coverUrl = getCoverUrl(film.cover);
                                        const hasImageError = imageErrors.has(film.id);

                                        return (
                                            <article key={film.id} className={`galerie-card ${selectedVideoIds.has(film.id) ? 'selected' : ''}`} style={{ position: 'relative' }}>

                                                {canAssign && (
                                                    <div className="admin-selection-check">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedVideoIds.has(film.id)}
                                                            onChange={() => toggleVideoSelection(film.id)}
                                                        />
                                                    </div>
                                                )}
                                                <Link to={`/watch/${film.id}`} className="galerie-card-link">
                                                    <div className="galerie-card-image-wrap">
                                                        {coverUrl && !hasImageError ? (
                                                            <img
                                                                src={coverUrl}
                                                                alt={title}
                                                                className="galerie-card-image galerie-card-image--img"
                                                                loading="lazy"
                                                                decoding="async"
                                                                onError={() => handleImageError(film.id)}
                                                            />
                                                        ) : (
                                                            <div className="galerie-card-image galerie-card-image--default">
                                                                <div className="galerie-card-image-placeholder">
                                                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                                        <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                                {canAssign && (
                                                    <button
                                                        className="quick-assign-btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            openAssignmentPanel(film);
                                                        }}
                                                    >
                                                        Assign
                                                        
                                                        {film.assignment_count > 0 && (
                                                            <span className="assign-badge">
                                                                ({film.assignment_count})
                                                            </span>
                                                        )}
                                                    </button>
                                                )}
                                            </article>
                                        );
                                    })}
                                </div>

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
                                    PAGE {currentPage} SUR {totalPages} – {videos.length} FILM{videos.length > 1 ? 'S' : ''} {t('gallery.found', { count: videos.length, defaultValue: 'TROUVÉ' })}
                                </p>
                            </>
                        )}
                    </>
                )}
            </main>
            {canAssign && (
                <AdminAssignment
                    videos={selectedVideos}
                    admin_id={user.id}
                    isOpen={isAssignmentOpen}
                    onClose={() => setIsAssignmentOpen(false)}
                    onSuccess={(videoIds) => {
                        // console.log(`Assignation réussie pour ${count} sélectionneurs`);
                        setIsAssignmentOpen(false);
                        setSelectedVideoIds(new Set());
                        fetchAllVideos();
                    }}
                />
            )}
            {canAssign && selectedVideoIds.size > 0 && (
                <div className="admin-selection-banner">
                    <span>{selectedVideoIds.size} film(s) sélectionné(s)</span>
                    <button onClick={openMassAssignment}>Assigner la sélection</button>
                    <button
                        style={{ background: 'transparent', border: '1px solid #555' }}
                        onClick={() => setSelectedVideoIds(new Set())}
                    >
                        Annuler
                    </button>
                </div>
            )}
        </div>
    );
};

export default GalleryFilms;

