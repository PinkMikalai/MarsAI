import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext.jsx';




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
}) => {
    const { t } = useTranslation();
    const { isAdmin, isSuperAdmin, isSelector } = useAuth();

    const [value, setValue] = useState('');
    const [adminStatus, setAdminStatus] = useState('');
    const [selectionStatus, setSelectionStatus] = useState('');
    const [rated, setRated] = useState('');
    const timerRef = useRef(null);

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
        console.log("SearchBar — selectionStatus:", val);
        setSelectionStatus(val);
        onFilterChange?.({ selectionStatus: val });
    }

    function handleRatedChange(e) {
        const val = e.target.value;
        console.log("SearchBar — rated:", val);
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
         
                <div className="gsearch-filters-wrap">

                    {/* filtre : videos notees ou non notees par le selector */}
                    <select
                         
                    >
                     
                    </select>

                    {/* filtre : selection_status */}
                    <select
                       
                    >
                        
                    </select>

                </div>
            

            {/* --- filtre admin_status (role 1 et 3) --- */}
          
                <div className="gsearch-filters-wrap">
                    <select
                        
                    >
                       
                    </select>
                </div>
         

            {/* --- compteur de resultats --- */}
            <div className="gsearch-results-info-wrap">
                {resultsCount !== null && (
                    <p className="gsearch-results-info">
                        {value.trim()
                            ? <><strong>{resultsCount}</strong> résultat{resultsCount !== 1 ? 's' : ''} pour « {value.trim()} »</>
                            : <><strong>{resultsCount}</strong> film{resultsCount !== 1 ? 's' : ''}</>
                        }
                    </p>
                )}
            </div>

        </div>
    );
};

export default SearchBar;
