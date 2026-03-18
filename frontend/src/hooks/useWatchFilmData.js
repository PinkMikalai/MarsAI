import { useEffect, useMemo, useState } from 'react';
import { videoApi, getCoverUrl, getVideoUrl } from '../service/galleryService';
import { parseVideoResponse } from '../utils/watchFilmUtils';
import { COUNTRIES_ISO3166 } from '../constants/submitForm';


function useWatchFilmData(videoId) {

    // États — liste & navigation
    const [videos,       setVideos      ] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading,      setLoading     ] = useState(true);
    const [error,        setError       ] = useState('');

    // États — vidéo active
    const [video,        setVideo       ] = useState(null);
    const [tags,         setTags        ] = useState([]);
    const [stills,       setStills      ] = useState([]);
    const [adminData,    setAdminData   ] = useState(null);
    const [existingMemo, setExistingMemo] = useState(null);

    // États — lecteur
    const [isPlaying,   setIsPlaying  ] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);


    // ── Charge la liste complète des vidéos ──────────
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


    // ── Charge les détails de la vidéo active ────────
    useEffect(() => {
        let cancelled = false;
        const current = videos[currentIndex];
        if (!current?.id) return;

        setIsPlaying(false);
        setIsSwitching(true);
        setExistingMemo(null);
        setAdminData(null);

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


    // ── Données dérivées ─────────────────────────────
    const title       = video?.title || video?.title_en || 'Titre vidéo';
    const director    = [video?.realisator_firstname, video?.realisator_lastname].filter(Boolean).join(' ') || '—';
    const synopsis    = video?.synopsis_en || video?.synopsis || '—';
    const countryCode = video?.country || '';
    const country     = COUNTRIES_ISO3166.find((c) => c.value === countryCode)?.name || countryCode || '—';
    const coverUrl    = getCoverUrl(video?.cover);
    const videoUrl    = getVideoUrl(video?.video_file_name);
    const awards      = video?.award || [];

    const stillUrls = useMemo(
        () => stills.map((s) => getCoverUrl(s.file_name)).filter(Boolean),
        [stills]
    );

    const preloadUrls = useMemo(
        () => Array.from({ length: 3 }, (_, i) => videos[currentIndex + i])
            .filter((v) => v?.video_file_name)
            .map((v) => getVideoUrl(v.video_file_name)),
        [videos, currentIndex]
    );


    // ── Retour ───────────────────────────────────────
    return {
        videos, currentIndex, setCurrentIndex,
        loading, error,
        video, tags, stills, adminData, existingMemo, setExistingMemo,
        isPlaying, setIsPlaying, isSwitching,
        stillUrls, preloadUrls,
        title, director, countryCode, country, synopsis, coverUrl, videoUrl, awards,
    };
}

export { useWatchFilmData };
