import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { videoApi, getCoverUrl, getVideoUrl } from '../../service/galerieService';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import { CreateSelectorMemoForm, UpdateSelectorMemoForm } from '../../components/forms/SelectorMemo';

const STILL_INTERVAL_MS = 5000;
const SCROLL_LOCK_MS    = 700;

// =====================================================
// EXTRACTION DES DONNÉES SELON LE RÔLE
//
// Controller (getVideoById) — 3 cas :
//   else (public)  → res.data = basicVideoData  (array direct)
//   Admin          → res.data = { basicVideoData, adminVideoData }
//   Selector       → res.data = { basicVideoData, selectorVideoData }
//
// Dans tous les cas, basicVideoData = [{ video_json: {...} }]
// =====================================================
function parseVideoResponse(res, fallback) {
    let videoJson    = null;
    let adminJson    = null;
    let selectorMemo = null;

    const basicVideoData = res?.data?.basicVideoData
        ?? (Array.isArray(res?.data) ? res.data : null);

    if (basicVideoData) {
        videoJson = basicVideoData[0]?.video_json || null;
    }

    if (res?.data?.adminVideoData) {
        adminJson = res.data.adminVideoData[0]?.video_json || null;
    }

    if (res?.data?.selectorVideoData) {
        const sj = res.data.selectorVideoData[0]?.video_json;
        selectorMemo = sj?.selector_memo?.id ? sj.selector_memo : null;
    }

    return {
        video:        videoJson || fallback || null,
        tags:         videoJson?.tag   || [],
        stills:       videoJson?.still || [],
        adminData:    adminJson,
        selectorMemo,
    };
}

// =====================================================
// PANNEAU ADMIN — slide depuis la droite
// =====================================================
const AdminPanel = ({ adminData, isOpen, onClose }) => {
    const contributors = adminData?.contributors || [];
    const adminVideos  = adminData?.admin_videos  || [];

    return (
        <div className={`wf-admin-panel ${isOpen ? 'wf-admin-panel--open' : ''}`}>
            <div className="wf-admin-panel-header">
                <h3 className="wf-admin-panel-title">Infos Admin</h3>
                <button className="wf-admin-panel-close" onClick={onClose} aria-label="Fermer">✕</button>
            </div>

            <div className="wf-admin-panel-body">

                {/* Technique */}
                <div className="wf-admin-section">
                    <h4 className="wf-admin-section-title">Technique</h4>
                    {adminData?.classification && (
                        <div className="wf-admin-row">
                            <span className="wf-admin-label">Classification</span>
                            <span className="wf-admin-value">{adminData.classification}</span>
                        </div>
                    )}
                    {adminData?.youtube_url && (
                        <div className="wf-admin-row">
                            <span className="wf-admin-label">YouTube</span>
                            <a className="wf-admin-link" href={adminData.youtube_url} target="_blank" rel="noreferrer">
                                Voir ↗
                            </a>
                        </div>
                    )}
                    {adminData?.acquisition_source && (
                        <div className="wf-admin-row">
                            <span className="wf-admin-label">Source</span>
                            <span className="wf-admin-value">{adminData.acquisition_source.name}</span>
                        </div>
                    )}
                    {adminData?.tech_resume && (
                        <p className="wf-admin-text">{adminData.tech_resume}</p>
                    )}
                    {adminData?.creative_resume && (
                        <p className="wf-admin-text">{adminData.creative_resume}</p>
                    )}
                </div>

                {/* Contributeurs */}
                {contributors.length > 0 && (
                    <div className="wf-admin-section">
                        <h4 className="wf-admin-section-title">
                            Contributeurs <span className="wf-admin-count">{contributors.length}</span>
                        </h4>
                        <ul className="wf-admin-list">
                            {contributors.map((c) => (
                                <li key={c.id} className="wf-admin-list-item">
                                    <span className="wf-admin-contributor-name">{c.firstname} {c.last_name}</span>
                                    <span className="wf-admin-contributor-role">{c.production_role}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Historique statuts */}
                {adminVideos.length > 0 && (
                    <div className="wf-admin-section">
                        <h4 className="wf-admin-section-title">Historique statuts</h4>
                        <ul className="wf-admin-list">
                            {adminVideos.map((av) => (
                                <li key={av.id} className="wf-admin-list-item">
                                    <span className={`wf-admin-status-badge wf-admin-status-badge--${av.admin_status?.name?.toLowerCase().replace(/\s+/g, '-') || 'default'}`}>
                                        {av.admin_status?.name || '—'}
                                    </span>
                                    {av.comment && <p className="wf-admin-text">{av.comment}</p>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// =====================================================
// BOUTON ACTION TIKTOK (colonne droite)
// =====================================================
const ActionBtn = ({ icon, label, onClick, className = '' }) => (
    <button className={`wf-action-btn ${className}`} onClick={onClick} aria-label={label} title={label}>
        <span className="wf-action-btn-icon">{icon}</span>
        <span className="wf-action-btn-label">{label}</span>
    </button>
);

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================
const WatchFilm = () => {
    const { videoId }                           = useParams();
    const { isSelector, isAdmin, isSuperAdmin } = useAuth();
    const isAdminUser = isAdmin || isSuperAdmin;

    const videoRef      = useRef(null);
    const wrapRef       = useRef(null);
    const scrollLockRef = useRef(false);
    const touchStartRef = useRef(null);
    const navigateRef   = useRef(null);

    const [videos, setVideos]             = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState('');

    const [video, setVideo]         = useState(null);
    const [tags, setTags]           = useState([]);
    const [stills, setStills]       = useState([]);
    const [adminData, setAdminData] = useState(null);

    const [isPlaying, setIsPlaying]             = useState(false);
    const [stillIndex, setStillIndex]           = useState(0);
    const [isSwitching, setIsSwitching]         = useState(false);
    const [scrollDirection, setScrollDirection] = useState(null);

    const [showMemoModal, setShowMemoModal]   = useState(false);
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [showDrawer, setShowDrawer]         = useState(false);
    const [existingMemo, setExistingMemo]     = useState(null);

    // =====================================================
    // CHARGEMENT LISTE VIDÉOS
    // =====================================================
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');

        videoApi.getAllVideos()
            .then((res) => {
                if (cancelled) return;
                const list = res?.data || res?.videos || [];
                setVideos(Array.isArray(list) ? list : []);
                if (videoId) {
                    const idx = list.findIndex((v) => String(v.id) === String(videoId));
                    setCurrentIndex(idx >= 0 ? idx : 0);
                }
            })
            .catch((err) => {
                if (cancelled) return;
                setError(err.message || 'Impossible de charger les vidéos.');
            })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [videoId]);

    // =====================================================
    // BLOCAGE DU SCROLL BODY (TikTok-style)
    // =====================================================
    useEffect(() => {
        const scrollY = window.scrollY;
        const prev = {
            overflow:   document.body.style.overflow,
            overscroll: document.body.style.overscrollBehavior,
            position:   document.body.style.position,
            top:        document.body.style.top,
            width:      document.body.style.width,
        };
        document.body.style.overflow           = 'hidden';
        document.body.style.overscrollBehavior = 'none';
        document.body.style.position           = 'fixed';
        document.body.style.top                = `-${scrollY}px`;
        document.body.style.width              = '100%';

        const prevent = (e) => e.preventDefault();
        window.addEventListener('wheel', prevent, { passive: false });
        window.addEventListener('touchmove', prevent, { passive: false });

        return () => {
            document.body.style.overflow           = prev.overflow;
            document.body.style.overscrollBehavior = prev.overscroll;
            document.body.style.position           = prev.position;
            document.body.style.top                = prev.top;
            document.body.style.width              = prev.width;
            window.scrollTo(0, scrollY);
            window.removeEventListener('wheel', prevent);
            window.removeEventListener('touchmove', prevent);
        };
    }, []);

    // =====================================================
    // CHARGEMENT DÉTAILS VIDÉO COURANTE
    // =====================================================
    useEffect(() => {
        let cancelled = false;
        const current = videos[currentIndex];
        if (!current?.id) return;

        setIsPlaying(false);
        setStillIndex(0);
        setIsSwitching(true);
        setExistingMemo(null);
        setAdminData(null);
        setShowMemoModal(false);
        setShowAdminPanel(false);
        setShowDrawer(false);

        videoApi.getVideoById(current.id)
            .then((res) => {
                if (cancelled) return;
                const parsed = parseVideoResponse(res, current);
                setVideo(parsed.video);
                setTags(parsed.tags);
                setStills(parsed.stills);
                setAdminData(parsed.adminData);
                setExistingMemo(parsed.selectorMemo);
            })
            .catch(() => {
                if (cancelled) return;
                setVideo(current);
                setTags([]);
                setStills([]);
            });

        const timer = setTimeout(() => setIsSwitching(false), 320);

        return () => { cancelled = true; clearTimeout(timer); };
    }, [currentIndex, videos]);

    // =====================================================
    // DÉFILEMENT AUTOMATIQUE DES STILLS
    // =====================================================
    const stillUrls = useMemo(() => {
        return stills.map((s) => getCoverUrl(s.file_name)).filter(Boolean);
    }, [stills]);

    useEffect(() => {
        if (stillUrls.length <= 1) return;
        const timer = setInterval(() => {
            setStillIndex((prev) => (prev + 1) % stillUrls.length);
        }, STILL_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [stillUrls]);

    // =====================================================
    // PRÉ-CHARGEMENT VIDÉOS SUIVANTES
    // =====================================================
    const preloadUrls = useMemo(() => {
        return Array.from({ length: 3 }, (_, i) => videos[currentIndex + i])
            .filter((v) => v?.video_file_name)
            .map((v) => getVideoUrl(v.video_file_name));
    }, [videos, currentIndex]);

    // =====================================================
    // HANDLERS VIDÉO
    // =====================================================
    const handlePlay  = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handlePlayClick = () => {
        if (wrapRef.current?.requestFullscreen) {
            wrapRef.current.requestFullscreen().catch(() => {});
        }
        videoRef.current?.play().catch(() => {});
    };

    // =====================================================
    // NAVIGATION (scroll / swipe entre vidéos)
    // =====================================================
    const navigate = (direction) => {
        if (scrollLockRef.current || videos.length === 0) return;
        scrollLockRef.current = true;
        setTimeout(() => { scrollLockRef.current = false; }, SCROLL_LOCK_MS);

        setScrollDirection(direction);
        if (direction === 'down') {
            setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1));
        } else {
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    // Ref stable vers la dernière version de navigate — évite les re-binds du listener wheel
    navigateRef.current = navigate;

    useEffect(() => {
        const onWheel = (e) => {
            e.preventDefault();
            const dir = Math.sign(e.deltaY);
            if (dir > 0) navigateRef.current('down');
            else if (dir < 0) navigateRef.current('up');
        };
        document.addEventListener('wheel', onWheel, { passive: false });
        return () => document.removeEventListener('wheel', onWheel);
    }, []);

    const handleTouchStart = (e) => {
        touchStartRef.current = e.touches?.[0]?.clientY ?? null;
    };

    const handleTouchMove = (e) => e.preventDefault();

    const handleTouchEnd = (e) => {
        const startY = touchStartRef.current;
        const endY   = e.changedTouches?.[0]?.clientY ?? null;
        if (startY == null || endY == null) return;
        const delta = startY - endY;
        if (Math.abs(delta) < 40) return;
        navigate(delta > 0 ? 'down' : 'up');
    };

    // =====================================================
    // DONNÉES AFFICHÉES
    // =====================================================
    const title    = video?.title    || video?.title_en || 'Titre vidéo';
    const director = [video?.realisator_firstname, video?.realisator_lastname].filter(Boolean).join(' ') || '—';
    const country  = video?.country  || '—';
    const synopsis = video?.synopsis_en || video?.synopsis || '—';
    const coverUrl = getCoverUrl(video?.cover);
    const videoUrl = getVideoUrl(video?.video_file_name);
    const awards   = video?.award || [];

    // =====================================================
    // RENDU
    // =====================================================
    return (
        <div
            className="watch-film-page"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <main className="watch-film-container">
                {loading && (
                    <div className="wf-loading">
                        <div className="wf-loading-spinner" />
                        <p>Chargement…</p>
                    </div>
                )}
                {error && <p className="wf-error">{error}</p>}

                {!loading && !error && (
                    <div className="watch-film-player">
                        <div
                            ref={wrapRef}
                            className={`watch-film-video-wrap
                                ${isSwitching ? 'is-switching' : ''}
                                ${scrollDirection === 'down' ? 'is-switching-down' : ''}
                                ${scrollDirection === 'up'   ? 'is-switching-up'   : ''}
                            `}
                            onClick={handlePlayClick}
                        >
                            {/* VIDEO */}
                            <video
                                ref={videoRef}
                                className="watch-film-video"
                                src={videoUrl    || undefined}
                                poster={coverUrl || undefined}
                                controls
                                onPlay={handlePlay}
                                onPause={handlePause}
                                preload="metadata"
                            />

                            {/* OVERLAY (visible quand en pause) */}
                            {!isPlaying && (
                                <div className="wf-overlay">

                                    {/* NAV — absolute en haut */}
                                    <div className="wf-nav">
                                        <Link to={ROUTES.GALERIE_FILMS} className="watch-film-back">
                                            ← Galerie
                                        </Link>
                                        <Link to={ROUTES.HOME} className="watch-film-home">
                                            Accueil
                                        </Link>
                                    </div>

                                    {/* PLAY — absolute centré */}
                                    <div className="watch-film-play-center">
                                        <button className="watch-film-play" onClick={handlePlayClick} aria-label="Lire la vidéo">
                                            <svg className="watch-film-play-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* ACTIONS — absolute droite, centrées verticalement */}
                                    <div className="wf-actions" onClick={(e) => e.stopPropagation()}>
                                        {isSelector && (
                                            <>
                                                <div className="wf-stat-box">
                                                    <span className="wf-stat-box-value">{existingMemo?.rating ?? '—'}</span>
                                                    <span className="wf-stat-box-label">/ 10</span>
                                                </div>
                                                <div className="wf-stat-box wf-stat-box--status">
                                                    <span className="wf-stat-box-value wf-stat-box-value--sm">
                                                        {existingMemo?.selection_status?.name ?? '—'}
                                                    </span>
                                                    <span className="wf-stat-box-label">statut</span>
                                                </div>
                                                <ActionBtn
                                                    icon={existingMemo ? '✏️' : '⭐'}
                                                    label={existingMemo ? 'Modifier' : 'Noter'}
                                                    className={existingMemo ? 'wf-action-btn--noter-done' : 'wf-action-btn--noter'}
                                                    onClick={() => setShowMemoModal(true)}
                                                />
                                            </>
                                        )}
                                        {isAdminUser && (
                                            <ActionBtn
                                                icon="ℹ️"
                                                label="Infos"
                                                className={`wf-action-btn--admin ${showAdminPanel ? 'wf-action-btn--active' : ''}`}
                                                onClick={() => setShowAdminPanel((prev) => !prev)}
                                            />
                                        )}
                                    </div>

                                    {/* ZONE BAS — dans le flux flex (meta puis drawer empilés) */}
                                    <div className="wf-meta-zone">

                                        {/* Infos vidéo */}
                                        <div className="wf-content">
                                            <span className="watch-film-tag">VIDÉO</span>
                                            <h1 className="watch-film-title">{title}</h1>
                                            <div className="wf-meta-row">
                                                <p className="watch-film-info">
                                                    <strong>Réalisateur</strong> {director}
                                                </p>
                                                <span className="wf-meta-sep">·</span>
                                                <p className="watch-film-info wf-country">
                                                    {country !== '—' && (
                                                        <span className={`fi fi-${country.toLowerCase()} wf-country-flag`} aria-hidden />
                                                    )}
                                                    {country}
                                                </p>
                                            </div>
                                            <p className="wf-synopsis">{synopsis}</p>
                                            {tags.length > 0 && (
                                                <div className="wf-tags">
                                                    {tags.map((tag, idx) => (
                                                        <span key={`${tag}-${idx}`} className="wf-tag-pill">{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                            {awards.length > 0 && (
                                                <div className="wf-awards">
                                                    {awards.map((a) => (
                                                        <span key={a.id} className="wf-award-badge">🏆 {a.title}</span>
                                                    ))}
                                                </div>
                                            )}
                                            {isSelector && (
                                                <div className={`wf-memo-badge ${existingMemo ? 'wf-memo-badge--rated' : 'wf-memo-badge--unrated'}`}>
                                                    {existingMemo
                                                        ? <>✅ Noté <strong>{existingMemo.rating}/10</strong> — {existingMemo.selection_status?.name || ''}</>
                                                        : <>📋 Pas encore noté</>
                                                    }
                                                </div>
                                            )}
                                            {isAdminUser && adminData && (
                                                <div className="wf-admin-inline">
                                                    {adminData.classification && (
                                                        <span className="wf-admin-badge">{adminData.classification}</span>
                                                    )}
                                                    {adminData.acquisition_source && (
                                                        <span className="wf-admin-badge wf-admin-badge--source">
                                                            {adminData.acquisition_source.name}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* DRAWER — juste en dessous du meta, dans le flux */}
                                        {(isSelector || isAdminUser) && (stillUrls.length > 0 || existingMemo?.comment) && (
                                            <div className="wf-drawer-zone" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    className={`wf-drawer-toggle ${showDrawer ? 'wf-drawer-toggle--open' : ''}`}
                                                    onClick={() => setShowDrawer((prev) => !prev)}
                                                    aria-label={showDrawer ? 'Masquer' : 'Afficher'}
                                                >
                                                    <svg className="wf-drawer-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                                    </svg>
                                                    <span className="wf-drawer-toggle-label">
                                                        {existingMemo?.comment ? 'Stills & Commentaire' : 'Voir les stills'}
                                                    </span>
                                                </button>
                                                <div className={`wf-drawer ${showDrawer ? 'wf-drawer--open' : ''}`}>
                                                    {stillUrls.length > 0 && (
                                                        <div className="wf-drawer-stills">
                                                            {stillUrls.map((url, idx) => (
                                                                <img
                                                                    key={url}
                                                                    src={url}
                                                                    alt={`still ${idx + 1}`}
                                                                    className={`wf-drawer-still-img ${idx === stillIndex ? 'wf-drawer-still-img--active' : ''}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    {isSelector && existingMemo?.comment && (
                                                        <div className="wf-drawer-comment">
                                                            <p className="wf-drawer-comment-label">Mon commentaire</p>
                                                            <p className="wf-drawer-comment-text">{existingMemo.comment}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>{/* fin wf-meta-zone */}

                                    {/* PANNEAU ADMIN */}
                                    {isAdminUser && (
                                        <AdminPanel
                                            adminData={adminData}
                                            isOpen={showAdminPanel}
                                            onClose={() => setShowAdminPanel(false)}
                                        />
                                    )}
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

            {/* MODALE NOTATION (Selector uniquement) */}
            {showMemoModal && isSelector && (
                <div
                    className="watch-film-memo-overlay"
                    onClick={() => setShowMemoModal(false)}
                >
                    <div
                        className="watch-film-memo-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="watch-film-memo-close"
                            onClick={() => setShowMemoModal(false)}
                            aria-label="Fermer"
                        >
                            ✕
                        </button>

                        {existingMemo ? (
                            <UpdateSelectorMemoForm
                                memo={existingMemo}
                                onSuccess={(updatedMemo) => {
                                    if (updatedMemo) setExistingMemo(updatedMemo);
                                    setShowMemoModal(false);
                                }}
                            />
                        ) : (
                            <CreateSelectorMemoForm
                                videoId={video?.id || videoId}
                                onSuccess={(newMemo) => {
                                    if (newMemo) setExistingMemo(newMemo);
                                    setShowMemoModal(false);
                                }}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WatchFilm;
