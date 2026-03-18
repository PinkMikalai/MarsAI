import { useEffect, useState } from 'react';

const STILL_INTERVAL_MS = 5000;

// =====================================================
// DÉFILEMENT AUTOMATIQUE DES STILLS
// =====================================================
function useStillsCarousel(stillUrls) {
    const [stillIndex, setStillIndex] = useState(0);

    // Remet à zéro quand la vidéo change
    useEffect(() => {
        setStillIndex(0);
    }, [stillUrls]);

    // Avance automatiquement si plusieurs stills
    useEffect(() => {
        if (stillUrls.length <= 1) return;
        const timer = setInterval(
            () => setStillIndex((prev) => (prev + 1) % stillUrls.length),
            STILL_INTERVAL_MS
        );
        return () => clearInterval(timer);
    }, [stillUrls]);

    return stillIndex;
}

export { useStillsCarousel };
