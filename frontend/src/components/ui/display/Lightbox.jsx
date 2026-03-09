import React, { useCallback, useEffect } from 'react';

/**
 * Lightbox — visionneuse d'images plein-écran
 *
 * Props (toutes fournies par useLightbox via spread) :
 *   isOpen        — boolean
 *   images        — string[]  (URLs)
 *   currentIndex  — number
 *   onClose()     — ferme la lightbox
 *   onNext()      — image suivante
 *   onPrev()      — image précédente
 *   onGoTo(index) — aller à une image précise (dots)
 */
const Lightbox = ({ isOpen, images = [], currentIndex = 0, onClose, onNext, onPrev, onGoTo }) => {

    const total = images.length;

    // Navigation clavier
    const handleKey = useCallback((e) => {
        if (!isOpen) return;
        if (e.key === 'Escape')     { e.stopPropagation(); onClose?.(); }
        if (e.key === 'ArrowRight') { e.stopPropagation(); onNext?.();  }
        if (e.key === 'ArrowLeft')  { e.stopPropagation(); onPrev?.();  }
    }, [isOpen, onClose, onNext, onPrev]);

    useEffect(() => {
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleKey]);

    if (!isOpen || total === 0) return null;

    const currentUrl = images[currentIndex];

    return (
        <div
            className="lightbox-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Visionneuse d'images"
        >
            {/* Container — stopPropagation pour ne pas fermer au clic à l'intérieur */}
            <div
                className="lightbox"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Bouton fermer */}
                <button
                    className="lightbox-close"
                    onClick={onClose}
                    aria-label="Fermer"
                >
                    ✕
                </button>

                {/* Compteur */}
                <span className="lightbox-counter">{currentIndex + 1} / {total}</span>

                {/* Flèche gauche */}
                {total > 1 && (
                    <button
                        className="lightbox-arrow lightbox-arrow--prev"
                        onClick={onPrev}
                        aria-label="Image précédente"
                    >
                        ‹
                    </button>
                )}

                {/* Image principale */}
                <div className="lightbox-img-wrap">
                    <img
                        key={currentUrl}
                        src={currentUrl}
                        alt={`Image ${currentIndex + 1} sur ${total}`}
                        className="lightbox-img"
                        draggable={false}
                    />
                </div>

                {/* Flèche droite */}
                {total > 1 && (
                    <button
                        className="lightbox-arrow lightbox-arrow--next"
                        onClick={onNext}
                        aria-label="Image suivante"
                    >
                        ›
                    </button>
                )}

                {/* Dots de navigation */}
                {total > 1 && (
                    <div className="lightbox-dots">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                className={`lightbox-dot ${idx === currentIndex ? 'lightbox-dot--active' : ''}`}
                                onClick={() => onGoTo?.(idx)}
                                aria-label={`Image ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lightbox;
