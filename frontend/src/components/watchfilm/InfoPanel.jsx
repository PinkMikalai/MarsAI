// =====================================================
// PANNEAU INFOS — Admin et Selector
// (notation, technique, réalisateur, stills)
// =====================================================
const InfoPanel = ({
    t,
    isAdmin,
    isSelector,
    adminData,
    video,
    existingMemo,
    stillUrls,
    stillIndex,
    onStillClick,
    onNoterClick,
    isOpen,
    onClose,
}) => {
    const adminContributors    = adminData?.contributors || [];
    const selectorContributors = video?.contributors    || [];
    const contributors         = isAdmin ? adminContributors : selectorContributors;
    const adminVideos          = adminData?.admin_videos || [];

    return (
        <div
            className={`wf-admin-panel ${isOpen ? 'wf-admin-panel--open' : ''}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="wf-admin-panel-header">
                <h3 className="wf-admin-panel-title">{t('watchFilm.infosTitle')}</h3>
                <button className="wf-admin-panel-close" onClick={onClose} aria-label={t('watchFilm.close')}>✕</button>
            </div>

            <div className="wf-admin-panel-body">

                {/* ── SELECTOR : notation + données selectorVideoData ── */}
                {isSelector && (
                    <>
                        <div className="wf-admin-section">
                            <h4 className="wf-admin-section-title">{t('watchFilm.myRating')}</h4>
                            <div className="wf-admin-row wf-admin-row--selector">
                                <span className="wf-admin-label">{t('watchFilm.ratingLabel')}</span>
                                <span className="wf-admin-value">{existingMemo?.rating ?? '—'} / 10</span>
                            </div>
                            <div className="wf-admin-row wf-admin-row--selector">
                                <span className="wf-admin-label">{t('watchFilm.statusLabel')}</span>
                                <span className="wf-admin-value">{existingMemo?.selection_status?.name ?? 'Non notée'}</span>
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
                                className={`wf-action-btn wf-action-btn--in-panel ${existingMemo ? 'wf-action-btn--modifier' : 'wf-action-btn--noter'}`}
                                onClick={onNoterClick}
                            >
                                <span className="wf-action-btn-icon">{existingMemo ? '✏️' : '⭐'}</span>
                                <span className="wf-action-btn-label">{existingMemo ? t('watchFilm.editMemo') : t('watchFilm.rateMemo')}</span>
                            </button>
                        </div>

                        {(video?.synopsis_en || video?.synopsis) && (
                            <div className="wf-admin-section">
                                <h4 className="wf-admin-section-title">{t('watchFilm.description')}</h4>
                                <p className="wf-admin-text">{video.synopsis_en || video.synopsis}</p>
                            </div>
                        )}

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

                {/* ── ADMIN : données privées adminVideoData ── */}
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
                                    <a
                                        className="wf-admin-link"
                                        href={/^https?:\/\//i.test(adminData.youtube_url)
                                            ? adminData.youtube_url
                                            : `https://www.youtube.com/watch?v=${adminData.youtube_url}`}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
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

                        {(video?.realisator_firstname || video?.realisator_lastname || adminData.email || adminData.birthdate || adminData.mobile_number || adminData.phone_number || adminData.address) && (
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
                                        <a className="wf-admin-link" href={`mailto:${adminData.email}`}>{adminData.email}</a>
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

                {/* ── STILLS — Admin et Selector ── */}
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
                                    style={{ cursor: 'zoom-in' }}
                                    onClick={() => onStillClick?.(stillUrls, idx)}
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export { InfoPanel };
