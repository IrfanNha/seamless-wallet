'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  duration = 3,
  className = '',
}) => {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ParticleProps {
  size?: number;
  color?: string;
  delay?: number;
  duration?: number;
}

export const Particle: React.FC<ParticleProps> = ({
  size = 4,
  color = 'rgba(100, 116, 139, 0.3)',
  delay = 0,
  duration = 4,
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        y: [-20, -100],
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
};

export const ParticleField: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    delay: number;
    size: number;
    color: string;
  }>>([]);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      delay: i * 0.2,
      size: Math.random() * 6 + 2,
      color: `rgba(100, 116, 139, ${Math.random() * 0.3 + 0.1})`,
    }));
    setParticles(generatedParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          delay={particle.delay}
          size={particle.size}
          color={particle.color}
        />
      ))}
    </div>
  );
};
