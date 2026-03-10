/* ============================================================
   animations.js — source unique des variantes Framer Motion
   Utilisé par Reveal.jsx et tous les composants qui animent
   ============================================================ */

export const EASE = [0.25, 0.46, 0.45, 0.94];

/** Viewport par défaut : déclenche une seule fois dès 10 % visible */
export const VIEWPORT = { once: true, amount: 0.1 };

/** Montée + fade — variante principale de scroll */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE },
  }),
};

/** Fade simple — pour les éléments sans déplacement */
export const fadeIn = {
  hidden:   { opacity: 0 },
  visible:  { opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
  exit:     { opacity: 0, transition: { duration: 0.22, ease: 'easeIn'  } },
};

/** Conteneur stagger — les enfants s'animent en cascade */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

/** Scale + fade — pour les cards petites */
export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.42, ease: EASE } },
};

/** Slide depuis la gauche */
export const slideRight = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
  exit:    { opacity: 0, x: 20, transition: { duration: 0.25 } },
};
