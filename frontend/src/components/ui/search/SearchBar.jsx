import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext.jsx';
import api from '../../../service/api';


//=====================================================
// SEARCHBAR
//=====================================================

const SearchBar = ({
    onSearch,
    onFilterChange,
    loading = false,
    resultsCount = null,
    placeholder,
    debounceMs = 400,
    onMyAssignments,
    isFilteringAssignments = false,
}) => {
    const { t } = useTranslation();
    const { isAdmin, isSuperAdmin, isSelector } = useAuth();
  

    const [value, setValue] = useState('');
    const [adminStatus, setAdminStatus] = useState('');
    const [selectionStatus, setSelectionStatus] = useState('');
    const [rated, setRated] = useState('');
    const timerRef = useRef(null);


    // fetch des options depuis la BDD
    const [selectionStatusOptions, setSelectionStatusOptions] = useState([]);
    const [adminStatusOptions, setAdminStatusOptions] = useState([]);

    useEffect(() => {
        if (isSelector) {
            api('/selection-status')
                .then((data) => setSelectionStatusOptions(data.statuses ?? []))
                .catch(() => setSelectionStatusOptions([]));
        }
    }, [isSelector]);

    useEffect(() => {
        if (isAdmin || isSuperAdmin) {
            api('/admin-status')
                .then((data) => setAdminStatusOptions(data.statuses ?? []))
                .catch(() => setAdminStatusOptions([]));
        }
    }, [isAdmin, isSuperAdmin]);

    // debounce — on attend que l'utilisateur arrete de taper
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onSearch?.(value);
        }, debounceMs);
        return () => clearTimeout(timerRef.current);
    }, [value, debounceMs]);

    function handleClear() {
        setValue('');
        onSearch?.('');
    }

    // filtre pour les admins
    function handleAdminStatusChange(e) {
        const val = e.target.value;
        setAdminStatus(val);
        onFilterChange?.({ adminStatus: val });
    }

    // filtre pour les selectors
    function handleSelectionStatusChange(e) {
        const val = e.target.value;
        setSelectionStatus(val);
        onFilterChange?.({ selectionStatus: val });
    }

    function handleRatedChange(e) {
        const val = e.target.value;
        setRated(val);
        onFilterChange?.({ rated: val });
    }
    

    const ph = placeholder ?? t('gallery.searchPlaceholder', { defaultValue: 'Rechercher un film, réalisateur, tag…' });

    //=====================================================
    // RENDER
    //=====================================================

    return (
        <div className="gsearch-wrap">

            {/* --- barre de recherche publique --- */}
            <div className="gsearch-inner">
                <span className="gsearch-icon" aria-hidden>
                    {loading ? (
                        <svg className="gsearch-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                    ) : (
                        <FiSearch size={16} strokeWidth={2} aria-hidden />
                    )}
                </span>

                <input
                    type="search"
                    className="gsearch-input"
                    placeholder={ph}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-label={t('gallery.searchLabel', { defaultValue: 'Rechercher' })}
                />

                {value && (
                    <button
                        type="button"
                        className="gsearch-clear"
                        onClick={handleClear}
                        aria-label={t('gallery.clearSearch', { defaultValue: 'Effacer' })}
                    >
                        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M1 1l12 12M13 1L1 13" />
                        </svg>
                    </button>
                )}
            </div>

            {/* --- filtres selector (role 2) --- */}
            {isSelector && (
                <div className="gsearch-filters-wrap">

                    {/* filtre : videos notees ou non notees (statique) */}
                    <select
                        value={rated}
                        onChange={handleRatedChange}
                        className="gsearch-select"
                    >
                        <option value="">Toutes</option>
                        <option value="true">Notées par moi</option>
                        <option value="false">Non notées</option>
                    </select>

                    {/* filtre : selection_status (depuis BDD) */}
                    <select
                        value={selectionStatus}
                        onChange={handleSelectionStatusChange}
                        className="gsearch-select"
                    >
                        <option value="">Tous statuts</option>
                        {selectionStatusOptions.map((s) => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                    </select>

                    {/* bouton mes assignations */}
                    {onMyAssignments && (
                        <button
                            type="button"
                            className={`gsearch-assignment-btn ${isFilteringAssignments ? 'gsearch-assignment-btn--active' : ''}`}
                            onClick={onMyAssignments}
                        >
                            {isFilteringAssignments ? 'Toutes les vidéos' : 'Mes assignations'}
                        </button>
                    )}

                </div>
            )}

            {/* --- filtre admin_status (role 1 et 3, depuis BDD) --- */}
            {(isAdmin || isSuperAdmin) && (
                <div className="gsearch-filters-wrap">
                    <select
                        value={adminStatus}
                        onChange={handleAdminStatusChange}
                        className="gsearch-select"
                    >
                        <option value="">Tous statuts admin</option>
                        {adminStatusOptions.map((s) => (
                            <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* --- compteur de resultats --- */}
            {resultsCount !== null && (
                <span className="gsearch-results-badge">
                    <strong>{resultsCount}</strong>
                    {value.trim()
                        ? ` résultat${resultsCount !== 1 ? 's' : ''}`
                        : ` film${resultsCount !== 1 ? 's' : ''}`
                    }
                </span>
            )}

        </div>
    );
};

export default SearchBar;