import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { videoApi, getCoverUrl, getVideoUrl } from '../../service/galleryService';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import { CreateSelectorMemoForm, UpdateSelectorMemoForm } from '../../components/forms/SelectorMemo';
import { COUNTRIES_ISO3166 } from '../../constants/submitForm';
import 'flag-icons/css/flag-icons.min.css';

const STILL_INTERVAL_MS = 5000;
const SCROLL_LOCK_MS    = 700;

// =====================================================
// EXTRACTION DES DONNÉES — aligné sur videoController.getVideoById
//
// PUBLIC (controller lignes 88-94) :
//   res.data = basicVideoData (array direct)
//
// ADMIN / SUPER-ADMIN (controller lignes 60-70) :
//   res.data = { basicVideoData, adminVideoData }
//
// SELECTOR (controller lignes 72-86) :
//   res.data = { basicVideoData, selectorVideoData }
//   res.memo_status = "Vous avez déjà noté..." | "Vous n'avez pas encore noté..."
// =====================================================
function parseVideoResponse(res, fallback) {
    let videoJson = null;
    let adminData = null;
    let selectorMemo = null;

    // Public : data = basicVideoData directement
    // Admin/Selector : data = { basicVideoData, adminVideoData | selectorVideoData }
    const basicVideoData = res?.data?.basicVideoData
        ?? (Array.isArray(res?.data) ? res.data : null);
    const adminVideoData = res?.data?.adminVideoData;
    const selectorVideoData = res?.data?.selectorVideoData;

    const basicJson = basicVideoData?.[0]?.video_json ?? null;

    if (basicJson) {
        // Admin : fusion basicVideoData + adminVideoData
        if (adminVideoData) {
            const adminJson = adminVideoData[0]?.video_json ?? null;
            videoJson = { ...basicJson, ...adminJson };
            adminData = adminJson;
        }
        // Selector : fusion basicVideoData + selectorVideoData
        else if (selectorVideoData) {
            const selectorJson = selectorVideoData[0]?.video_json ?? null;
            videoJson = { ...basicJson, ...selectorJson };
            selectorMemo = selectorJson?.selector_memo?.id ? selectorJson.selector_memo : null;
        }
        // Public : basicVideoData uniquement
        else {
            videoJson = basicJson;
        }
    }

    return {
        video: videoJson ?? fallback ?? null,
        tags: videoJson?.tag ?? [],
        stills: videoJson?.still ?? [],
        adminData,
        selectorMemo,
        memoStatus: res?.memo_status ?? null,
    };
}

// =====================================================
// PANNEAU INFOS — Admin et Selector (stills, commentaires, données)
// =====================================================
const InfoPanel = ({
    t,
    isAdmin,
    isSelector,
    adminData,
    video,
    existingMemo,
    memoStatus,
    stillUrls,
    stillIndex,
    onNoterClick,
    isOpen,
    onClose,
}) => {
    const adminContributors = adminData?.contributors || [];
    const selectorContributors = video?.contributors || [];
    const contributors = isAdmin ? adminContributors : selectorContributors;
    const adminVideos  = adminData?.admin_videos  || [];

    return (
        <div className={`wf-admin-panel ${isOpen ? 'wf-admin-panel--open' : ''}`}>
            <div className="wf-admin-panel-header">
                <h3 className="wf-admin-panel-title">{t('watchFilm.infosTitle')}</h3>
                <button className="wf-admin-panel-close" onClick={onClose} aria-label={t('watchFilm.close')}>✕</button>
            </div>

            <div className="wf-admin-panel-body">

                {/* SELECTOR : Ma notation + Données selectorVideoData */}
                {isSelector && (
                    <>
                        <div className="wf-admin-section">
                            <h4 className="wf-admin-section-title">{t('watchFilm.myRating')}</h4>
                            <div className="wf-admin-row wf-admin-row--selector">
                                <span className="wf-admin-label">{t('watchFilm.ratingLabel')}</span>
                                <span className="wf-admin-value">
                                    {existingMemo?.rating ?? '—'} / 10
                                </span>
                            </div>
                            <div className="wf-admin-row wf-admin-row--selector">
                                <span className="wf-admin-label">{t('watchFilm.statusLabel')}</span>
                                <span className="wf-admin-value">
                                    {existingMemo?.selection_status?.name ?? (memoStatus ?? '—')}
                                </span>
                            </div>
                            {existingMemo?.created_at && (
                                <div className="wf-admin-row wf-admin-row--selector">
                                    <span className="wf-admin-label">{t('watchFilm.ratedOn')}</span>
                                    <span className="wf-admin-value">
                                        {new Date(existingMemo.created_at).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            )}
                            {existingMemo?.comment && (
                                <div className="wf-admin-section">
                                    <h4 className="wf-admin-section-title">{t('watchFilm.myComment')}</h4>
                                    <p className="wf-admin-text">{existingMemo.comment}</p>
                                </div>
                            )}
                            <button
                                className="wf-action-btn wf-action-btn--noter wf-action-btn--in-panel"
                                onClick={onNoterClick}
                            >
                                <span className="wf-action-btn-icon">{existingMemo ? '✏️' : '⭐'}</span>
                                <span className="wf-action-btn-label">{existingMemo ? t('watchFilm.editMemo') : t('watchFilm.rateMemo')}</span>
                            </button>
                        </div>
                        {/* Description (synopsis) en double */}
                        {(video?.synopsis_en || video?.synopsis) && (
                            <div className="wf-admin-section">
                                <h4 className="wf-admin-section-title">{t('watchFilm.description')}</h4>
                                <p className="wf-admin-text">
                                    {video.synopsis_en || video.synopsis}
                                </p>
                            </div>
                        )}
                        {/* selectorVideoData : Technique, Contributeurs */}
                        {(video?.tech_resume || video?.classification || video?.creative_resume) && (
                            <div className="wf-admin-section">
                                <h4 className="wf-admin-section-title">{t('watchFilm.technique')}</h4>
                                {video?.language && (
                                    <div className="wf-admin-row">
                                        <span className="wf-admin-label">{t('watchFilm.language')}</span>
                                        <span className="wf-admin-value">{video.language}</span>
                                    </div>
                                )}
                                {video.classification && (
                                    <div className="wf-admin-row">
                                        <span className="wf-admin-label">{t('watchFilm.classification')}</span>
                                        <span className="wf-admin-value">{video.classification}</span>
                                    </div>
                                )}
                                {video.tech_resume && (
                                    <div className="wf-admin-text-block">
                                        <span className="wf-admin-text-label">{t('watchFilm.techResume')}</span>
                                        <p className="wf-admin-text">{video.tech_resume}</p>
                                    </div>
                                )}
                                {video.creative_resume && (
                                    <div className="wf-admin-text-block">
                                        <span className="wf-admin-text-label">{t('watchFilm.creativeResume')}</span>
                                        <p className="wf-admin-text">{video.creative_resume}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {contributors.length > 0 && (
                            <div className="wf-admin-section">
                                <h4 className="wf-admin-section-title">
                                    {t('watchFilm.contributors')} <span className="wf-admin-count">{contributors.length}</span>
                                </h4>
                                <ul className="wf-admin-list">
                                    {contributors.map((c) => (
                                        <li key={c.id} className="wf-admin-list-item">
                                            <span className="wf-admin-contributor-name">{c.firstname} {c.last_name}</span>
                                            <span className="wf-admin-contributor-role">{c.production_role}</span>
                                            {c.email && (
                                                <a className="wf-admin-link wf-admin-link--email" href={`mailto:${c.email}`}>
                                                    {c.email}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                {/* ADMIN : adminVideoData — Technique, Réalisateur, Contributeurs, Historique */}
                {isAdmin && adminData && (
                    <>
                        <div className="wf-admin-section">
                            <h4 className="wf-admin-section-title">{t('watchFilm.technique')}</h4>
                            {video?.language && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.language')}</span>
                                    <span className="wf-admin-value">{video.language}</span>
                                </div>
                            )}
                            {adminData.classification && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.classification')}</span>
                                    <span className="wf-admin-value">{adminData.classification}</span>
                                </div>
                            )}
                            {adminData.youtube_url && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.youtube')}</span>
                                    <a className="wf-admin-link" href={adminData.youtube_url} target="_blank" rel="noreferrer">
                                        Voir ↗
                                    </a>
                                </div>
                            )}
                            {adminData.srt_file_name && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.subtitles')}</span>
                                    <span className="wf-admin-value">{adminData.srt_file_name}</span>
                                </div>
                            )}
                            {adminData.acquisition_source && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.source')}</span>
                                    <span className="wf-admin-value">{adminData.acquisition_source.name}</span>
                                </div>
                            )}
                            {adminData.tech_resume && (
                                <div className="wf-admin-text-block">
                                    <span className="wf-admin-text-label">{t('watchFilm.techResume')}</span>
                                    <p className="wf-admin-text">{adminData.tech_resume}</p>
                                </div>
                            )}
                            {adminData.creative_resume && (
                                <div className="wf-admin-text-block">
                                    <span className="wf-admin-text-label">{t('watchFilm.creativeResume')}</span>
                                    <p className="wf-admin-text">{adminData.creative_resume}</p>
                                </div>
                            )}
                        </div>

                        {((video?.realisator_firstname || video?.realisator_lastname) || adminData.realisator_civility || adminData.email || adminData.birthdate || adminData.mobile_number || adminData.phone_number || adminData.address) && (
                        <div className="wf-admin-section">
                            <h4 className="wf-admin-section-title">{t('watchFilm.director')}</h4>
                            <div className="wf-admin-row">
                                <span className="wf-admin-label">{t('watchFilm.director')}</span>
                                <span className="wf-admin-value">{video?.realisator_firstname} {video?.realisator_lastname}</span>
                            </div>
                            {adminData.realisator_civility && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.civility')}</span>
                                    <span className="wf-admin-value">{adminData.realisator_civility}</span>
                                </div>
                            )}
                            {adminData.email && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.email')}</span>
                                    <a className="wf-admin-link" href={`mailto:${adminData.email}`}>
                                        {adminData.email}
                                    </a>
                                </div>
                            )}
                            {adminData.birthdate && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.birthdate')}</span>
                                    <span className="wf-admin-value">
                                        {new Date(adminData.birthdate).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            )}
                            {adminData.mobile_number && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.mobile')}</span>
                                    <span className="wf-admin-value">{adminData.mobile_number}</span>
                                </div>
                            )}
                            {adminData.phone_number && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.landline')}</span>
                                    <span className="wf-admin-value">{adminData.phone_number}</span>
                                </div>
                            )}
                            {adminData.acquisition_source && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.acquisitionSource')}</span>
                                    <span className="wf-admin-value">{adminData.acquisition_source.name}</span>
                                </div>
                            )}
                            {adminData.address && (
                                <div className="wf-admin-row">
                                    <span className="wf-admin-label">{t('watchFilm.address')}</span>
                                    <span className="wf-admin-value">{adminData.address}</span>
                                </div>
                            )}
                        </div>
                        )}

                        {adminContributors.length > 0 && (
                            <div className="wf-admin-section">
                                <h4 className="wf-admin-section-title">
                                    {t('watchFilm.contributors')} <span className="wf-admin-count">{adminContributors.length}</span>
                                </h4>
                                <ul className="wf-admin-list">
                                    {adminContributors.map((c) => (
                                        <li key={c.id} className="wf-admin-list-item">
                                            <span className="wf-admin-contributor-name">{c.firstname} {c.last_name}</span>
                                            <span className="wf-admin-contributor-role">{c.production_role}</span>
                                            {c.email && (
                                                <a className="wf-admin-link wf-admin-link--email" href={`mailto:${c.email}`}>
                                                    {c.email}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {adminVideos.length > 0 && (
                            <div className="wf-admin-section">
                                <h4 className="wf-admin-section-title">{t('watchFilm.statusHistory')}</h4>
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
                    </>
                )}

                {/* STILLS — pour Admin et Selector */}
                {stillUrls.length > 0 && (
                    <div className="wf-admin-section">
                        <h4 className="wf-admin-section-title">{t('watchFilm.stills')}</h4>
                        <div className="wf-drawer-stills wf-drawer-stills--in-panel">
                            {stillUrls.map((url, idx) => (
                                <img
                                    key={url}
                                    src={url}
                                    alt={`still ${idx + 1}`}
                                    className={`wf-drawer-still-img ${idx === stillIndex ? 'wf-drawer-still-img--active' : ''}`}
                                />
                            ))}
                        </div>
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
    const { t } = useTranslation();
    const { videoId }                           = useParams();
    const { isSelector, isAdmin, isSuperAdmin } = useAuth();
    const isAdminUser = isAdmin || isSuperAdmin;

    const videoRef      = useRef(null);
    const wrapRef       = useRef(null);
    const scrollLockRef = useRef(false);
    const touchStartRef = useRef(null);
    const touchInPanelRef = useRef(false);
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
    const [existingMemo, setExistingMemo]     = useState(null);
    const [memoStatus, setMemoStatus]         = useState(null);

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

        const prevent = (e) => {
            if (e.target?.closest?.('.wf-admin-panel')) return;
            e.preventDefault();
        };
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
        setMemoStatus(null);
        setAdminData(null);
        setShowMemoModal(false);
        setShowAdminPanel(false);

        videoApi.getVideoById(current.id)
            .then((res) => {
                if (cancelled) return;
                const parsed = parseVideoResponse(res, current);
                setVideo(parsed.video);
                setTags(parsed.tags);
                setStills(parsed.stills);
                setAdminData(parsed.adminData);
                setExistingMemo(parsed.selectorMemo);
                setMemoStatus(parsed.memoStatus);
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
            if (e.target?.closest?.('.wf-admin-panel')) return;
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
        touchInPanelRef.current = !!e.target?.closest?.('.wf-admin-panel');
    };

    const handleTouchMove = (e) => {
        if (e.target?.closest?.('.wf-admin-panel')) return;
        e.preventDefault();
    };

    const handleTouchEnd = (e) => {
        if (touchInPanelRef.current) return;
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
    const countryCode = video?.country || '';
    const country = COUNTRIES_ISO3166.find(c => c.value === countryCode)?.name || countryCode || '—';
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
                        <p>{t('watchFilm.loading')}</p>
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

                                    {/* NAV — stopPropagation pour éviter fullscreen au clic sur Galerie/Accueil */}
                                    <div className="wf-nav" onClick={(e) => e.stopPropagation()}>
                                        <Link to={ROUTES.GALLERY_FILMS} className="watch-film-back">
                                            ← Galerie
                                        </Link>
                                        <Link to={ROUTES.HOME} className="watch-film-home">
                                            Accueil
                                        </Link>
                                    </div>

                                    {/* PLAY — absolute centré */}
                                    <div className="watch-film-play-center">
                                        <button className="watch-film-play" onClick={handlePlayClick} aria-label={t('watchFilm.loading')}>
                                            <svg className="watch-film-play-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* ACTIONS — Note, Statut, Infos, Noter (Selector) */}
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
                                                            {existingMemo?.selection_status?.name ?? (memoStatus ?? '—')}
                                                        </span>
                                                        <span className="wf-stat-box-label">statut</span>
                                                    </div>
                                                    <ActionBtn
                                                        icon={existingMemo ? '✏️' : '⭐'}
                                                        label={existingMemo ? t('watchFilm.editMemo') : t('watchFilm.rateMemo')}
                                                        className={`wf-action-btn--noter ${existingMemo ? 'wf-action-btn--noter-done' : ''}`}
                                                        onClick={() => {
                                                            setShowAdminPanel(false);
                                                            setShowMemoModal(true);
                                                        }}
                                                    />
                                                </>
                                            )}
                                            <ActionBtn
                                                icon="ℹ️"
                                                label={t('watchFilm.infosTitle')}
                                                className={`wf-action-btn--admin ${showAdminPanel ? 'wf-action-btn--active' : ''}`}
                                                onClick={() => setShowAdminPanel((prev) => !prev)}
                                            />
                                        </div>
                                    )}

                                    {/* ZONE BAS — dans le flux flex (meta puis drawer empilés) */}
                                    <div className="wf-meta-zone">

                                        {/* Infos vidéo */}
                                        <div className="wf-content">
                                            <span className="watch-film-tag">VIDÉO</span>
                                            <h1 className="watch-film-title">{title}</h1>
                                            <div className="wf-meta-row">
                                                <p className="watch-film-info">
                                                    {t('watchFilm.director')} {director}
                                                </p>
                                                <span className="wf-meta-sep">·</span>
                                                <p className="watch-film-info wf-country">
                                                    {countryCode && (
                                                        <span className={`fi fi-${countryCode.toLowerCase()} wf-country-flag`} aria-hidden />
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
                                        </div>
                                    </div>{/* fin wf-meta-zone */}

                                    {/* PANNEAU INFOS — Admin et Selector (stills, commentaires, données) */}
                                    {(isAdminUser || isSelector) && (
                                        <InfoPanel
                                            t={t}
                                            isAdmin={isAdminUser}
                                            isSelector={isSelector}
                                            adminData={adminData}
                                            video={video}
                                            existingMemo={existingMemo}
                                            memoStatus={memoStatus}
                                            stillUrls={stillUrls}
                                            stillIndex={stillIndex}
                                            onNoterClick={() => {
                                                setShowAdminPanel(false);
                                                setShowMemoModal(true);
                                            }}
                                            isOpen={showAdminPanel}
                                            onClose={() => setShowAdminPanel(false)}
                                        />
                                    )}
                                </div>
                            )}

                            {/* MODALE NOTATION — à l'intérieur du wrap pour fullscreen */}
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
                                            aria-label={t('watchFilm.close')}
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
                    </div>
                )}
            </main>

            {/* Pré-chargement vidéos suivantes */}
            <div className="watch-film-preload" aria-hidden>
                {preloadUrls.map((url) => (
                    <video key={url} src={url} preload="metadata" />
                ))}
            </div>
        </div>
    );
};

export default WatchFilm;
