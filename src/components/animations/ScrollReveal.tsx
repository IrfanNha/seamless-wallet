'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { ANIMATION_DURATION } from '@/constants';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = ANIMATION_DURATION.NORMAL,
  distance = 50,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  const directionVariants = {
    up: { y: distance, opacity: 0 },
    down: { y: -distance, opacity: 0 },
    left: { x: distance, opacity: 0 },
    right: { x: -distance, opacity: 0 },
  };

  const animateVariants = {
    visible: { x: 0, y: 0, opacity: 1 },
    hidden: directionVariants[direction],
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animateVariants}
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
