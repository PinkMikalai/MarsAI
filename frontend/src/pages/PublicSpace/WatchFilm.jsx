import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch } from 'react-icons/fi';
import 'flag-icons/css/flag-icons.min.css';

import { useAuth } from '../../context/AuthContext';
import { useScrollNav } from '../../hooks/useScrollNav';
import { useLightbox } from '../../hooks/useLightbox';
import { useWatchFilmData } from '../../hooks/useWatchFilmData';
import { useAwards } from '../../hooks/useAwards';
import { useStillsCarousel } from '../../hooks/useStillsCarousel';

import { ActionBtn } from '../../components/watchfilm/ActionBtn';
import { InfoPanel } from '../../components/watchfilm/InfoPanel';
import { AwardPanel } from '../../components/watchfilm/AwardPanel';
import Lightbox from '../../components/ui/display/Lightbox';
import SearchOverlay from '../../components/ui/search/SearchOverlay';
import { CreateSelectorMemoForm, UpdateSelectorMemoForm } from '../../components/forms/SelectorMemo';

import { ROUTES } from '../../constants/routes';

const SCROLL_LOCK_MS = 700;

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================
const WatchFilm = () => {
    const { t }      = useTranslation();
    const navigate   = useNavigate();
    const { videoId } = useParams();
    const { isSelector, isAdmin, isSuperAdmin } = useAuth();
    const isAdminUser = isAdmin || isSuperAdmin;

    const videoRef = useRef(null);
    const wrapRef  = useRef(null);

    const { openLightbox, lightboxProps } = useLightbox();

    // ── États UI ─────────────────────────────────────
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showAwardPanel, setShowAwardPanel] = useState(false);
    const [showMemoModal,  setShowMemoModal ] = useState(false);
    const [showSearch,     setShowSearch    ] = useState(false);

    // ── Données vidéo ────────────────────────────────
    const {
        videos, currentIndex, setCurrentIndex,
        loading, error,
        video, adminData, existingMemo, setExistingMemo,
        isPlaying, setIsPlaying, isSwitching,
        stillUrls, preloadUrls,
        title, director, countryCode, country, synopsis, coverUrl, videoUrl, awards,
    } = useWatchFilmData(videoId);

    // ── Awards ───────────────────────────────────────
    const {
        allAwards, selectedAwardIds, savingAwards, awardSaved,
        handleToggleAward, handleSaveAwards,
    } = useAwards(isAdminUser, video?.id, showAwardPanel);

    // ── Stills carousel ──────────────────────────────
    const stillIndex = useStillsCarousel(stillUrls);

    // ── Ferme les panneaux au changement de vidéo ────
    useEffect(() => {
        setShowAdminPanel(false);
        setShowAwardPanel(false);
        setShowMemoModal(false);
    }, [currentIndex]);

    // ── Navigation scroll / swipe ────────────────────
    const { scrollDirection, touchHandlers } = useScrollNav({
        onNext: () => setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1)),
        onPrev: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
        panelSelector: '.wf-admin-panel, .wf-search-panel, .watch-film-memo-modal, .lightbox-overlay',
        lockMs: SCROLL_LOCK_MS,
        enabled: videos.length > 0,
    });

    // ── Handlers recherche / lecteur ─────────────────
    const handleSelectFilm = useCallback((filmId) => {
        setShowSearch(false);
        navigate(`/watch/${filmId}`);
    }, [navigate]);

    const handlePlayClick = () => {
        if (wrapRef.current?.requestFullscreen) {
            wrapRef.current.requestFullscreen().catch(() => {});
        }
        videoRef.current?.play().catch(() => {});
    };

    // ── Rendu ────────────────────────────────────────
    return (
        <div
            className="watch-film-page"
            onTouchStart={touchHandlers.onTouchStart}
            onTouchMove={touchHandlers.onTouchMove}
            onTouchEnd={touchHandlers.onTouchEnd}
        >
            <main className="watch-film-container">

                {loading && (
                    <div className="wf-loading">
                        <div className="wf-loading-spinner" />
                        <p>{t('watchFilm.loading')}</p>
                    </div>
                )}
                {error && <p className="wf-error">{error}</p>}

                {!loading && !error && (
                    <div className="watch-film-player">
                        <div
                            ref={wrapRef}
                            className={`watch-film-video-wrap
                                ${isSwitching       ? 'is-switching'      : ''}
                                ${scrollDirection === 'down' ? 'is-switching-down' : ''}
                                ${scrollDirection === 'up'   ? 'is-switching-up'   : ''}
                            `}
                            onClick={handlePlayClick}
                        >
                            {/* ── VIDÉO ── */}
                            <video
                                ref={videoRef}
                                className="watch-film-video"
                                src={videoUrl    || undefined}
                                poster={coverUrl || undefined}
                                controls
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                preload="metadata"
                            />

                            {/* ── OVERLAY (visible en pause) ── */}
                            {!isPlaying && (
                                <div className="wf-overlay">

                                    {/* Navigation */}
                                    <div className="wf-nav" onClick={(e) => e.stopPropagation()}>
                                        <Link to={ROUTES.GALLERY_FILMS} className="watch-film-back">← Galerie</Link>
                                        <button
                                            className="wf-search-trigger"
                                            onClick={() => setShowSearch(true)}
                                            aria-label="Rechercher"
                                        >
                                            <FiSearch size={17} strokeWidth={2} />
                                        </button>
                                        <Link to={ROUTES.HOME} className="watch-film-home">Accueil</Link>
                                    </div>

                                    {/* Bouton play centré */}
                                    <div className="watch-film-play-center">
                                        <button className="watch-film-play" onClick={handlePlayClick} aria-label={t('watchFilm.loading')}>
                                            <svg className="watch-film-play-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Boutons actions (admin / selector) */}
                                    {(isAdminUser || isSelector) && (
                                        <div className="wf-actions" onClick={(e) => e.stopPropagation()}>
                                            {isSelector && (
                                                <>
                                                    <div className="wf-stat-box">
                                                        <span className="wf-stat-box-value">{existingMemo?.rating ?? '—'}</span>
                                                        <span className="wf-stat-box-label">/ 10</span>
                                                    </div>
                                                    <div className="wf-stat-box wf-stat-box--status">
                                                        <span className="wf-stat-box-value wf-stat-box-value--sm">
                                                            {existingMemo?.selection_status?.name ?? 'Non notée'}
                                                        </span>
                                                        <span className="wf-stat-box-label">statut</span>
                                                    </div>
                                                    <ActionBtn
                                                        icon={existingMemo ? '✏️' : '⭐'}
                                                        label={existingMemo ? t('watchFilm.editMemo') : t('watchFilm.rateMemo')}
                                                        className={`wf-action-btn--noter ${existingMemo ? 'wf-action-btn--noter-done' : ''}`}
                                                        onClick={() => { setShowAdminPanel(false); setShowMemoModal(true); }}
                                                    />
                                                </>
                                            )}
                                            <ActionBtn
                                                icon="ℹ️"
                                                label={t('watchFilm.infosTitle')}
                                                className={`wf-action-btn--admin ${showAdminPanel ? 'wf-action-btn--active' : ''}`}
                                                onClick={() => { setShowAdminPanel((p) => !p); setShowAwardPanel(false); }}
                                            />
                                            {isAdminUser && (
                                                <ActionBtn
                                                    icon="🏆"
                                                    label="Attribuer prix"
                                                    className={`wf-action-btn--award ${showAwardPanel ? 'wf-action-btn--active' : ''}`}
                                                    onClick={() => { setShowAwardPanel((p) => !p); setShowAdminPanel(false); }}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Métadonnées vidéo */}
                                    <div className="wf-meta-zone">
                                        <div className="wf-content">
                                            <span className="watch-film-tag">VIDÉO</span>
                                            <h1 className="watch-film-title">{title}</h1>
                                            <div className="wf-meta-row">
                                                <p className="watch-film-info">{t('watchFilm.director')} {director}</p>
                                                <span className="wf-meta-sep">·</span>
                                                <p className="watch-film-info wf-country">
                                                    {countryCode && (
                                                        <span className={`fi fi-${countryCode.toLowerCase()} wf-country-flag`} aria-hidden />
                                                    )}
                                                    {country}
                                                </p>
                                            </div>
                                            <p className="wf-synopsis">{synopsis}</p>
                                            {awards.length > 0 && (
                                                <div className="wf-awards">
                                                    {awards.map((a) => (
                                                        <span key={a.id} className="wf-award-badge">🏆 {a.title}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Panneau infos */}
                                    {(isAdminUser || isSelector) && (
                                        <InfoPanel
                                            t={t}
                                            isAdmin={isAdminUser}
                                            isSelector={isSelector}
                                            adminData={adminData}
                                            video={video}
                                            existingMemo={existingMemo}
                                            stillUrls={stillUrls}
                                            stillIndex={stillIndex}
                                            onStillClick={openLightbox}
                                            onNoterClick={() => { setShowAdminPanel(false); setShowMemoModal(true); }}
                                            isOpen={showAdminPanel}
                                            onClose={() => setShowAdminPanel(false)}
                                        />
                                    )}

                                    {/* Panneau awards */}
                                    {isAdminUser && (
                                        <AwardPanel
                                            isOpen={showAwardPanel}
                                            onClose={() => setShowAwardPanel(false)}
                                            allAwards={allAwards}
                                            selectedIds={selectedAwardIds}
                                            onToggle={handleToggleAward}
                                            onSave={handleSaveAwards}
                                            saving={savingAwards}
                                            saved={awardSaved}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Recherche */}
                            <SearchOverlay
                                isOpen={showSearch}
                                onClose={() => setShowSearch(false)}
                                onSelectFilm={handleSelectFilm}
                            />

                            {/* Modale notation selector */}
                            {showMemoModal && isSelector && (
                                <div className="watch-film-memo-overlay" onClick={() => setShowMemoModal(false)}>
                                    <div className="watch-film-memo-modal" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="watch-film-memo-close"
                                            onClick={() => setShowMemoModal(false)}
                                            aria-label={t('watchFilm.close')}
                                        >
                                            ✕
                                        </button>
                                        {existingMemo ? (
                                            <UpdateSelectorMemoForm
                                                memo={existingMemo}
                                                onSuccess={(updated) => { if (updated) setExistingMemo(updated); setShowMemoModal(false); }}
                                            />
                                        ) : (
                                            <CreateSelectorMemoForm
                                                videoId={video?.id || videoId}
                                                onSuccess={(newMemo) => { if (newMemo) setExistingMemo(newMemo); setShowMemoModal(false); }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Pré-chargement vidéos suivantes */}
            <div className="watch-film-preload" aria-hidden>
                {preloadUrls.map((url) => (
                    <video key={url} src={url} preload="metadata" />
                ))}
            </div>

            {/* Lightbox stills */}
            <Lightbox {...lightboxProps} />
        </div>
    );
};

export default WatchFilm;
