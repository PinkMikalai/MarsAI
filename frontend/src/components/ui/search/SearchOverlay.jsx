import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import { videoApi, getCoverUrl } from '../../../service/galleryService';
import SearchBar from './SearchBar';

// =====================================================
// PANNEAU RECHERCHE — même comportement que InfoPanel
// Slide depuis la droite, scroll interne, overscroll contain
// =====================================================
const SearchOverlay = ({ isOpen, onClose, onSelectFilm }) => {
    const timerRef = useRef(null);
    const [videos, setVideos]   = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch]   = useState('');
    const [filters, setFilters] = useState({ adminStatus: '', selectionStatus: '', rated: '' });

    // chargement initial — toutes les vidéos dès l'ouverture
    useEffect(() => {
        if (!isOpen) return;
        let cancelled = false;
        setLoading(true);
        videoApi.getAllVideos()
            .then((res) => {
                if (cancelled) return;
                setVideos(res?.data && Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => { if (!cancelled) setVideos([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [isOpen]);

    // recherche/filtres avec debounce
    useEffect(() => {
        const hasFilter = filters.adminStatus || filters.selectionStatus || filters.rated;
        if (!search.trim() && !hasFilter) {
            // reset → recharge toutes les vidéos
            setLoading(true);
            videoApi.getAllVideos()
                .then((res) => setVideos(res?.data && Array.isArray(res.data) ? res.data : []))
                .catch(() => setVideos([]))
                .finally(() => setLoading(false));
            return;
        }
        clearTimeout(timerRef.current);
        setLoading(true);
        timerRef.current = setTimeout(async () => {
            try {
                const res = await videoApi.searchVideos(search, filters);
                setVideos(res?.data && Array.isArray(res.data) ? res.data : []);
            } catch {
                setVideos([]);
            } finally {
                setLoading(false);
            }
        }, 350);
        return () => clearTimeout(timerRef.current);
    }, [search, filters]);

    // Échap ferme le panneau
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const handleSearch       = useCallback((q) => setSearch(q), []);
    const handleFilterChange = useCallback((f) => setFilters((prev) => ({ ...prev, ...f })), []);

    return (
        <div
            className={`wf-search-panel ${isOpen ? 'wf-search-panel--open' : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            {/* en-tête sticky */}
            <div className="wf-search-panel-header">
                <span className="wf-search-panel-title">Recherche</span>
                <button className="wf-admin-panel-close" onClick={onClose} aria-label="Fermer">✕</button>
            </div>

            {/* SearchBar avec droits (admin / selector / public) */}
            <div className="wf-search-panel-bar">
                <SearchBar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    loading={loading}
                    resultsCount={videos.length}
                    debounceMs={350}
                />
            </div>

            {/* liste des résultats — scroll interne */}
            <div className="wf-search-panel-results">
                {!loading && videos.length === 0 && (
                    <p className="wf-search-empty">
                        {search.trim()
                            ? `Aucun résultat pour « ${search} »`
                            : 'Aucun film disponible.'
                        }
                    </p>
                )}
                {videos.map((film) => {
                    const title    = film.title || film.title_en || 'Sans titre';
                    const director = [film.realisator_firstname, film.realisator_lastname].filter(Boolean).join(' ') || '—';
                    const cover    = getCoverUrl(film.cover);
                    return (
                        <button
                            key={film.id}
                            className="wf-search-result-item"
                            onClick={() => onSelectFilm(film.id)}
                        >
                            <div className="wf-search-result-thumb">
                                {cover
                                    ? <img src={cover} alt={title} loading="lazy" />
                                    : <div className="wf-search-result-thumb-placeholder"><FiSearch size={18} /></div>
                                }
                            </div>
                            <div className="wf-search-result-info">
                                <span className="wf-search-result-title">{title}</span>
                                <span className="wf-search-result-meta">Réalisateur {director}</span>
                                {film.country && (
                                    <span className="wf-search-result-country">{film.country}</span>
                                )}
                            </div>
                            <span className="wf-search-result-arrow" aria-hidden>›</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchOverlay;
