import { useEffect, useRef, useState } from 'react';

/**
 * useScrollNav — gestion du scroll de navigation (TikTok-style)
 *
 * Paramètres :
 *   onNext()          — appelé quand scroll/swipe vers le bas
 *   onPrev()          — appelé quand scroll/swipe vers le haut
 *   panelSelector     — sélecteur CSS des zones scrollables internes à ignorer
 *                       (supporte les sélecteurs multiples CSS, ex: '.panel, .modal')
 *   lockMs            — délai anti-rebond entre deux navigations (défaut 700ms)
 *   enabled           — active/désactive la navigation (le body lock reste actif)
 *
 * Retourne :
 *   scrollDirection   — 'up' | 'down' | null (pour les animations CSS)
 *   touchHandlers     — { onTouchStart, onTouchMove, onTouchEnd } à poser sur le container
 */

const MIN_SWIPE_PX = 40;

export function useScrollNav({
    onNext,
    onPrev,
    panelSelector = '.wf-admin-panel',
    lockMs        = 700,
    enabled       = true,
} = {}) {

    const [scrollDirection, setScrollDirection] = useState(null);

    // Toutes les valeurs mutables passent par des refs
    // → les listeners restent bindés une seule fois (pas de re-bind sur chaque render)
    const lockRef           = useRef(false);
    const touchStartRef     = useRef(null);
    const touchInPanelRef   = useRef(false);
    const onNextRef         = useRef(onNext);
    const onPrevRef         = useRef(onPrev);
    const panelSelectorRef  = useRef(panelSelector);
    const enabledRef        = useRef(enabled);
    const lockMsRef         = useRef(lockMs);

    // Mise à jour des refs à chaque render (sans re-binder les listeners)
    onNextRef.current        = onNext;
    onPrevRef.current        = onPrev;
    panelSelectorRef.current = panelSelector;
    enabledRef.current       = enabled;
    lockMsRef.current        = lockMs;

    // navigate est lui-même dans une ref pour éviter toute closure figée
    const navigateRef = useRef(null);
    navigateRef.current = (direction) => {
        if (!enabledRef.current || lockRef.current) return;
        lockRef.current = true;
        setTimeout(() => { lockRef.current = false; }, lockMsRef.current);

        setScrollDirection(direction);
        if (direction === 'down') onNextRef.current?.();
        else                      onPrevRef.current?.();
    };

    // =====================================================
    // BLOCAGE DU SCROLL BODY — monté une fois, retiré au démontage
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
            if (panelSelectorRef.current && e.target?.closest?.(panelSelectorRef.current)) return;
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
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // =====================================================
    // NAVIGATION AU WHEEL — bindé une fois, navigateRef toujours à jour
    // =====================================================
    useEffect(() => {
        const onWheel = (e) => {
            if (panelSelectorRef.current && e.target?.closest?.(panelSelectorRef.current)) return;
            e.preventDefault();
            const dir = Math.sign(e.deltaY);
            if      (dir > 0) navigateRef.current('down');
            else if (dir < 0) navigateRef.current('up');
        };

        document.addEventListener('wheel', onWheel, { passive: false });
        return () => document.removeEventListener('wheel', onWheel);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // =====================================================
    // NAVIGATION AU TOUCH — handlers React, toujours à jour
    // =====================================================
    const touchHandlers = {
        onTouchStart(e) {
            touchStartRef.current   = e.touches?.[0]?.clientY ?? null;
            touchInPanelRef.current = !!(
                panelSelectorRef.current && e.target?.closest?.(panelSelectorRef.current)
            );
        },
        onTouchMove(e) {
            if (panelSelectorRef.current && e.target?.closest?.(panelSelectorRef.current)) return;
            e.preventDefault();
        },
        onTouchEnd(e) {
            if (touchInPanelRef.current) return;
            const startY = touchStartRef.current;
            const endY   = e.changedTouches?.[0]?.clientY ?? null;
            if (startY == null || endY == null) return;
            const delta = startY - endY;
            if (Math.abs(delta) < MIN_SWIPE_PX) return;
            navigateRef.current(delta > 0 ? 'down' : 'up');
        },
    };

    return { scrollDirection, touchHandlers };
}
