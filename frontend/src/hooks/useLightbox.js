import { useCallback, useState } from 'react';

/**
 * useLightbox — visionneuse d'images plein-écran réutilisable
 *
 * Usage :
 *   const { lightboxProps, openLightbox } = useLightbox();
 *   // ouvrir sur l'image cliquée :
 *   <img onClick={() => openLightbox(urls, index)} />
 *   // rendu du composant :
 *   <Lightbox {...lightboxProps} />
 *
 * lightboxProps expose :
 *   isOpen, images, currentIndex, onClose, onNext, onPrev, onGoTo
 */

export function useLightbox() {
    const [isOpen,       setIsOpen]       = useState(false);
    const [images,       setImages]       = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openLightbox = useCallback((imgs, startIndex = 0) => {
        setImages(imgs);
        setCurrentIndex(Math.max(0, Math.min(startIndex, imgs.length - 1)));
        setIsOpen(true);
    }, []);

    const closeLightbox = useCallback(() => setIsOpen(false), []);

    const next = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const goTo = useCallback((index) => {
        setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
    }, [images.length]);

    return {
        openLightbox,
        lightboxProps: {
            isOpen,
            images,
            currentIndex,
            onClose: closeLightbox,
            onNext:  next,
            onPrev:  prev,
            onGoTo:  goTo,
        },
    };
}
