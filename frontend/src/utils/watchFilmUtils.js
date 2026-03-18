// Utilitaires partagés pour la page WatchFilm

// =====================================================
// PARSE VIDEO RESPONSE — normalise la réponse API
// selon le rôle (public / admin / selector)
// =====================================================
function parseVideoResponse(res, fallback) {
    let videoJson    = null;
    let adminData    = null;
    let selectorMemo = null;

    // Public : data = basicVideoData directement
    // Admin/Selector : data = { basicVideoData, adminVideoData | selectorVideoData }
    const basicVideoData   = res?.data?.basicVideoData ?? (Array.isArray(res?.data) ? res.data : null);
    const adminVideoData   = res?.data?.adminVideoData;
    const selectorVideoData = res?.data?.selectorVideoData;

    const basicJson = basicVideoData?.[0]?.video_json ?? null;

    if (basicJson) {
        if (adminVideoData) {
            const adminJson = adminVideoData[0]?.video_json ?? null;
            videoJson = { ...basicJson, ...adminJson };
            adminData = adminJson;
        } else if (selectorVideoData) {
            const selectorJson = selectorVideoData[0]?.video_json ?? null;
            videoJson    = { ...basicJson, ...selectorJson };
            selectorMemo = selectorJson?.selector_memo?.id ? selectorJson.selector_memo : null;
        } else {
            videoJson = basicJson;
        }
    }

    return {
        video:       videoJson ?? fallback ?? null,
        tags:        videoJson?.tag   ?? [],
        stills:      videoJson?.still ?? [],
        adminData,
        selectorMemo,
    };
}

export { parseVideoResponse };
