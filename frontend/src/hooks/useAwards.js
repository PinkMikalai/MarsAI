import { useEffect, useState } from 'react';
import { videoApi } from '../service/galleryService';

// =====================================================
// GESTION DES PRIX (admin uniquement)
// =====================================================
function useAwards(isAdminUser, videoId, showAwardPanel) {
    const [allAwards,        setAllAwards       ] = useState([]);
    const [selectedAwardIds, setSelectedAwardIds] = useState([]);
    const [savingAwards,     setSavingAwards    ] = useState(false);
    const [awardSaved,       setAwardSaved      ] = useState(false);

    // ── Chargement liste complète des prix ───────────
    useEffect(() => {
        if (!isAdminUser) return;
        videoApi.getAllAwards()
            .then((res) => setAllAwards(res?.data || []))
            .catch(() => setAllAwards([]));
    }, [isAdminUser]);

    // ── Prix de la vidéo courante quand le panneau s'ouvre ──
    useEffect(() => {
        if (!showAwardPanel || !videoId) return;
        videoApi.getVideoAwards(videoId)
            .then((res) => setSelectedAwardIds((res?.data || []).map((a) => a.id)))
            .catch(() => setSelectedAwardIds([]));
        setAwardSaved(false);
    }, [showAwardPanel, videoId]);

    const handleToggleAward = (awardId) => {
        setAwardSaved(false);
        setSelectedAwardIds((prev) =>
            prev.includes(awardId) ? prev.filter((id) => id !== awardId) : [...prev, awardId]
        );
    };

    const handleSaveAwards = async () => {
        if (!videoId) return;
        setSavingAwards(true);
        try {
            await videoApi.setVideoAwards(videoId, selectedAwardIds);
            setAwardSaved(true);
        } catch {
            setAwardSaved(false);
        } finally {
            setSavingAwards(false);
        }
    };

    return {
        allAwards,
        selectedAwardIds,
        savingAwards,
        awardSaved,
        handleToggleAward,
        handleSaveAwards,
    };
}

export { useAwards };
