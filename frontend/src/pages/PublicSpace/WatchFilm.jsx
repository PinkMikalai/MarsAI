import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { videoApi, getCoverUrl, getVideoUrl } from '../../service/galerieService';
import { ROUTES } from '../../constants/routes';

const STILL_INTERVAL_MS = 5000;
const SCROLL_LOCK_MS = 700;

const WatchFilm = () => {
  const { videoId } = useParams();
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const scrollLockRef = useRef(false);
  const touchStartRef = useRef(null);
  const [data, setData] = useState({ video: null, tags: [], stills: [] });
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [stillIndex, setStillIndex] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(null);

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
        setError(err.response?.data?.message || 'Impossible de charger les vidéos.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [videoId]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevOverscroll = document.body.style.overscrollBehavior;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    const prevent = (e) => {
      e.preventDefault();
    };
    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overscrollBehavior = prevOverscroll;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener('wheel', prevent);
      window.removeEventListener('touchmove', prevent);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const current = videos[currentIndex];
    if (!current?.id) return;

    setIsPlaying(false);
    setStillIndex(0);
    setIsSwitching(true);

    videoApi.getVideoById(current.id)
      .then((res) => {
        if (cancelled) return;
        const payload = res?.video || res?.tags || res?.stills ? res : (res?.data || {});
        setData({
          video: payload.video || current || null,
          tags: payload.tags || [],
          stills: payload.stills || [],
        });
      })
      .catch(() => {
        if (cancelled) return;
        setData({ video: current || null, tags: [], stills: [] });
      });

    const timer = setTimeout(() => {
      setIsSwitching(false);
    }, 320);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [currentIndex, videos]);

  const stillUrls = useMemo(() => {
    const raw = data.stills || [];
    return raw
      .map((still) => getCoverUrl(still.file_name || still.filename || still))
      .filter(Boolean);
  }, [data.stills]);

  useEffect(() => {
    if (stillUrls.length <= 1) return;
    const timer = setInterval(() => {
      setStillIndex((prev) => (prev + 1) % stillUrls.length);
    }, STILL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [stillUrls]);

  const video = data.video;
  const title = video?.title || video?.title_en || 'Titre vidéo';
  const director = [video?.realisator_firstname, video?.realisator_lastname].filter(Boolean).join(' ') || '—';
  const country = video?.country || '—';
  const synopsis = video?.synopsis_en || video?.synopsis || '—';
  const coverUrl = getCoverUrl(video?.cover);
  const videoUrl = getVideoUrl(video?.video_file_name);
  const tags = Array.isArray(data.tags) ? data.tags : [];

  const preloadUrls = useMemo(() => {
    const urls = [];
    for (let i = 0; i < 3; i++) {
      const next = videos[currentIndex + i];
      if (next?.video_file_name) {
        urls.push(getVideoUrl(next.video_file_name));
      }
    }
    return urls.filter(Boolean);
  }, [videos, currentIndex]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlayClick = () => {
    if (wrapRef.current?.requestFullscreen) {
      wrapRef.current.requestFullscreen().catch(() => {});
    }
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleWheel = (event) => {
    if (scrollLockRef.current || videos.length === 0) return;
    const direction = Math.sign(event.deltaY);
    if (direction === 0) return;

    scrollLockRef.current = true;
    setTimeout(() => {
      scrollLockRef.current = false;
    }, SCROLL_LOCK_MS);

    if (direction > 0) {
      setScrollDirection('down');
      setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1));
    } else {
      setScrollDirection('up');
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleTouchStart = (event) => {
    touchStartRef.current = event.touches?.[0]?.clientY ?? null;
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
  };

  const handleTouchEnd = (event) => {
    if (scrollLockRef.current || videos.length === 0) return;
    const startY = touchStartRef.current;
    const endY = event.changedTouches?.[0]?.clientY ?? null;
    if (startY == null || endY == null) return;
    const delta = startY - endY;
    if (Math.abs(delta) < 40) return;

    scrollLockRef.current = true;
    setTimeout(() => {
      scrollLockRef.current = false;
    }, SCROLL_LOCK_MS);

    if (delta > 0) {
      setScrollDirection('down');
      setCurrentIndex((prev) => Math.min(prev + 1, videos.length - 1));
    } else {
      setScrollDirection('up');
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  return (
    <div
      className="watch-film-page"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <main className="watch-film-container">
        {loading && <p className="watch-film-loading">Chargement…</p>}
        {error && <p className="watch-film-error">{error}</p>}

        {!loading && !error && (
          <div className="watch-film-player">
            <div
              ref={wrapRef}
              className={`watch-film-video-wrap ${isSwitching ? 'is-switching' : ''} ${
                scrollDirection === 'down' ? 'is-switching-down' : ''
              } ${scrollDirection === 'up' ? 'is-switching-up' : ''}`}
              onClick={handlePlayClick}
            >
              <video
                ref={videoRef}
                className="watch-film-video"
                src={videoUrl || undefined}
                poster={coverUrl || undefined}
                controls
                onPlay={handlePlay}
                onPause={handlePause}
                preload="metadata"
              />

              {!isPlaying && (
                <div className="watch-film-overlay is-visible">
                  <div className="watch-film-nav">
                    <Link to={ROUTES.GALERIE_FILMS} className="watch-film-back">
                      ← Retour à la galerie
                    </Link>
                    <Link to={ROUTES.HOME} className="watch-film-home">
                      Accueil
                    </Link>
                  </div>
                  <div className="watch-film-play-center">
                    <button className="watch-film-play" onClick={handlePlayClick} aria-label="Lire la vidéo">
                      <svg
                        className="watch-film-play-icon"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="watch-film-bottom">
                    <div className="watch-film-left">
                      <div className="watch-film-meta">
                        <span className="watch-film-tag">VIDÉO</span>
                        <h1 className="watch-film-title">{title}</h1>
                        <p className="watch-film-info">
                          <strong>Réalisateur :</strong> {director}
                        </p>
                        <p className="watch-film-info">
                          <strong>Nationalité :</strong> {country}
                        </p>
                        <p className="watch-film-synopsis">
                          {synopsis}
                        </p>
                        {tags.length > 0 && (
                          <div className="watch-film-tags">
                            {tags.map((tag, idx) => (
                              <span
                                key={`${tag.name || tag}-${idx}`}
                                className="watch-film-tag-pill"
                              >
                                {tag.name || tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>
      <div className="watch-film-preload" aria-hidden>
        {preloadUrls.map((url) => (
          <video key={url} src={url} preload="metadata" />
        ))}
      </div>
    </div>
  );
};

export default WatchFilm;