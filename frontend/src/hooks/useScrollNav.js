import { useEffect, useRef, useState } from 'react';

/**
 * useScrollNav — gestion du scroll de navigation (TikTok-style)
 *
 * Paramètres :
 *   onNext()          — appelé quand scroll/swipe vers le bas
 *   onPrev()          — appelé quand scroll/swipe vers le haut
 *   panelSelector     — sélecteur CSS des zones scrollables à ignorer
 *                       (ex: '.wf-admin-panel') — le scroll dans ces zones ne déclenche pas la nav
 *   lockMs            — délai anti-rebond entre deux navigations (défaut 700ms)
 *   enabled           — active/désactive le service (défaut true)
 *
 * Retourne :
 *   scrollDirection   — 'up' | 'down' | null (pour les animations CSS)
 *   touchHandlers     — { onTouchStart, onTouchMove, onTouchEnd } à poser sur le container
 */

const DEFAULT_LOCK_MS   = 700;
const MIN_SWIPE_PX      = 40;

export function useScrollNav({
    onNext,
    onPrev,
    panelSelector = '.wf-admin-panel',
    lockMs        = DEFAULT_LOCK_MS,
    enabled       = true,
} = {}) {

    const [scrollDirection, setScrollDirection] = useState(null);

    const lockRef         = useRef(false);
    const touchStartRef   = useRef(null);
    const touchInPanelRef = useRef(false);
    const onNextRef       = useRef(onNext);
    const onPrevRef       = useRef(onPrev);

    // maintient les callbacks à jour sans rebinder les listeners
    onNextRef.current = onNext;
    onPrevRef.current = onPrev;

    // =====================================================
    // NAVIGATION CORE
    // =====================================================
    function navigate(direction) {
        if (!enabled || lockRef.current) return;
        lockRef.current = true;
        setTimeout(() => { lockRef.current = false; }, lockMs);

        setScrollDirection(direction);
        if (direction === 'down') onNextRef.current?.();
        else                      onPrevRef.current?.();
    }

    // =====================================================
    // BLOCAGE DU SCROLL BODY
    // =====================================================
    useEffect(() => {
        if (!enabled) return;

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
            if (panelSelector && e.target?.closest?.(panelSelector)) return;
            e.preventDefault();
        };

        window.addEventListener('wheel',     prevent, { passive: false });
        window.addEventListener('touchmove', prevent, { passive: false });

        return () => {
            document.body.style.overflow           = prev.overflow;
            document.body.style.overscrollBehavior = prev.overscroll;
            document.body.style.position           = prev.position;
            document.body.style.top                = prev.top;
            document.body.style.width              = prev.width;
            window.scrollTo(0, scrollY);
            window.removeEventListener('wheel',     prevent);
            window.removeEventListener('touchmove', prevent);
        };
    }, [enabled, panelSelector]);

    // =====================================================
    // NAVIGATION AU WHEEL
    // =====================================================
    useEffect(() => {
        if (!enabled) return;

        const onWheel = (e) => {
            if (panelSelector && e.target?.closest?.(panelSelector)) return;
            e.preventDefault();
            const dir = Math.sign(e.deltaY);
            if      (dir > 0) navigate('down');
            else if (dir < 0) navigate('up');
        };

        document.addEventListener('wheel', onWheel, { passive: false });
        return () => document.removeEventListener('wheel', onWheel);
    }, [enabled, panelSelector]);

    // =====================================================
    // NAVIGATION AU TOUCH (swipe)
    // =====================================================
    const touchHandlers = {
        onTouchStart(e) {
            touchStartRef.current   = e.touches?.[0]?.clientY ?? null;
            touchInPanelRef.current = !!(panelSelector && e.target?.closest?.(panelSelector));
        },
        onTouchMove(e) {
            if (panelSelector && e.target?.closest?.(panelSelector)) return;
            e.preventDefault();
        },
        onTouchEnd(e) {
            if (touchInPanelRef.current) return;
            const startY = touchStartRef.current;
            const endY   = e.changedTouches?.[0]?.clientY ?? null;
            if (startY == null || endY == null) return;
            const delta = startY - endY;
            if (Math.abs(delta) < MIN_SWIPE_PX) return;
            navigate(delta > 0 ? 'down' : 'up');
        },
    };

    return { scrollDirection, touchHandlers };
}
