import React from 'react';
import { motion } from 'framer-motion';

export type PetType = 'dog' | 'cat' | 'fish';
export type EvolutionStage = 'baby' | 'teen' | 'guardian';

interface EvolutionPetSVGProps {
  type: PetType;
  stage: EvolutionStage;
  size?: number;
  isPetting: boolean;
  isEating: boolean;
  isBlinking: boolean;
  isSad: boolean;
  facingDirection: 'left' | 'right';
  isMoving: boolean;
}

// Get size multiplier based on evolution stage
export const getEvolutionSize = (stage: EvolutionStage): number => {
  switch (stage) {
    case 'baby': return 0.7;
    case 'teen': return 0.9;
    case 'guardian': return 1.1;
  }
};

// ============================================
// DOG EVOLUTIONS: Puppy -> Golden Retriever -> Celestial Dog
// ============================================

const BabyDogSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage'>> = ({ 
  size = 280, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xl">
    <defs>
      <radialGradient id="puppyFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fcd5a0" />
        <stop offset="50%" stopColor="#e8b87a" />
        <stop offset="100%" stopColor="#d4a574" />
      </radialGradient>
      <radialGradient id="puppyNose" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#3d2914" />
        <stop offset="100%" stopColor="#1a0f08" />
      </radialGradient>
    </defs>
    
    {/* Chubby baby body */}
    <motion.ellipse
      cx="50" cy="62" rx="26" ry="22"
      fill="url(#puppyFur)"
      animate={{ 
        scaleY: isPetting ? [1, 0.9, 1.1, 1] : [1, 1.03, 1],
        scaleX: isPetting ? [1, 1.1, 0.9, 1] : [1, 0.97, 1]
      }}
      transition={{ duration: isPetting ? 0.4 : 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: '50px 62px' }}
    />
    
    {/* Belly */}
    <ellipse cx="50" cy="66" rx="16" ry="12" fill="#fef3e2" />
    
    {/* Short stubby legs */}
    <motion.g animate={isMoving ? { y: [0, -2, 0, 2, 0] } : {}} transition={{ duration: 0.25, repeat: Infinity }}>
      <ellipse cx="34" cy="80" rx="7" ry="6" fill="#e8b87a" />
      <ellipse cx="66" cy="80" rx="7" ry="6" fill="#e8b87a" />
      <ellipse cx="40" cy="79" rx="5" ry="5" fill="#d4a574" />
      <ellipse cx="60" cy="79" rx="5" ry="5" fill="#d4a574" />
    </motion.g>
    
    {/* Tiny wagging tail */}
    <motion.ellipse
      cx="78" cy="58" rx="8" ry="5"
      fill="url(#puppyFur)"
      animate={isPetting ? { rotate: [-30, 30, -30] } : isSad ? { rotate: -20 } : { rotate: [-10, 10, -10] }}
      transition={{ duration: isPetting ? 0.2 : 0.5, repeat: Infinity }}
      style={{ transformOrigin: '72px 58px' }}
    />
    
    {/* Big puppy head */}
    <motion.g
      animate={isEating ? { y: [0, 6, 0] } : isSad ? { y: 2 } : {}}
      transition={{ duration: 0.2, repeat: isEating ? Infinity : 0 }}
    >
      <circle cx="50" cy="35" r="22" fill="url(#puppyFur)" />
      
      {/* Floppy ears */}
      <motion.ellipse
        cx="26" cy="32" rx="10" ry="14"
        fill="#d4a574"
        animate={isPetting ? { rotate: [-15, 15] } : isSad ? { rotate: 30, y: 6 } : { rotate: [-5, 5] }}
        transition={{ duration: isPetting ? 0.15 : 1.5, repeat: Infinity }}
        style={{ transformOrigin: '32px 26px' }}
      />
      <motion.ellipse
        cx="74" cy="32" rx="10" ry="14"
        fill="#d4a574"
        animate={isPetting ? { rotate: [15, -15] } : isSad ? { rotate: -30, y: 6 } : { rotate: [5, -5] }}
        transition={{ duration: isPetting ? 0.15 : 1.5, repeat: Infinity }}
        style={{ transformOrigin: '68px 26px' }}
      />
      
      {/* Big sparkly eyes */}
      <motion.g
        animate={isBlinking ? { scaleY: 0.1 } : {}}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '40px 32px' }}
      >
        <ellipse cx="40" cy="32" rx="7" ry="8" fill="#2d1f14" />
        <ellipse cx="41" cy="30" rx="3" ry="3" fill="white" />
        <circle cx="38" cy="34" r="1.5" fill="white" opacity="0.6" />
      </motion.g>
      <motion.g
        animate={isBlinking ? { scaleY: 0.1 } : {}}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '60px 32px' }}
      >
        <ellipse cx="60" cy="32" rx="7" ry="8" fill="#2d1f14" />
        <ellipse cx="61" cy="30" rx="3" ry="3" fill="white" />
        <circle cx="58" cy="34" r="1.5" fill="white" opacity="0.6" />
      </motion.g>
      
      {/* Sad eyebrows */}
      {isSad && (
        <>
          <line x1="34" y1="23" x2="46" y2="26" stroke="#8b6914" strokeWidth="2" strokeLinecap="round" />
          <line x1="54" y1="26" x2="66" y2="23" stroke="#8b6914" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      
      {/* Cute snoot */}
      <ellipse cx="50" cy="42" rx="9" ry="6" fill="#fcd5a0" />
      <ellipse cx="50" cy="40" rx="5" ry="3" fill="url(#puppyNose)" />
      <ellipse cx="49" cy="39" rx="1.5" ry="1" fill="white" opacity="0.5" />
      
      {/* Mouth expressions */}
      {isPetting ? (
        <>
          <path d="M42 48 Q50 56 58 48" fill="none" stroke="#3d2914" strokeWidth="2" strokeLinecap="round" />
          <motion.ellipse cx="50" cy="54" rx="6" ry="8" fill="#ff9eb5" animate={{ scaleY: [0, 1] }} style={{ transformOrigin: '50px 48px' }} />
        </>
      ) : isEating ? (
        <motion.ellipse cx="50" cy="48" rx="5" ry="5" fill="#3d2914" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.15, repeat: Infinity }} />
      ) : isSad ? (
        <path d="M44 50 Q50 46 56 50" fill="none" stroke="#3d2914" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M45 48 Q50 52 55 48" fill="none" stroke="#3d2914" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </motion.g>
    
    {/* Blush */}
    {isPetting && (
      <>
        <ellipse cx="30" cy="38" rx="5" ry="2.5" fill="#ffb6c1" opacity="0.6" />
        <ellipse cx="70" cy="38" rx="5" ry="2.5" fill="#ffb6c1" opacity="0.6" />
      </>
    )}
  </svg>
);

const TeenDogSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage'>> = ({ 
  size = 320, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <radialGradient id="goldenFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffd97a" />
        <stop offset="40%" stopColor="#e8b84a" />
        <stop offset="100%" stopColor="#c99a32" />
      </radialGradient>
      <radialGradient id="goldenBelly" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#fff8e8" />
        <stop offset="100%" stopColor="#ffedc8" />
      </radialGradient>
    </defs>
    
    {/* Athletic body */}
    <motion.ellipse
      cx="50" cy="60" rx="28" ry="20"
      fill="url(#goldenFur)"
      animate={{ scaleY: isPetting ? [1, 0.92, 1.08, 1] : [1, 1.02, 1], scaleX: isPetting ? [1, 1.06, 0.94, 1] : [1, 0.98, 1] }}
      transition={{ duration: isPetting ? 0.4 : 2.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: '50px 60px' }}
    />
    <ellipse cx="50" cy="64" rx="16" ry="11" fill="url(#goldenBelly)" />
    
    {/* Fluffy chest */}
    <ellipse cx="50" cy="52" rx="12" ry="8" fill="#fff8e8" />
    
    {/* Strong legs */}
    <motion.g animate={isMoving ? { y: [0, -3, 0, 3, 0] } : {}} transition={{ duration: 0.3, repeat: Infinity }}>
      <ellipse cx="32" cy="78" rx="6" ry="10" fill="#c99a32" />
      <ellipse cx="68" cy="78" rx="6" ry="10" fill="#c99a32" />
      <ellipse cx="40" cy="76" rx="5" ry="11" fill="#e8b84a" />
      <ellipse cx="60" cy="76" rx="5" ry="11" fill="#e8b84a" />
    </motion.g>
    
    {/* Fluffy tail */}
    <motion.path
      d="M76 52 Q94 36 90 58 Q86 75 78 65"
      fill="url(#goldenFur)"
      animate={isPetting ? { rotate: [-25, 25, -25] } : isSad ? { rotate: -18, y: 5 } : { rotate: [-8, 8, -8] }}
      transition={{ duration: isPetting ? 0.25 : 1, repeat: Infinity }}
      style={{ transformOrigin: '76px 58px' }}
    />
    
    {/* Head */}
    <motion.g
      animate={isEating ? { y: [0, 7, 0] } : isSad ? { y: 3, rotate: -2 } : {}}
      transition={{ duration: 0.2, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 32px' }}
    >
      <circle cx="50" cy="32" r="20" fill="url(#goldenFur)" />
      <ellipse cx="50" cy="42" rx="10" ry="7" fill="#ffd97a" />
      
      {/* Soft ears */}
      <motion.ellipse
        cx="28" cy="24" rx="9" ry="15"
        fill="#c99a32"
        animate={isPetting ? { rotate: [-10, 10] } : isSad ? { rotate: 25, y: 6 } : { rotate: [-3, 3] }}
        transition={{ duration: isPetting ? 0.2 : 1.8, repeat: Infinity }}
        style={{ transformOrigin: '34px 28px' }}
      />
      <motion.ellipse
        cx="72" cy="24" rx="9" ry="15"
        fill="#c99a32"
        animate={isPetting ? { rotate: [10, -10] } : isSad ? { rotate: -25, y: 6 } : { rotate: [3, -3] }}
        transition={{ duration: isPetting ? 0.2 : 1.8, repeat: Infinity }}
        style={{ transformOrigin: '66px 28px' }}
      />
      
      {/* Friendly eyes */}
      <motion.g animate={isBlinking ? { scaleY: 0.1 } : {}} transition={{ duration: 0.12 }} style={{ transformOrigin: '42px 30px' }}>
        <ellipse cx="42" cy="30" rx="5" ry="6" fill="#3d2914" />
        <circle cx="43" cy="28" r="2" fill="white" />
      </motion.g>
      <motion.g animate={isBlinking ? { scaleY: 0.1 } : {}} transition={{ duration: 0.12 }} style={{ transformOrigin: '58px 30px' }}>
        <ellipse cx="58" cy="30" rx="5" ry="6" fill="#3d2914" />
        <circle cx="59" cy="28" r="2" fill="white" />
      </motion.g>
      
      {isSad && (
        <>
          <line x1="36" y1="23" x2="48" y2="26" stroke="#8b6914" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="26" x2="64" y2="23" stroke="#8b6914" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      
      <ellipse cx="50" cy="39" rx="5" ry="4" fill="#3d2914" />
      <ellipse cx="49" cy="38" rx="1.5" ry="1" fill="white" opacity="0.4" />
      
      {isPetting ? (
        <>
          <path d="M42 46 Q50 54 58 46" fill="none" stroke="#3d2914" strokeWidth="2" strokeLinecap="round" />
          <motion.ellipse cx="50" cy="52" rx="5" ry="7" fill="#ff8fa3" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: '50px 46px' }} />
        </>
      ) : isSad ? (
        <path d="M44 48 Q50 44 56 48" fill="none" stroke="#3d2914" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M45 46 Q50 50 55 46" fill="none" stroke="#3d2914" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </motion.g>
    
    {isPetting && (
      <>
        <ellipse cx="32" cy="36" rx="4" ry="2" fill="#ffb6c1" opacity="0.6" />
        <ellipse cx="68" cy="36" rx="4" ry="2" fill="#ffb6c1" opacity="0.6" />
      </>
    )}
  </svg>
);

const GuardianDogSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage'>> = ({ 
  size = 380, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <radialGradient id="celestialFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fff7e6" />
        <stop offset="30%" stopColor="#ffd97a" />
        <stop offset="70%" stopColor="#e8b84a" />
        <stop offset="100%" stopColor="#c99a32" />
      </radialGradient>
      <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
        <stop offset="70%" stopColor="#ffa500" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#ffa500" stopOpacity="0" />
      </radialGradient>
      <filter id="celestialGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Celestial aura */}
    <motion.circle
      cx="50" cy="55" r="42"
      fill="url(#auraGlow)"
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Wings */}
    <motion.g
      animate={{ y: isMoving ? [0, -4, 0] : [0, -2, 0] }}
      transition={{ duration: isMoving ? 0.3 : 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.path
        d="M15 45 Q5 25 20 30 Q30 32 25 45 Q20 55 15 45"
        fill="url(#celestialFur)"
        filter="url(#celestialGlow)"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '25px 45px' }}
      />
      <motion.path
        d="M85 45 Q95 25 80 30 Q70 32 75 45 Q80 55 85 45"
        fill="url(#celestialFur)"
        filter="url(#celestialGlow)"
        animate={{ rotate: [5, -5, 5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '75px 45px' }}
      />
    </motion.g>
    
    {/* Majestic body */}
    <motion.ellipse
      cx="50" cy="60" rx="28" ry="20"
      fill="url(#celestialFur)"
      filter="url(#celestialGlow)"
      animate={{ scaleY: isPetting ? [1, 0.92, 1.08, 1] : [1, 1.02, 1] }}
      transition={{ duration: isPetting ? 0.4 : 3, repeat: Infinity }}
      style={{ transformOrigin: '50px 60px' }}
    />
    <ellipse cx="50" cy="64" rx="16" ry="10" fill="#fff8e8" />
    
    {/* Strong legs */}
    <motion.g animate={isMoving ? { y: [0, -3, 0, 3, 0] } : {}} transition={{ duration: 0.3, repeat: Infinity }}>
      <ellipse cx="32" cy="78" rx="6" ry="10" fill="#c99a32" />
      <ellipse cx="68" cy="78" rx="6" ry="10" fill="#c99a32" />
      <ellipse cx="40" cy="76" rx="5" ry="11" fill="#e8b84a" />
      <ellipse cx="60" cy="76" rx="5" ry="11" fill="#e8b84a" />
    </motion.g>
    
    {/* Majestic tail with glow */}
    <motion.path
      d="M76 52 Q96 34 92 58 Q88 78 78 65"
      fill="url(#celestialFur)"
      filter="url(#celestialGlow)"
      animate={isPetting ? { rotate: [-20, 20, -20] } : isSad ? { rotate: -15 } : { rotate: [-6, 6, -6] }}
      transition={{ duration: isPetting ? 0.3 : 1.2, repeat: Infinity }}
      style={{ transformOrigin: '76px 58px' }}
    />
    
    {/* Head with halo */}
    <motion.g
      animate={isEating ? { y: [0, 6, 0] } : isSad ? { y: 2, rotate: -2 } : {}}
      transition={{ duration: 0.2, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 32px' }}
    >
      {/* Halo */}
      <motion.ellipse
        cx="50" cy="10" rx="14" ry="3"
        fill="none"
        stroke="#ffd700"
        strokeWidth="2"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <circle cx="50" cy="32" r="20" fill="url(#celestialFur)" filter="url(#celestialGlow)" />
      <ellipse cx="50" cy="42" rx="10" ry="7" fill="#fff7e6" />
      
      {/* Royal ears */}
      <motion.ellipse
        cx="28" cy="22" rx="9" ry="15"
        fill="#c99a32"
        animate={isPetting ? { rotate: [-8, 8] } : isSad ? { rotate: 20, y: 5 } : { rotate: [-2, 2] }}
        transition={{ duration: isPetting ? 0.25 : 2, repeat: Infinity }}
        style={{ transformOrigin: '34px 28px' }}
      />
      <motion.ellipse
        cx="72" cy="22" rx="9" ry="15"
        fill="#c99a32"
        animate={isPetting ? { rotate: [8, -8] } : isSad ? { rotate: -20, y: 5 } : { rotate: [2, -2] }}
        transition={{ duration: isPetting ? 0.25 : 2, repeat: Infinity }}
        style={{ transformOrigin: '66px 28px' }}
      />
      
      {/* Wise eyes */}
      <motion.g animate={isBlinking ? { scaleY: 0.1 } : {}} transition={{ duration: 0.12 }} style={{ transformOrigin: '42px 30px' }}>
        <ellipse cx="42" cy="30" rx="5" ry="6" fill="#1e3a8a" />
        <circle cx="43" cy="28" r="2.5" fill="white" />
        <motion.circle cx="40" cy="31" r="1" fill="#ffd700" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </motion.g>
      <motion.g animate={isBlinking ? { scaleY: 0.1 } : {}} transition={{ duration: 0.12 }} style={{ transformOrigin: '58px 30px' }}>
        <ellipse cx="58" cy="30" rx="5" ry="6" fill="#1e3a8a" />
        <circle cx="59" cy="28" r="2.5" fill="white" />
        <motion.circle cx="56" cy="31" r="1" fill="#ffd700" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
      </motion.g>
      
      {isSad && (
        <>
          <line x1="36" y1="23" x2="48" y2="26" stroke="#8b6914" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="26" x2="64" y2="23" stroke="#8b6914" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      
      <ellipse cx="50" cy="39" rx="5" ry="4" fill="#3d2914" />
      
      {isPetting ? (
        <>
          <path d="M42 46 Q50 54 58 46" fill="none" stroke="#3d2914" strokeWidth="2" strokeLinecap="round" />
          <motion.ellipse cx="50" cy="52" rx="5" ry="7" fill="#ff8fa3" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: '50px 46px' }} />
        </>
      ) : isSad ? (
        <path d="M44 48 Q50 44 56 48" fill="none" stroke="#3d2914" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M45 46 Q50 50 55 46" fill="none" stroke="#3d2914" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </motion.g>
    
    {isPetting && (
      <>
        <ellipse cx="32" cy="36" rx="4" ry="2" fill="#ffb6c1" opacity="0.6" />
        <ellipse cx="68" cy="36" rx="4" ry="2" fill="#ffb6c1" opacity="0.6" />
      </>
    )}
  </svg>
);

// ============================================
// CAT EVOLUTIONS: Kitten -> Calico -> Nine-tailed Zen Cat
// ============================================

const BabyCatSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage'>> = ({ 
  size = 280, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xl">
    <defs>
      <radialGradient id="kittenFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#d4d4d8" />
        <stop offset="50%" stopColor="#a1a1aa" />
        <stop offset="100%" stopColor="#71717a" />
      </radialGradient>
    </defs>
    
    {/* Round kitten body */}
    <motion.ellipse
      cx="50" cy="62" rx="24" ry="20"
      fill="url(#kittenFur)"
      animate={{ scaleY: isPetting ? [1, 0.88, 1.1, 1] : [1, 1.03, 1], scaleX: isPetting ? [1, 1.1, 0.9, 1] : [1, 0.97, 1] }}
      transition={{ duration: isPetting ? 0.4 : 3, repeat: Infinity }}
      style={{ transformOrigin: '50px 62px' }}
    />
    <ellipse cx="50" cy="66" rx="14" ry="10" fill="#f4f4f5" />
    
    {/* Stubby legs */}
    <motion.g animate={isMoving ? { y: [0, -2, 0, 2, 0] } : {}} transition={{ duration: 0.2, repeat: Infinity }}>
      <ellipse cx="35" cy="80" rx="6" ry="5" fill="#71717a" />
      <ellipse cx="65" cy="80" rx="6" ry="5" fill="#71717a" />
      <ellipse cx="42" cy="79" rx="5" ry="5" fill="#a1a1aa" />
      <ellipse cx="58" cy="79" rx="5" ry="5" fill="#a1a1aa" />
    </motion.g>
    
    {/* Fluffy short tail */}
    <motion.ellipse
      cx="76" cy="60" rx="10" ry="6"
      fill="url(#kittenFur)"
      animate={isPetting ? { rotate: [-25, 25] } : isSad ? { rotate: -15, y: 5 } : { rotate: [-8, 8] }}
      transition={{ duration: isPetting ? 0.2 : 1.5, repeat: Infinity }}
      style={{ transformOrigin: '70px 60px' }}
    />
    
    {/* Big head */}
    <motion.g
      animate={isEating ? { y: [0, 5, 0] } : isSad ? { y: 2, rotate: -2 } : {}}
      transition={{ duration: 0.2, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 35px' }}
    >
      <circle cx="50" cy="35" r="22" fill="url(#kittenFur)" />
      
      {/* Big pointy ears */}
      <motion.path
        d="M26 32 L20 8 L40 26 Z"
        fill="url(#kittenFur)"
        animate={isPetting ? { rotate: [-8, 8] } : isSad ? { rotate: 18 } : { rotate: [-3, 3] }}
        transition={{ duration: isPetting ? 0.15 : 2, repeat: Infinity }}
        style={{ transformOrigin: '32px 26px' }}
      />
      <path d="M28 30 L24 14 L38 26 Z" fill="#ffc0cb" />
      <motion.path
        d="M74 32 L80 8 L60 26 Z"
        fill="url(#kittenFur)"
        animate={isPetting ? { rotate: [8, -8] } : isSad ? { rotate: -18 } : { rotate: [3, -3] }}
        transition={{ duration: isPetting ? 0.15 : 2, repeat: Infinity }}
        style={{ transformOrigin: '68px 26px' }}
      />
      <path d="M72 30 L76 14 L62 26 Z" fill="#ffc0cb" />
      
      {/* Huge kitten eyes */}
      <motion.g animate={isBlinking ? { scaleY: 0.05 } : {}} transition={{ duration: 0.1 }} style={{ transformOrigin: '40px 32px' }}>
        <ellipse cx="40" cy="32" rx="8" ry="9" fill="#34d399" />
        <ellipse cx="40" cy="32" rx="3" ry="8" fill="#064e3b" />
        <ellipse cx="42" cy="29" rx="2.5" ry="2" fill="white" />
        <circle cx="37" cy="35" r="1.5" fill="white" opacity="0.5" />
      </motion.g>
      <motion.g animate={isBlinking ? { scaleY: 0.05 } : {}} transition={{ duration: 0.1 }} style={{ transformOrigin: '60px 32px' }}>
        <ellipse cx="60" cy="32" rx="8" ry="9" fill="#34d399" />
        <ellipse cx="60" cy="32" rx="3" ry="8" fill="#064e3b" />
        <ellipse cx="62" cy="29" rx="2.5" ry="2" fill="white" />
        <circle cx="57" cy="35" r="1.5" fill="white" opacity="0.5" />
      </motion.g>
      
      {isSad && (
        <>
          <line x1="32" y1="22" x2="48" y2="26" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
          <line x1="52" y1="26" x2="68" y2="22" stroke="#52525b" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      
      {/* Tiny triangle nose */}
      <path d="M47 44 L50 48 L53 44 Z" fill="#ffc0cb" />
      
      {isPetting ? (
        <path d="M44 52 Q50 58 56 52" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
      ) : isSad ? (
        <path d="M46 52 Q50 49 54 52" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <>
          <path d="M50 48 L50 51" stroke="#52525b" strokeWidth="1.5" />
          <path d="M47 53 Q50 56 53 53" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      
      {/* Whiskers */}
      <motion.g stroke="#a1a1aa" strokeWidth="0.8" animate={isPetting ? { x: [0, 2, 0, -2, 0] } : {}} transition={{ duration: 0.3, repeat: isPetting ? 4 : 0 }}>
        <line x1="16" y1="42" x2="32" y2="44" />
        <line x1="15" y1="48" x2="31" y2="48" />
        <line x1="68" y1="44" x2="84" y2="42" />
        <line x1="69" y1="48" x2="85" y2="48" />
      </motion.g>
    </motion.g>
    
    {isPetting && (
      <>
        <ellipse cx="28" cy="40" rx="4" ry="2" fill="#ffc0cb" opacity="0.5" />
        <ellipse cx="72" cy="40" rx="4" ry="2" fill="#ffc0cb" opacity="0.5" />
      </>
    )}
  </svg>
);

const TeenCatSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage'>> = ({ 
  size = 320, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <radialGradient id="calicoOrange" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </radialGradient>
      <radialGradient id="calicoWhite" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#f5f5f4" />
      </radialGradient>
    </defs>
    
    {/* Calico body */}
    <motion.g
      animate={{ scaleY: isPetting ? [1, 0.9, 1.1, 1] : [1, 1.02, 1] }}
      transition={{ duration: isPetting ? 0.4 : 3.5, repeat: Infinity }}
      style={{ transformOrigin: '50px 60px' }}
    >
      <ellipse cx="50" cy="60" rx="26" ry="18" fill="url(#calicoWhite)" />
      {/* Calico patches */}
      <ellipse cx="38" cy="56" rx="10" ry="8" fill="url(#calicoOrange)" />
      <ellipse cx="62" cy="64" rx="8" ry="6" fill="#3f3f46" />
    </motion.g>
    <ellipse cx="50" cy="64" rx="14" ry="9" fill="#fef3f2" />
    
    {/* Elegant legs */}
    <motion.g animate={isMoving ? { y: [0, -2, 0, 2, 0] } : {}} transition={{ duration: 0.25, repeat: Infinity }}>
      <ellipse cx="34" cy="76" rx="5" ry="9" fill="#3f3f46" />
      <ellipse cx="66" cy="76" rx="5" ry="9" fill="url(#calicoOrange)" />
      <ellipse cx="42" cy="75" rx="4" ry="10" fill="url(#calicoWhite)" />
      <ellipse cx="58" cy="75" rx="4" ry="10" fill="url(#calicoWhite)" />
    </motion.g>
    
    {/* Fluffy tail */}
    <motion.path
      d="M74 55 Q94 35 91 58 Q88 78 80 68"
      fill="url(#calicoOrange)"
      animate={isPetting ? { d: ["M74 55 Q94 35 91 58 Q88 78 80 68", "M74 55 Q98 32 94 56 Q90 76 82 66", "M74 55 Q94 35 91 58 Q88 78 80 68"] } : isSad ? { d: "M74 58 Q82 66 78 76 Q74 82 72 78" } : { rotate: [-5, 5, -5] }}
      transition={{ duration: isPetting ? 0.5 : 2, repeat: Infinity }}
      style={{ transformOrigin: '74px 58px' }}
    />
    
    {/* Head with calico markings */}
    <motion.g
      animate={isEating ? { y: [0, 5, 0] } : isSad ? { y: 2, rotate: -2 } : {}}
      transition={{ duration: 0.2, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 32px' }}
    >
      <circle cx="50" cy="32" r="18" fill="url(#calicoWhite)" />
      {/* Face patches */}
      <ellipse cx="38" cy="28" rx="8" ry="6" fill="url(#calicoOrange)" />
      <ellipse cx="62" cy="34" rx="6" ry="5" fill="#3f3f46" />
      
      {/* Ears */}
      <motion.path
        d="M28 28 L22 6 L40 22 Z"
        fill="url(#calicoOrange)"
        animate={isPetting ? { rotate: [-6, 6] } : isSad ? { rotate: 15 } : { rotate: [-2, 2] }}
        transition={{ duration: isPetting ? 0.2 : 2.5, repeat: Infinity }}
        style={{ transformOrigin: '32px 22px' }}
      />
      <path d="M30 26 L26 12 L38 22 Z" fill="#ffc0cb" />
      <motion.path
        d="M72 28 L78 6 L60 22 Z"
        fill="#3f3f46"
        animate={isPetting ? { rotate: [6, -6] } : isSad ? { rotate: -15 } : { rotate: [2, -2] }}
        transition={{ duration: isPetting ? 0.2 : 2.5, repeat: Infinity }}
        style={{ transformOrigin: '68px 22px' }}
      />
      <path d="M70 26 L74 12 L62 22 Z" fill="#ffc0cb" />
      
      {/* Cat eyes */}
      <motion.g animate={isBlinking ? { scaleY: 0.05 } : {}} transition={{ duration: 0.1 }} style={{ transformOrigin: '42px 30px' }}>
        <ellipse cx="42" cy="30" rx="5" ry="6" fill="#fbbf24" />
        <ellipse cx="42" cy="30" rx="2" ry="5" fill="#1c1917" />
        <circle cx="43" cy="28" r="1.5" fill="white" opacity="0.8" />
      </motion.g>
      <motion.g animate={isBlinking ? { scaleY: 0.05 } : {}} transition={{ duration: 0.1 }} style={{ transformOrigin: '58px 30px' }}>
        <ellipse cx="58" cy="30" rx="5" ry="6" fill="#fbbf24" />
        <ellipse cx="58" cy="30" rx="2" ry="5" fill="#1c1917" />
        <circle cx="59" cy="28" r="1.5" fill="white" opacity="0.8" />
      </motion.g>
      
      {isSad && (
        <>
          <line x1="36" y1="23" x2="48" y2="26" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="26" x2="64" y2="23" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      
      <path d="M47 40 L50 44 L53 40 Z" fill="#ffc0cb" />
      
      {isPetting ? (
        <path d="M44 48 Q50 54 56 48" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
      ) : isSad ? (
        <path d="M46 48 Q50 45 54 48" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <>
          <path d="M50 44 L50 47" stroke="#52525b" strokeWidth="1.5" />
          <path d="M47 49 Q50 52 53 49" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      
      {/* Whiskers */}
      <motion.g stroke="#a1a1aa" strokeWidth="0.8" animate={isPetting ? { x: [0, 2, 0, -2, 0] } : {}} transition={{ duration: 0.3, repeat: isPetting ? 4 : 0 }}>
        <line x1="18" y1="38" x2="35" y2="40" />
        <line x1="17" y1="43" x2="34" y2="43" />
        <line x1="18" y1="48" x2="35" y2="46" />
        <line x1="65" y1="40" x2="82" y2="38" />
        <line x1="66" y1="43" x2="83" y2="43" />
        <line x1="65" y1="46" x2="82" y2="48" />
      </motion.g>
    </motion.g>
    
    {isPetting && (
      <>
        <ellipse cx="32" cy="36" rx="3" ry="1.5" fill="#ffc0cb" opacity="0.5" />
        <ellipse cx="68" cy="36" rx="3" ry="1.5" fill="#ffc0cb" opacity="0.5" />
      </>
    )}
  </svg>
);

const GuardianCatSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage'>> = ({ 
  size = 380, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <radialGradient id="zenFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#f5f5f4" />
        <stop offset="50%" stopColor="#e7e5e4" />
        <stop offset="100%" stopColor="#d6d3d1" />
      </radialGradient>
      <radialGradient id="zenAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
        <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
      </radialGradient>
      <filter id="zenGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Mystical aura */}
    <motion.circle
      cx="50" cy="55" r="44"
      fill="url(#zenAura)"
      animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    
    {/* Nine tails */}
    <motion.g animate={isPetting ? {} : { rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity }} style={{ transformOrigin: '74px 58px' }}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.path
          key={i}
          d={`M74 56 Q${90 + (i - 4) * 3} ${30 + Math.abs(i - 4) * 4} ${85 + (i - 4) * 4} ${55 + (i - 4) * 3}`}
          fill="none"
          stroke="#d6d3d1"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#zenGlow)"
          animate={{ 
            d: [
              `M74 56 Q${90 + (i - 4) * 3} ${30 + Math.abs(i - 4) * 4} ${85 + (i - 4) * 4} ${55 + (i - 4) * 3}`,
              `M74 56 Q${92 + (i - 4) * 3} ${28 + Math.abs(i - 4) * 4} ${87 + (i - 4) * 4} ${53 + (i - 4) * 3}`,
              `M74 56 Q${90 + (i - 4) * 3} ${30 + Math.abs(i - 4) * 4} ${85 + (i - 4) * 4} ${55 + (i - 4) * 3}`
            ]
          }}
          transition={{ duration: 2 + i * 0.1, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </motion.g>
    
    {/* Elegant body */}
    <motion.ellipse
      cx="50" cy="60" rx="26" ry="18"
      fill="url(#zenFur)"
      filter="url(#zenGlow)"
      animate={{ scaleY: isPetting ? [1, 0.9, 1.1, 1] : [1, 1.015, 1] }}
      transition={{ duration: isPetting ? 0.4 : 4, repeat: Infinity }}
      style={{ transformOrigin: '50px 60px' }}
    />
    <ellipse cx="50" cy="64" rx="14" ry="9" fill="#fafaf9" />
    
    {/* Graceful legs */}
    <motion.g animate={isMoving ? { y: [0, -1.5, 0, 1.5, 0] } : {}} transition={{ duration: 0.3, repeat: Infinity }}>
      <ellipse cx="34" cy="76" rx="5" ry="9" fill="#a8a29e" />
      <ellipse cx="66" cy="76" rx="5" ry="9" fill="#a8a29e" />
      <ellipse cx="42" cy="75" rx="4" ry="10" fill="#d6d3d1" />
      <ellipse cx="58" cy="75" rx="4" ry="10" fill="#d6d3d1" />
    </motion.g>
    
    {/* Serene head */}
    <motion.g
      animate={isEating ? { y: [0, 4, 0] } : isSad ? { y: 2 } : {}}
      transition={{ duration: 0.2, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 32px' }}
    >
      {/* Third eye marking */}
      <motion.circle
        cx="50" cy="18"
        r="3"
        fill="#a78bfa"
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <circle cx="50" cy="32" r="18" fill="url(#zenFur)" filter="url(#zenGlow)" />
      
      {/* Mystical ears */}
      <motion.path
        d="M28 28 L22 6 L40 22 Z"
        fill="url(#zenFur)"
        animate={isPetting ? { rotate: [-5, 5] } : isSad ? { rotate: 12 } : { rotate: [-1, 1] }}
        transition={{ duration: isPetting ? 0.2 : 3, repeat: Infinity }}
        style={{ transformOrigin: '32px 22px' }}
      />
      <path d="M30 26 L26 12 L38 22 Z" fill="#c4b5fd" />
      <motion.path
        d="M72 28 L78 6 L60 22 Z"
        fill="url(#zenFur)"
        animate={isPetting ? { rotate: [5, -5] } : isSad ? { rotate: -12 } : { rotate: [1, -1] }}
        transition={{ duration: isPetting ? 0.2 : 3, repeat: Infinity }}
        style={{ transformOrigin: '68px 22px' }}
      />
      <path d="M70 26 L74 12 L62 22 Z" fill="#c4b5fd" />
      
      {/* Wise mystical eyes */}
      <motion.g animate={isBlinking ? { scaleY: 0.05 } : {}} transition={{ duration: 0.1 }} style={{ transformOrigin: '42px 30px' }}>
        <ellipse cx="42" cy="30" rx="5" ry="6" fill="#a78bfa" />
        <ellipse cx="42" cy="30" rx="2" ry="5" fill="#4c1d95" />
        <circle cx="43" cy="28" r="1.5" fill="white" opacity="0.9" />
        <motion.circle cx="41" cy="31" r="0.8" fill="#fbbf24" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
      <motion.g animate={isBlinking ? { scaleY: 0.05 } : {}} transition={{ duration: 0.1 }} style={{ transformOrigin: '58px 30px' }}>
        <ellipse cx="58" cy="30" rx="5" ry="6" fill="#a78bfa" />
        <ellipse cx="58" cy="30" rx="2" ry="5" fill="#4c1d95" />
        <circle cx="59" cy="28" r="1.5" fill="white" opacity="0.9" />
        <motion.circle cx="57" cy="31" r="0.8" fill="#fbbf24" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
      </motion.g>
      
      {isSad && (
        <>
          <line x1="36" y1="23" x2="48" y2="26" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="52" y1="26" x2="64" y2="23" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      
      <path d="M47 40 L50 44 L53 40 Z" fill="#ffc0cb" />
      
      {isPetting ? (
        <path d="M44 48 Q50 54 56 48" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
      ) : isSad ? (
        <path d="M46 48 Q50 45 54 48" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <>
          <path d="M50 44 L50 47" stroke="#78716c" strokeWidth="1.5" />
          <path d="M47 49 Q50 52 53 49" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      
      {/* Whiskers */}
      <motion.g stroke="#a8a29e" strokeWidth="0.8" animate={isPetting ? { x: [0, 2, 0, -2, 0] } : {}} transition={{ duration: 0.3, repeat: isPetting ? 4 : 0 }}>
        <line x1="18" y1="38" x2="35" y2="40" />
        <line x1="17" y1="43" x2="34" y2="43" />
        <line x1="18" y1="48" x2="35" y2="46" />
        <line x1="65" y1="40" x2="82" y2="38" />
        <line x1="66" y1="43" x2="83" y2="43" />
        <line x1="65" y1="46" x2="82" y2="48" />
      </motion.g>
    </motion.g>
    
    {isPetting && (
      <>
        <ellipse cx="32" cy="36" rx="3" ry="1.5" fill="#c4b5fd" opacity="0.5" />
        <ellipse cx="68" cy="36" rx="3" ry="1.5" fill="#c4b5fd" opacity="0.5" />
      </>
    )}
  </svg>
);

// ============================================
// FISH EVOLUTIONS: Fry -> Goldfish -> Dragon Fish
// ============================================

const BabyFishSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage'>> = ({ 
  size = 280, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xl">
    <defs>
      <linearGradient id="fryBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bfdbfe" />
        <stop offset="50%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
    
    {/* Tiny swimming body */}
    <motion.g
      animate={{ y: [0, -3, 0, 3, 0], rotate: isMoving ? [-3, 3, -3] : 0 }}
      transition={{ duration: isMoving ? 0.4 : 1.5, repeat: Infinity }}
      style={{ transformOrigin: '50px 50px' }}
    >
      <motion.ellipse
        cx="45" cy="50" rx="22" ry="14"
        fill="url(#fryBody)"
        animate={isPetting ? { scaleY: [1, 0.85, 1.15, 1] } : {}}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: '45px 50px' }}
      />
      <ellipse cx="40" cy="54" rx="12" ry="7" fill="#dbeafe" />
      
      {/* Tail */}
      <motion.path
        d="M67 50 L82 38 L78 50 L82 62 Z"
        fill="url(#fryBody)"
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ duration: 0.35, repeat: Infinity }}
        style={{ transformOrigin: '67px 50px' }}
      />
      
      {/* Dorsal fin */}
      <motion.path
        d="M35 36 Q45 26 55 36"
        fill="#60a5fa"
        animate={{ scaleY: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ transformOrigin: '45px 36px' }}
      />
      
      {/* Pectoral fin */}
      <motion.ellipse
        cx="36" cy="54" rx="6" ry="3"
        fill="#60a5fa"
        animate={{ rotate: [-15, 15, -15] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ transformOrigin: '40px 54px' }}
      />
      
      {/* Big cute eye */}
      <motion.g
        animate={isBlinking ? { scaleY: 0.1 } : {}}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '30px 46px' }}
      >
        <circle cx="30" cy="46" r="8" fill="white" />
        <circle cx="30" cy="46" r="5" fill="#1e40af" />
        <circle cx="28" cy="44" r="2.5" fill="white" />
        <circle cx="32" cy="48" r="1" fill="white" opacity="0.5" />
      </motion.g>
      
      {isSad && <line x1="24" y1="38" x2="36" y2="42" stroke="#1e40af" strokeWidth="1.5" strokeLinecap="round" />}
      
      {/* Mouth */}
      {isPetting ? (
        <motion.ellipse cx="18" cy="50" rx="4" ry="3" fill="#f472b6" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.3, repeat: Infinity }} />
      ) : isEating ? (
        <motion.ellipse cx="18" cy="50" rx="5" ry="5" fill="#1e40af" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.15, repeat: Infinity }} />
      ) : (
        <ellipse cx="18" cy="50" rx="2.5" ry="2" fill="#1e40af" />
      )}
      
      {/* Bubbles */}
      {isPetting && (
        <>
          <motion.circle cx="12" cy="42" r="3" fill="none" stroke="#bfdbfe" strokeWidth="1" initial={{ y: 0, opacity: 1 }} animate={{ y: -20, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} />
          <motion.circle cx="8" cy="48" r="2" fill="none" stroke="#bfdbfe" strokeWidth="1" initial={{ y: 0, opacity: 1 }} animate={{ y: -15, opacity: 0 }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }} />
        </>
      )}
    </motion.g>
  </svg>
);

const TeenFishSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage'>> = ({ 
  size = 320, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <linearGradient id="goldfishBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="30%" stopColor="#f59e0b" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <radialGradient id="goldfishBelly" cx="40%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </radialGradient>
    </defs>
    
    {/* Swimming motion */}
    <motion.g
      animate={{ y: isMoving ? [0, -4, 0, 4, 0] : [0, -2, 0, 2, 0], rotate: isMoving ? [-2, 2, -2] : 0 }}
      transition={{ duration: isMoving ? 0.5 : 2, repeat: Infinity }}
      style={{ transformOrigin: '50px 50px' }}
    >
      {/* Body */}
      <motion.ellipse
        cx="42" cy="50" rx="26" ry="17"
        fill="url(#goldfishBody)"
        animate={isPetting ? { scaleY: [1, 0.9, 1.1, 1] } : {}}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: '42px 50px' }}
      />
      <ellipse cx="38" cy="55" rx="14" ry="8" fill="url(#goldfishBelly)" />
      
      {/* Flowing tail */}
      <motion.path
        d="M68 50 L90 30 L85 50 L90 70 Z"
        fill="url(#goldfishBody)"
        animate={{ rotate: [-12, 12, -12] }}
        transition={{ duration: 0.4, repeat: Infinity }}
        style={{ transformOrigin: '68px 50px' }}
      />
      
      {/* Dorsal fin */}
      <motion.path
        d="M28 33 Q42 18 56 33"
        fill="#d97706"
        animate={{ scaleY: [1, 1.15, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ transformOrigin: '42px 33px' }}
      />
      
      {/* Pectoral fins */}
      <motion.ellipse
        cx="32" cy="55" rx="8" ry="4"
        fill="#d97706"
        animate={{ rotate: [-18, 18, -18] }}
        transition={{ duration: 0.55, repeat: Infinity }}
        style={{ transformOrigin: '38px 55px' }}
      />
      <motion.ellipse
        cx="32" cy="44" rx="6" ry="3"
        fill="#d97706"
        animate={{ rotate: [12, -12, 12] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ transformOrigin: '36px 44px' }}
      />
      
      {/* Scales pattern */}
      <g fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8">
        <path d="M26 45 Q34 42 42 45" />
        <path d="M32 50 Q40 47 48 50" />
        <path d="M36 55 Q44 52 52 55" />
      </g>
      
      {/* Eye */}
      <motion.g
        animate={isBlinking ? { scaleY: 0.1 } : {}}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '25px 46px' }}
      >
        <circle cx="25" cy="46" r="7" fill="white" />
        <circle cx="25" cy="46" r="4.5" fill="#1c1917" />
        <circle cx="23" cy="44" r="2" fill="white" opacity="0.9" />
      </motion.g>
      
      {isSad && <line x1="19" y1="38" x2="31" y2="42" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />}
      
      {/* Mouth */}
      {isPetting ? (
        <motion.ellipse cx="12" cy="50" rx="4" ry="3" fill="#f472b6" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.3, repeat: Infinity }} />
      ) : isEating ? (
        <motion.ellipse cx="12" cy="50" rx="5" ry="5" fill="#92400e" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.15, repeat: Infinity }} />
      ) : (
        <ellipse cx="12" cy="50" rx="3" ry="2" fill="#92400e" />
      )}
      
      {/* Bubbles */}
      {isPetting && (
        <>
          <motion.circle cx="6" cy="42" r="3" fill="none" stroke="#fde68a" strokeWidth="1" initial={{ y: 0, opacity: 1 }} animate={{ y: -22, opacity: 0 }} transition={{ duration: 1.1, repeat: Infinity }} />
          <motion.circle cx="2" cy="48" r="2" fill="none" stroke="#fde68a" strokeWidth="1" initial={{ y: 0, opacity: 1 }} animate={{ y: -18, opacity: 0 }} transition={{ duration: 0.9, repeat: Infinity, delay: 0.4 }} />
        </>
      )}
    </motion.g>
  </svg>
);

const GuardianFishSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage'>> = ({ 
  size = 380, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <linearGradient id="dragonBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="30%" stopColor="#4f46e5" />
        <stop offset="70%" stopColor="#4338ca" />
        <stop offset="100%" stopColor="#3730a3" />
      </linearGradient>
      <radialGradient id="dragonBelly" cx="40%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#e0e7ff" />
        <stop offset="100%" stopColor="#c7d2fe" />
      </radialGradient>
      <radialGradient id="dragonAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
        <stop offset="70%" stopColor="#6366f1" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
      </radialGradient>
      <filter id="dragonGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Mystical aura */}
    <motion.ellipse
      cx="50" cy="50" rx="46" ry="38"
      fill="url(#dragonAura)"
      animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    
    {/* Swimming motion */}
    <motion.g
      animate={{ y: isMoving ? [0, -5, 0, 5, 0] : [0, -2, 0, 2, 0], rotate: isMoving ? [-3, 3, -3] : 0 }}
      transition={{ duration: isMoving ? 0.5 : 2.5, repeat: Infinity }}
      style={{ transformOrigin: '50px 50px' }}
    >
      {/* Dragon whiskers */}
      <motion.path
        d="M12 42 Q0 35 8 48"
        fill="none"
        stroke="#818cf8"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '12px 42px' }}
      />
      <motion.path
        d="M12 54 Q0 62 8 52"
        fill="none"
        stroke="#818cf8"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ rotate: [5, -5, 5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '12px 54px' }}
      />
      
      {/* Majestic body */}
      <motion.ellipse
        cx="42" cy="50" rx="28" ry="18"
        fill="url(#dragonBody)"
        filter="url(#dragonGlow)"
        animate={isPetting ? { scaleY: [1, 0.9, 1.1, 1] } : {}}
        transition={{ duration: 0.4 }}
        style={{ transformOrigin: '42px 50px' }}
      />
      <ellipse cx="38" cy="55" rx="15" ry="9" fill="url(#dragonBelly)" />
      
      {/* Magnificent flowing tail */}
      <motion.g animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ transformOrigin: '70px 50px' }}>
        <path d="M70 50 L95 25 L90 45 L98 50 L90 55 L95 75 Z" fill="url(#dragonBody)" filter="url(#dragonGlow)" />
      </motion.g>
      
      {/* Dragon horns/crest */}
      <motion.path
        d="M24 30 Q30 15 38 28"
        fill="#4338ca"
        animate={{ scaleY: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M35 28 Q42 12 52 26"
        fill="#4338ca"
        animate={{ scaleY: [1, 1.12, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}
      />
      <motion.path
        d="M48 26 Q56 10 64 24"
        fill="#4338ca"
        animate={{ scaleY: [1, 1.08, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
      />
      
      {/* Flowing fins */}
      <motion.ellipse
        cx="30" cy="58" rx="10" ry="5"
        fill="#6366f1"
        animate={{ rotate: [-20, 20, -20] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ transformOrigin: '38px 58px' }}
      />
      <motion.ellipse
        cx="30" cy="42" rx="8" ry="4"
        fill="#6366f1"
        animate={{ rotate: [15, -15, 15] }}
        transition={{ duration: 0.55, repeat: Infinity }}
        style={{ transformOrigin: '36px 42px' }}
      />
      
      {/* Dragon scales pattern */}
      <g fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8">
        <path d="M22 45 Q32 42 42 45" />
        <path d="M28 50 Q38 47 48 50" />
        <path d="M32 55 Q42 52 52 55" />
        <path d="M38 48 Q48 45 58 48" />
      </g>
      
      {/* Mystical eye */}
      <motion.g
        animate={isBlinking ? { scaleY: 0.1 } : {}}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '24px 46px' }}
      >
        <circle cx="24" cy="46" r="8" fill="white" />
        <circle cx="24" cy="46" r="5" fill="#7c3aed" />
        <circle cx="22" cy="44" r="2.5" fill="white" opacity="0.9" />
        <motion.circle cx="26" cy="47" r="1" fill="#fbbf24" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </motion.g>
      
      {isSad && <line x1="18" y1="38" x2="30" y2="42" stroke="#4c1d95" strokeWidth="1.5" strokeLinecap="round" />}
      
      {/* Mouth */}
      {isPetting ? (
        <motion.ellipse cx="10" cy="50" rx="4" ry="3" fill="#f472b6" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.3, repeat: Infinity }} />
      ) : isEating ? (
        <motion.ellipse cx="10" cy="50" rx="6" ry="6" fill="#4c1d95" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.15, repeat: Infinity }} />
      ) : (
        <ellipse cx="10" cy="50" rx="3" ry="2" fill="#4c1d95" />
      )}
      
      {/* Magical bubbles */}
      {isPetting && (
        <>
          <motion.circle cx="4" cy="40" r="3" fill="none" stroke="#c4b5fd" strokeWidth="1" initial={{ y: 0, opacity: 1 }} animate={{ y: -25, opacity: 0 }} transition={{ duration: 1.2, repeat: Infinity }} />
          <motion.circle cx="0" cy="48" r="2" fill="none" stroke="#c4b5fd" strokeWidth="1" initial={{ y: 0, opacity: 1 }} animate={{ y: -20, opacity: 0 }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
          <motion.circle cx="6" cy="55" r="1.5" fill="none" stroke="#c4b5fd" strokeWidth="1" initial={{ y: 0, opacity: 1 }} animate={{ y: -18, opacity: 0 }} transition={{ duration: 0.9, repeat: Infinity, delay: 0.7 }} />
        </>
      )}
    </motion.g>
  </svg>
);

// ============================================
// MAIN EXPORT COMPONENT
// ============================================

export const EvolutionPetSVG: React.FC<EvolutionPetSVGProps> = (props) => {
  const { type, stage, facingDirection, ...rest } = props;
  
  const renderPet = () => {
    if (type === 'dog') {
      switch (stage) {
        case 'baby': return <BabyDogSVG {...rest} facingDirection={facingDirection} />;
        case 'teen': return <TeenDogSVG {...rest} facingDirection={facingDirection} />;
        case 'guardian': return <GuardianDogSVG {...rest} facingDirection={facingDirection} />;
      }
    }
    if (type === 'cat') {
      switch (stage) {
        case 'baby': return <BabyCatSVG {...rest} facingDirection={facingDirection} />;
        case 'teen': return <TeenCatSVG {...rest} facingDirection={facingDirection} />;
        case 'guardian': return <GuardianCatSVG {...rest} facingDirection={facingDirection} />;
      }
    }
    if (type === 'fish') {
      switch (stage) {
        case 'baby': return <BabyFishSVG {...rest} facingDirection={facingDirection} />;
        case 'teen': return <TeenFishSVG {...rest} facingDirection={facingDirection} />;
        case 'guardian': return <GuardianFishSVG {...rest} facingDirection={facingDirection} />;
      }
    }
    return null;
  };
  
  return (
    <div style={{ transform: facingDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
      {renderPet()}
    </div>
  );
};

export default EvolutionPetSVG;
