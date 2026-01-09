import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
}

interface HappyParticlesProps {
  particles: HeartParticle[];
}

export const HeartParticles: React.FC<HappyParticlesProps> = ({ particles }) => (
  <AnimatePresence>
    {particles.map(particle => (
      <motion.div
        key={particle.id}
        className="absolute pointer-events-none z-50"
        style={{ left: particle.x, top: particle.y }}
        initial={{ opacity: 1, scale: 0, y: 0 }}
        animate={{ 
          opacity: 0, 
          scale: 1.5, 
          y: -80,
          x: (Math.random() - 0.5) * 60
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
      </motion.div>
    ))}
  </AnimatePresence>
);

interface ExcitementParticlesProps {
  isActive: boolean;
  centerX: number;
  centerY: number;
}

export const ExcitementParticles: React.FC<ExcitementParticlesProps> = ({ 
  isActive, 
  centerX, 
  centerY 
}) => {
  if (!isActive) return null;

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    delay: i * 0.05
  }));

  return (
    <div 
      className="absolute pointer-events-none z-50"
      style={{ left: centerX, top: centerY }}
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{ 
            opacity: 1, 
            scale: 0,
            x: 0,
            y: 0
          }}
          animate={{ 
            opacity: [1, 1, 0],
            scale: [0, 1.2, 0.8],
            x: Math.cos(particle.angle * Math.PI / 180) * 120,
            y: Math.sin(particle.angle * Math.PI / 180) * 120
          }}
          transition={{ 
            duration: 1,
            delay: particle.delay,
            ease: "easeOut"
          }}
        >
          {particle.id % 3 === 0 ? (
            <Sparkles className="w-6 h-6 text-yellow-400" />
          ) : particle.id % 3 === 1 ? (
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          ) : (
            <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

interface NuzzleEffectProps {
  isActive: boolean;
  x: number;
  y: number;
}

export const NuzzleEffect: React.FC<NuzzleEffectProps> = ({ isActive, x, y }) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
    >
      <motion.div
        className="flex gap-1"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <span className="text-2xl">💕</span>
      </motion.div>
    </motion.div>
  );
};

interface EatingEffectProps {
  isActive: boolean;
  x: number;
  y: number;
}

export const EatingEffect: React.FC<EatingEffectProps> = ({ isActive, x, y }) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ 
          opacity: [1, 1, 0],
          scale: [1, 1.3, 0.5],
          y: [0, -30, -50]
        }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-3xl">😋</span>
      </motion.div>
    </motion.div>
  );
};

export default { HeartParticles, ExcitementParticles, NuzzleEffect, EatingEffect };
