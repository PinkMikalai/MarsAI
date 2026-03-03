import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';

/**
 * SearchBar — barre de recherche réutilisable
 * Props :
 *   onSearch(query: string)  — appelée après debounce (défaut 400ms)
 *   loading                  — affiche un spinner à la place de l'icône
 *   resultsCount             — si fourni, affiche "X film(s)"
 *   placeholder              — texte placeholder (optionnel)
 *   debounceMs               — délai debounce en ms (défaut 400)
 */
const SearchBar = ({
    onSearch,
    loading = false,
    resultsCount = null,
    placeholder,
    debounceMs = 400,
}) => {
    const { t } = useTranslation();
    const [value, setValue] = useState('');
    const timerRef = useRef(null); //

    // debounce — on attend que l'utilisateur arrête de taper
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            onSearch?.(value);
        }, debounceMs);
        return () => clearTimeout(timerRef.current);
    }, [value, debounceMs]);

    const handleClear = () => {
        setValue('');
        onSearch?.('');
    };

    const ph = placeholder ?? t('gallery.searchPlaceholder', { defaultValue: 'Rechercher un film, réalisateur, tag…' });

    return (
        <div className="gsearch-wrap">
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

            {resultsCount !== null && (
                <p className="gsearch-results-info">
                    {value.trim()
                        ? <><strong>{resultsCount}</strong> résultat{resultsCount !== 1 ? 's' : ''} pour « {value.trim()} »</>
                        : <><strong>{resultsCount}</strong> film{resultsCount !== 1 ? 's' : ''}</>
                    }
                </p>
            )}
        </div>
    );
};

export default SearchBar;
