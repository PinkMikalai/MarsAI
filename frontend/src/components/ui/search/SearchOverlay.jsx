import React, { useEffect, useState, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import { videoApi, getCoverUrl } from '../../../service/galleryService';
import SearchBar from './SearchBar';
import { assignmentService } from '../../../service/assignmentService';
import { useAuth } from '../../../context/AuthContext';

// =====================================================
// PANNEAU RECHERCHE — slide depuis la droite
// La SearchBar gère le debounce + filtres + assignations
// =====================================================
const SearchOverlay = ({ isOpen, onClose, onSelectFilm }) => {
    const { user, isSelector } = useAuth();

    const [videos,                 setVideos]                 = useState([]);
    const [loading,                setLoading]                = useState(false);
    const [search,                 setSearch]                 = useState('');
    const [filters,                setFilters]                = useState({ adminStatus: '', selectionStatus: '', rated: '' });
    const [isFilteringAssignments, setIsFilteringAssignments] = useState(false);

    // ─── Helpers fetch ────────────────────────────────────
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const res = await videoApi.getAllVideos();
            setVideos(res?.data && Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('[SearchOverlay] fetchAll :', err.message);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSearch = useCallback(async (q, f) => {
        setLoading(true);
        try {
            const res = await videoApi.searchVideos(q, f);
            setVideos(res?.data && Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('[SearchOverlay] fetchSearch :', err.message);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // ─── Ouverture → reset état + chargement ─────────────
    useEffect(() => {
        if (!isOpen) return;
        setSearch('');
        setFilters({ adminStatus: '', selectionStatus: '', rated: '' });
        setIsFilteringAssignments(false);
        fetchAll();
    }, [isOpen]);

    // ─── Recherche / filtres (SearchBar a déjà debouncé) ─
    useEffect(() => {
        if (!isOpen || isFilteringAssignments) return;
        const hasFilter = filters.adminStatus || filters.selectionStatus || filters.rated;
        if (!search.trim() && !hasFilter) { fetchAll(); return; }
        fetchSearch(search, filters);
    }, [search, filters]);

    // ─── Fermeture par Échap ──────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    const handleSearch       = useCallback((q) => setSearch(q), []);
    const handleFilterChange = useCallback((f) => setFilters((prev) => ({ ...prev, ...f })), []);

    // ─── Assignations (selector uniquement) ──────────────
    const handleFetchMyAssignments = async () => {
        if (isFilteringAssignments) {
            setIsFilteringAssignments(false);
            await fetchAll();
            return;
        }
        setLoading(true);
        try {
            const res  = await assignmentService.getAssignmentByUser(user.id);
            const list = res?.success && Array.isArray(res.result) ? res.result : [];
            setVideos(list.map((item) => ({
                id:                   item.video_id,
                title:                item.video_title          || 'Sans titre',
                cover:                item.cover                || null,
                country:              item.country              || '',
                realisator_firstname: item.realisator_firstname  || '',
                realisator_lastname:  item.realisator_lastname   || '',
            })));
            setIsFilteringAssignments(true);
        } catch (err) {
            console.error('[SearchOverlay] assignations :', err.message);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    // ─── Rendu ────────────────────────────────────────────
    return (
        <div
            className={`wf-search-panel ${isOpen ? 'wf-search-panel--open' : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="wf-search-panel-header">
                <span className="wf-search-panel-title">Recherche</span>
                <button className="wf-admin-panel-close" onClick={onClose} aria-label="Fermer">✕</button>
            </div>

            <div className="wf-search-panel-bar">
                <SearchBar
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    loading={loading}
                    resultsCount={videos.length}
                    debounceMs={350}
                    onMyAssignments={isSelector ? handleFetchMyAssignments : undefined}
                    isFilteringAssignments={isFilteringAssignments}
                />
            </div>

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
