/**
 * Reveal.jsx — wrapper whileInView réutilisable
 *
 * Usage simple :
 *   <Reveal><h2>Titre</h2></Reveal>
 *
 * Changer l'élément HTML :
 *   <Reveal as="section">...</Reveal>
 *   <Reveal as="article">...</Reveal>
 *
 * Conteneur stagger (les enfants motion.x variants={fadeUp} s'animent en cascade) :
 *   <Reveal stagger as="div" className="grid">
 *     {items.map(i => <motion.article key={i} variants={fadeUp}>...</motion.article>)}
 *   </Reveal>
 *
 * Variante custom :
 *   import { scaleIn } from '../../../utils/animations';
 *   <Reveal variant={scaleIn} delay={0.2}>...</Reveal>
 */
import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, VIEWPORT } from '../../../utils/animations';

const Reveal = ({
  children,
  as       = 'div',
  variant,
  delay    = 0,
  stagger  = false,
  className,
  style,
  viewport,
}) => {
  const Component = motion[as] ?? motion.div;
  const v = stagger ? staggerContainer : (variant ?? fadeUp);

  return (
    <Component
      variants={v}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={viewport ?? VIEWPORT}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
};

export default Reveal;
