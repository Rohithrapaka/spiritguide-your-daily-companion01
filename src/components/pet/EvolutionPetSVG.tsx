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

// Get evolution stage from total challenges completed
export const getEvolutionStage = (totalChallenges: number): EvolutionStage => {
  if (totalChallenges >= 16) return 'guardian';
  if (totalChallenges >= 6) return 'teen';
  return 'baby';
};

// Get evolution progress percentage within current stage
export const getEvolutionProgress = (totalChallenges: number): number => {
  if (totalChallenges >= 16) return 100;
  if (totalChallenges >= 6) return ((totalChallenges - 6) / 10) * 100;
  return (totalChallenges / 5) * 100;
};

// ===== BABY DOG - Cute Puppy =====
const BabyDogSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage' | 'facingDirection'>> = ({ 
  size = 280, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xl">
    <defs>
      <radialGradient id="babyDogFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fce7c8" />
        <stop offset="50%" stopColor="#e8c896" />
        <stop offset="100%" stopColor="#c4956c" />
      </radialGradient>
      <radialGradient id="babyDogNose" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#5a4538" />
        <stop offset="100%" stopColor="#2d1f14" />
      </radialGradient>
      <filter id="babyShadow">
        <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.2"/>
      </filter>
    </defs>

    {/* Chubby body */}
    <motion.g
      animate={{ 
        scaleY: isPetting ? [1, 0.9, 1.08, 1] : [1, 1.02, 1, 0.98, 1],
        scaleX: isPetting ? [1, 1.08, 0.92, 1] : [1, 0.98, 1, 1.02, 1]
      }}
      transition={{ duration: isPetting ? 0.4 : 2.5, repeat: isPetting ? 0 : Infinity }}
      style={{ transformOrigin: '50px 62px' }}
    >
      <ellipse cx="50" cy="62" rx="22" ry="18" fill="url(#babyDogFur)" filter="url(#babyShadow)" />
      <ellipse cx="50" cy="66" rx="14" ry="10" fill="#faf6f0" />
    </motion.g>

    {/* Stubby legs */}
    <motion.g animate={isMoving ? { y: [0, -2, 0, 2, 0] } : {}} transition={{ duration: 0.25, repeat: Infinity }}>
      <ellipse cx="36" cy="78" rx="6" ry="6" fill="#c4956c" />
      <ellipse cx="64" cy="78" rx="6" ry="6" fill="#c4956c" />
    </motion.g>

    {/* Tiny tail */}
    <motion.ellipse
      cx="72" cy="58" rx="8" ry="5"
      fill="url(#babyDogFur)"
      animate={isPetting ? { rotate: [-30, 30, -30] } : { rotate: [-10, 10, -10] }}
      transition={{ duration: isPetting ? 0.15 : 0.6, repeat: Infinity }}
      style={{ transformOrigin: '68px 58px' }}
    />

    {/* Big round head */}
    <motion.g
      animate={isEating ? { y: [0, 6, 0] } : isSad ? { y: 2, rotate: -3 } : {}}
      transition={{ duration: 0.2, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 38px' }}
    >
      <circle cx="50" cy="38" r="24" fill="url(#babyDogFur)" />
      
      {/* Floppy ears */}
      <motion.ellipse
        cx="26" cy="34" rx="10" ry="14"
        fill="#c4956c"
        animate={isPetting ? { rotate: [-10, 10, -10] } : isSad ? { rotate: 20, y: 6 } : { rotate: [0, -4, 0] }}
        transition={{ duration: isPetting ? 0.2 : 1.8, repeat: isPetting ? 3 : Infinity }}
        style={{ transformOrigin: '30px 30px' }}
      />
      <motion.ellipse
        cx="74" cy="34" rx="10" ry="14"
        fill="#c4956c"
        animate={isPetting ? { rotate: [10, -10, 10] } : isSad ? { rotate: -20, y: 6 } : { rotate: [0, 4, 0] }}
        transition={{ duration: isPetting ? 0.2 : 1.8, repeat: isPetting ? 3 : Infinity }}
        style={{ transformOrigin: '70px 30px' }}
      />

      {/* BIG sparkly eyes */}
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '40px 36px' }}
      >
        <ellipse cx="40" cy="36" rx="7" ry="8" fill="#2d1f14" />
        <ellipse cx="42" cy="34" rx="3" ry="3.5" fill="white" />
        <circle cx="38" cy="38" r="1.5" fill="white" opacity="0.6" />
      </motion.g>
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '60px 36px' }}
      >
        <ellipse cx="60" cy="36" rx="7" ry="8" fill="#2d1f14" />
        <ellipse cx="62" cy="34" rx="3" ry="3.5" fill="white" />
        <circle cx="58" cy="38" r="1.5" fill="white" opacity="0.6" />
      </motion.g>

      {/* Sad eyebrows */}
      {isSad && (
        <>
          <line x1="34" y1="26" x2="44" y2="29" stroke="#8b6914" strokeWidth="2" strokeLinecap="round" />
          <line x1="56" y1="29" x2="66" y2="26" stroke="#8b6914" strokeWidth="2" strokeLinecap="round" />
        </>
      )}

      {/* Cute round nose */}
      <ellipse cx="50" cy="46" rx="5" ry="4" fill="url(#babyDogNose)" />
      <ellipse cx="49" cy="45" rx="1.5" ry="1" fill="white" opacity="0.5" />

      {/* Mouth expressions */}
      {isPetting ? (
        <g>
          <path d="M42 52 Q50 60 58 52" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" />
          <motion.ellipse cx="50" cy="58" rx="6" ry="8" fill="#ff8fa3"
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: '50px 52px' }} />
        </g>
      ) : isSad ? (
        <path d="M44 54 Q50 50 56 54" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" />
      ) : isEating ? (
        <motion.circle cx="50" cy="52" r="4" fill="#4a3728" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.15, repeat: Infinity }} />
      ) : (
        <path d="M44 52 Q50 57 56 52" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* Rosy cheeks */}
      {isPetting && (
        <>
          <motion.ellipse cx="30" cy="42" rx="5" ry="3" fill="#ffb6c1" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
          <motion.ellipse cx="70" cy="42" rx="5" ry="3" fill="#ffb6c1" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} />
        </>
      )}
    </motion.g>
  </svg>
);

// ===== TEEN DOG - Golden Retriever =====
const TeenDogSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage' | 'facingDirection'>> = ({ 
  size = 340, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <radialGradient id="teenDogFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#f5d89a" />
        <stop offset="40%" stopColor="#e8c070" />
        <stop offset="100%" stopColor="#c49a48" />
      </radialGradient>
      <radialGradient id="teenDogBelly" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#fffdf5" />
        <stop offset="100%" stopColor="#f5edd5" />
      </radialGradient>
      <filter id="teenShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25"/>
      </filter>
    </defs>

    {/* Athletic body */}
    <motion.g
      animate={{ 
        scaleY: isPetting ? [1, 0.92, 1.06, 1] : [1, 1.015, 1, 0.985, 1],
        scaleX: isPetting ? [1, 1.06, 0.94, 1] : [1, 0.99, 1, 1.01, 1]
      }}
      transition={{ duration: isPetting ? 0.5 : 3, repeat: isPetting ? 0 : Infinity }}
      style={{ transformOrigin: '50px 60px' }}
    >
      <ellipse cx="50" cy="60" rx="26" ry="20" fill="url(#teenDogFur)" filter="url(#teenShadow)" />
      <ellipse cx="50" cy="64" rx="15" ry="11" fill="url(#teenDogBelly)" />
    </motion.g>

    {/* Back legs */}
    <motion.g animate={isMoving ? { y: [0, -2, 0, 2, 0] } : {}} transition={{ duration: 0.3, repeat: Infinity }}>
      <ellipse cx="32" cy="78" rx="6" ry="8" fill="#b8924a" />
      <ellipse cx="68" cy="78" rx="6" ry="8" fill="#b8924a" />
      <ellipse cx="32" cy="84" rx="5" ry="3" fill="#a07830" />
      <ellipse cx="68" cy="84" rx="5" ry="3" fill="#a07830" />
    </motion.g>

    {/* Front legs */}
    <motion.g animate={isMoving ? { y: [0, 2, 0, -2, 0] } : {}} transition={{ duration: 0.3, repeat: Infinity }}>
      <ellipse cx="40" cy="76" rx="5" ry="9" fill="#d4a860" />
      <ellipse cx="60" cy="76" rx="5" ry="9" fill="#d4a860" />
      <ellipse cx="40" cy="84" rx="4" ry="2.5" fill="#a07830" />
      <ellipse cx="60" cy="84" rx="4" ry="2.5" fill="#a07830" />
    </motion.g>

    {/* Fluffy tail */}
    <motion.path
      d="M74 52 Q90 38 86 52 Q82 66 76 60"
      fill="url(#teenDogFur)"
      animate={isPetting ? { rotate: [-20, 20, -20, 20, 0] } : isSad ? { rotate: -12 } : { rotate: [-6, 6, -6] }}
      transition={{ duration: isPetting ? 0.35 : 1, repeat: isPetting ? 2 : Infinity }}
      style={{ transformOrigin: '74px 56px' }}
    />

    {/* Head */}
    <motion.g
      animate={isEating ? { y: [0, 7, 0], rotate: [0, 4, 0] } : isSad ? { y: 2, rotate: -2 } : {}}
      transition={{ duration: 0.22, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 34px' }}
    >
      <circle cx="50" cy="34" r="20" fill="url(#teenDogFur)" />
      <ellipse cx="50" cy="42" rx="9" ry="7" fill="#f5d89a" />

      {/* Ears */}
      <motion.ellipse
        cx="28" cy="26" rx="9" ry="13"
        fill="#b8924a"
        animate={isPetting ? { rotate: [-8, 8, -8] } : isSad ? { rotate: 22, y: 6 } : { rotate: [0, -3, 0] }}
        transition={{ duration: isPetting ? 0.22 : 1.8, repeat: isPetting ? 3 : Infinity }}
        style={{ transformOrigin: '32px 30px' }}
      />
      <motion.ellipse
        cx="72" cy="26" rx="9" ry="13"
        fill="#b8924a"
        animate={isPetting ? { rotate: [8, -8, 8] } : isSad ? { rotate: -22, y: 6 } : { rotate: [0, 3, 0] }}
        transition={{ duration: isPetting ? 0.22 : 1.8, repeat: isPetting ? 3 : Infinity }}
        style={{ transformOrigin: '68px 30px' }}
      />
      <ellipse cx="29" cy="28" rx="4" ry="6" fill="#d4a860" />
      <ellipse cx="71" cy="28" rx="4" ry="6" fill="#d4a860" />

      {/* Friendly eyes */}
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '42px 32px' }}
      >
        <ellipse cx="42" cy="32" rx="5" ry="6" fill="#3d2914" />
        <ellipse cx="43" cy="30" rx="2" ry="2.5" fill="white" />
        <circle cx="41" cy="33" r="1" fill="white" opacity="0.5" />
      </motion.g>
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '58px 32px' }}
      >
        <ellipse cx="58" cy="32" rx="5" ry="6" fill="#3d2914" />
        <ellipse cx="59" cy="30" rx="2" ry="2.5" fill="white" />
        <circle cx="57" cy="33" r="1" fill="white" opacity="0.5" />
      </motion.g>

      {isSad && (
        <>
          <line x1="38" y1="25" x2="46" y2="27" stroke="#8b6914" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="54" y1="27" x2="62" y2="25" stroke="#8b6914" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="50" cy="42" rx="4.5" ry="3.5" fill="#3d2914" />
      <ellipse cx="49" cy="41" rx="1.2" ry="0.8" fill="white" opacity="0.4" />

      {/* Mouth */}
      {isPetting ? (
        <g>
          <path d="M43 48 Q50 55 57 48" fill="none" stroke="#3d2914" strokeWidth="1.8" strokeLinecap="round" />
          <motion.ellipse cx="50" cy="53" rx="5" ry="6" fill="#ff8fa3"
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: '50px 48px' }} />
        </g>
      ) : isSad ? (
        <path d="M45 49 Q50 46 55 49" fill="none" stroke="#3d2914" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M45 48 Q50 52 55 48" fill="none" stroke="#3d2914" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </motion.g>

    {isPetting && (
      <>
        <motion.ellipse cx="34" cy="38" rx="4" ry="2" fill="#ffb6c1" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
        <motion.ellipse cx="66" cy="38" rx="4" ry="2" fill="#ffb6c1" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
      </>
    )}
  </svg>
);

// ===== GUARDIAN DOG - Celestial Winged Dog =====
const GuardianDogSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage' | 'facingDirection'>> = ({ 
  size = 400, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <radialGradient id="guardianDogFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fff8e7" />
        <stop offset="40%" stopColor="#ffd866" />
        <stop offset="100%" stopColor="#d4a030" />
      </radialGradient>
      <radialGradient id="guardianGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="50%" stopColor="#ffeaa7" />
        <stop offset="100%" stopColor="#fdcb6e" />
      </linearGradient>
      <filter id="guardianShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
      </filter>
      <filter id="auraGlow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    {/* Glowing aura */}
    <motion.circle
      cx="50" cy="55" r="35"
      fill="url(#guardianGlow)"
      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />

    {/* Majestic wings */}
    <motion.g
      animate={{ rotate: isPetting ? [-5, 5, -5] : [0, -2, 0, 2, 0] }}
      transition={{ duration: isPetting ? 0.3 : 3, repeat: Infinity }}
      style={{ transformOrigin: '50px 50px' }}
    >
      <path d="M15 45 Q5 25 15 10 Q25 20 30 35 Q32 45 28 55 Z" fill="url(#wingGrad)" opacity="0.9" />
      <path d="M85 45 Q95 25 85 10 Q75 20 70 35 Q68 45 72 55 Z" fill="url(#wingGrad)" opacity="0.9" />
      {/* Wing feathers */}
      <path d="M18 40 Q12 28 18 18" fill="none" stroke="#ffd866" strokeWidth="1" opacity="0.6" />
      <path d="M22 42 Q16 32 22 22" fill="none" stroke="#ffd866" strokeWidth="1" opacity="0.6" />
      <path d="M82 40 Q88 28 82 18" fill="none" stroke="#ffd866" strokeWidth="1" opacity="0.6" />
      <path d="M78 42 Q84 32 78 22" fill="none" stroke="#ffd866" strokeWidth="1" opacity="0.6" />
    </motion.g>

    {/* Majestic body */}
    <motion.g
      animate={{ 
        scaleY: isPetting ? [1, 0.94, 1.04, 1] : [1, 1.01, 1, 0.99, 1],
        scaleX: isPetting ? [1, 1.04, 0.96, 1] : [1, 0.99, 1, 1.01, 1]
      }}
      transition={{ duration: isPetting ? 0.5 : 4, repeat: isPetting ? 0 : Infinity }}
      style={{ transformOrigin: '50px 58px' }}
    >
      <ellipse cx="50" cy="58" rx="24" ry="18" fill="url(#guardianDogFur)" filter="url(#guardianShadow)" />
      <ellipse cx="50" cy="62" rx="14" ry="10" fill="#fffdf5" />
    </motion.g>

    {/* Strong legs */}
    <motion.g animate={isMoving ? { y: [0, -2, 0, 2, 0] } : {}} transition={{ duration: 0.35, repeat: Infinity }}>
      <ellipse cx="34" cy="75" rx="5" ry="8" fill="#d4a030" />
      <ellipse cx="66" cy="75" rx="5" ry="8" fill="#d4a030" />
      <ellipse cx="42" cy="74" rx="4" ry="9" fill="#e8c070" />
      <ellipse cx="58" cy="74" rx="4" ry="9" fill="#e8c070" />
      <ellipse cx="34" cy="82" rx="4" ry="2.5" fill="#c49a28" />
      <ellipse cx="66" cy="82" rx="4" ry="2.5" fill="#c49a28" />
      <ellipse cx="42" cy="82" rx="3.5" ry="2" fill="#c49a28" />
      <ellipse cx="58" cy="82" rx="3.5" ry="2" fill="#c49a28" />
    </motion.g>

    {/* Flowing tail */}
    <motion.path
      d="M72 50 Q92 32 88 48 Q84 64 75 58"
      fill="url(#guardianDogFur)"
      animate={isPetting ? { rotate: [-18, 18, -18, 18, 0] } : isSad ? { rotate: -10 } : { rotate: [-5, 5, -5] }}
      transition={{ duration: isPetting ? 0.3 : 1.2, repeat: isPetting ? 2 : Infinity }}
      style={{ transformOrigin: '72px 54px' }}
    />

    {/* Noble head */}
    <motion.g
      animate={isEating ? { y: [0, 6, 0], rotate: [0, 3, 0] } : isSad ? { y: 1, rotate: -2 } : {}}
      transition={{ duration: 0.22, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 32px' }}
    >
      <circle cx="50" cy="32" r="18" fill="url(#guardianDogFur)" />
      
      {/* Crown/Halo */}
      <motion.ellipse
        cx="50" cy="14" rx="12" ry="3"
        fill="none" stroke="#ffd700" strokeWidth="1.5"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Regal ears */}
      <motion.ellipse
        cx="30" cy="24" rx="8" ry="12"
        fill="#d4a030"
        animate={isPetting ? { rotate: [-6, 6, -6] } : isSad ? { rotate: 18, y: 4 } : { rotate: [0, -2, 0] }}
        transition={{ duration: isPetting ? 0.2 : 2, repeat: isPetting ? 3 : Infinity }}
        style={{ transformOrigin: '33px 28px' }}
      />
      <motion.ellipse
        cx="70" cy="24" rx="8" ry="12"
        fill="#d4a030"
        animate={isPetting ? { rotate: [6, -6, 6] } : isSad ? { rotate: -18, y: 4 } : { rotate: [0, 2, 0] }}
        transition={{ duration: isPetting ? 0.2 : 2, repeat: isPetting ? 3 : Infinity }}
        style={{ transformOrigin: '67px 28px' }}
      />
      <ellipse cx="31" cy="26" rx="3.5" ry="5.5" fill="#e8c070" />
      <ellipse cx="69" cy="26" rx="3.5" ry="5.5" fill="#e8c070" />

      {/* Wise eyes with golden shimmer */}
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '43px 30px' }}
      >
        <ellipse cx="43" cy="30" rx="4.5" ry="5.5" fill="#3d2914" />
        <ellipse cx="44" cy="28.5" rx="1.8" ry="2.2" fill="white" />
        <circle cx="42" cy="31" r="0.8" fill="white" opacity="0.5" />
        <motion.ellipse cx="43" cy="30" rx="5" ry="6" fill="none" stroke="#ffd700" strokeWidth="0.5"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '57px 30px' }}
      >
        <ellipse cx="57" cy="30" rx="4.5" ry="5.5" fill="#3d2914" />
        <ellipse cx="58" cy="28.5" rx="1.8" ry="2.2" fill="white" />
        <circle cx="56" cy="31" r="0.8" fill="white" opacity="0.5" />
        <motion.ellipse cx="57" cy="30" rx="5" ry="6" fill="none" stroke="#ffd700" strokeWidth="0.5"
          animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>

      {isSad && (
        <>
          <line x1="39" y1="24" x2="47" y2="26" stroke="#c49a28" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="53" y1="26" x2="61" y2="24" stroke="#c49a28" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}

      <ellipse cx="50" cy="38" rx="4" ry="3" fill="#3d2914" />
      <ellipse cx="49" cy="37" rx="1" ry="0.7" fill="white" opacity="0.4" />

      {isPetting ? (
        <g>
          <path d="M44 44 Q50 50 56 44" fill="none" stroke="#3d2914" strokeWidth="1.5" strokeLinecap="round" />
          <motion.ellipse cx="50" cy="48" rx="4" ry="5" fill="#ff8fa3"
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} style={{ transformOrigin: '50px 44px' }} />
        </g>
      ) : isSad ? (
        <path d="M45 45 Q50 43 55 45" fill="none" stroke="#3d2914" strokeWidth="1.3" strokeLinecap="round" />
      ) : (
        <path d="M45 44 Q50 47 55 44" fill="none" stroke="#3d2914" strokeWidth="1.3" strokeLinecap="round" />
      )}
    </motion.g>

    {isPetting && (
      <>
        <motion.ellipse cx="35" cy="35" rx="3.5" ry="1.8" fill="#ffb6c1" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
        <motion.ellipse cx="65" cy="35" rx="3.5" ry="1.8" fill="#ffb6c1" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
      </>
    )}

    {/* Sparkle effects */}
    <motion.g
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
    >
      <circle cx="20" cy="35" r="1.5" fill="#ffd700" />
    </motion.g>
    <motion.g
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
    >
      <circle cx="80" cy="35" r="1.5" fill="#ffd700" />
    </motion.g>
  </svg>
);

// ===== BABY CAT - Cute Kitten =====
const BabyCatSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage' | 'facingDirection'>> = ({ 
  size = 280, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xl">
    <defs>
      <radialGradient id="babyCatFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#b0b8c4" />
        <stop offset="50%" stopColor="#8a94a4" />
        <stop offset="100%" stopColor="#6b7280" />
      </radialGradient>
      <filter id="babyCatShadow">
        <feDropShadow dx="0" dy="3" stdDeviation="2" floodOpacity="0.2"/>
      </filter>
    </defs>

    {/* Round fluffy body */}
    <motion.g
      animate={{ 
        scaleY: isPetting ? [1, 0.88, 1.1, 1] : [1, 1.02, 1, 0.98, 1],
        scaleX: isPetting ? [1, 1.1, 0.9, 1] : [1, 0.98, 1, 1.02, 1]
      }}
      transition={{ duration: isPetting ? 0.45 : 3, repeat: isPetting ? 0 : Infinity }}
      style={{ transformOrigin: '50px 62px' }}
    >
      <ellipse cx="50" cy="62" rx="20" ry="16" fill="url(#babyCatFur)" filter="url(#babyCatShadow)" />
      <ellipse cx="50" cy="66" rx="12" ry="9" fill="#e5e7eb" />
    </motion.g>

    {/* Tiny paws */}
    <motion.g animate={isMoving ? { y: [0, -1, 0, 1, 0] } : {}} transition={{ duration: 0.2, repeat: Infinity }}>
      <ellipse cx="38" cy="76" rx="5" ry="5" fill="#6b7280" />
      <ellipse cx="62" cy="76" rx="5" ry="5" fill="#6b7280" />
    </motion.g>

    {/* Cute curled tail */}
    <motion.path
      d="M68 58 Q82 50 78 65 Q74 75 70 68"
      fill="url(#babyCatFur)"
      animate={isPetting ? { d: ["M68 58 Q82 50 78 65 Q74 75 70 68", "M68 58 Q85 45 80 62 Q76 72 71 66", "M68 58 Q82 50 78 65 Q74 75 70 68"] } : isSad ? { d: "M68 60 Q74 65 70 72 Q66 78 65 74" } : {}}
      transition={{ duration: 0.5, repeat: isPetting ? 2 : 0 }}
    />

    {/* Big round head */}
    <motion.g
      animate={isEating ? { y: [0, 5, 0] } : isSad ? { y: 2, rotate: -3 } : {}}
      transition={{ duration: 0.18, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 38px' }}
    >
      <circle cx="50" cy="38" r="22" fill="url(#babyCatFur)" />

      {/* Pointy ears */}
      <motion.path
        d="M28 35 L22 10 L40 30 Z"
        fill="url(#babyCatFur)"
        animate={isPetting ? { rotate: [-8, 8, -8] } : isSad ? { rotate: 18 } : { rotate: [0, -3, 0, 3, 0] }}
        transition={{ duration: isPetting ? 0.18 : 2.5, repeat: isPetting ? 4 : Infinity }}
        style={{ transformOrigin: '32px 32px' }}
      />
      <path d="M30 32 L26 16 L38 30 Z" fill="#ffc0cb" />
      <motion.path
        d="M72 35 L78 10 L60 30 Z"
        fill="url(#babyCatFur)"
        animate={isPetting ? { rotate: [8, -8, 8] } : isSad ? { rotate: -18 } : { rotate: [0, 3, 0, -3, 0] }}
        transition={{ duration: isPetting ? 0.18 : 2.5, repeat: isPetting ? 4 : Infinity }}
        style={{ transformOrigin: '68px 32px' }}
      />
      <path d="M70 32 L74 16 L62 30 Z" fill="#ffc0cb" />

      {/* Huge cute eyes */}
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.05 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '40px 36px' }}
      >
        <ellipse cx="40" cy="36" rx="7" ry="9" fill="#22d3ee" />
        <ellipse cx="40" cy="36" rx="3" ry="7" fill="#0e7490" />
        <ellipse cx="42" cy="34" rx="2.5" ry="3" fill="white" />
        <circle cx="38" cy="38" r="1" fill="white" opacity="0.6" />
      </motion.g>
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.05 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '60px 36px' }}
      >
        <ellipse cx="60" cy="36" rx="7" ry="9" fill="#22d3ee" />
        <ellipse cx="60" cy="36" rx="3" ry="7" fill="#0e7490" />
        <ellipse cx="62" cy="34" rx="2.5" ry="3" fill="white" />
        <circle cx="58" cy="38" r="1" fill="white" opacity="0.6" />
      </motion.g>

      {/* Tiny pink nose */}
      <path d="M47 46 L50 50 L53 46 Z" fill="#ffc0cb" />

      {/* Mouth */}
      {isPetting ? (
        <path d="M44 53 Q50 59 56 53" fill="none" stroke="#4b5563" strokeWidth="1.8" strokeLinecap="round" />
      ) : isSad ? (
        <path d="M46 54 Q50 51 54 54" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <g>
          <path d="M50 50 L50 53" stroke="#4b5563" strokeWidth="1.5" />
          <path d="M47 55 Q50 58 53 55" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {/* Whiskers */}
      <motion.g stroke="#9ca3af" strokeWidth="0.7" animate={isPetting ? { x: [0, 2, 0, -2, 0] } : {}} transition={{ duration: 0.25, repeat: isPetting ? 4 : 0 }}>
        <line x1="18" y1="42" x2="34" y2="44" />
        <line x1="17" y1="48" x2="33" y2="48" />
        <line x1="66" y1="44" x2="82" y2="42" />
        <line x1="67" y1="48" x2="83" y2="48" />
      </motion.g>
    </motion.g>

    {isPetting && (
      <>
        <motion.ellipse cx="32" cy="42" rx="4" ry="2" fill="#ffc0cb" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
        <motion.ellipse cx="68" cy="42" rx="4" ry="2" fill="#ffc0cb" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
      </>
    )}
  </svg>
);

// ===== TEEN CAT - Calico =====
const TeenCatSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage' | 'facingDirection'>> = ({ 
  size = 340, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <radialGradient id="teenCatFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#f5f5f4" />
        <stop offset="50%" stopColor="#d6d3d1" />
        <stop offset="100%" stopColor="#a8a29e" />
      </radialGradient>
      <filter id="teenCatShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.25"/>
      </filter>
    </defs>

    {/* Elegant body */}
    <motion.g
      animate={{ 
        scaleY: isPetting ? [1, 0.9, 1.08, 1] : [1, 1.02, 1, 0.98, 1],
        scaleX: isPetting ? [1, 1.08, 0.92, 1] : [1, 0.98, 1, 1.02, 1]
      }}
      transition={{ duration: isPetting ? 0.5 : 3.5, repeat: isPetting ? 0 : Infinity }}
      style={{ transformOrigin: '50px 58px' }}
    >
      <ellipse cx="50" cy="58" rx="24" ry="18" fill="url(#teenCatFur)" filter="url(#teenCatShadow)" />
      {/* Calico patches */}
      <ellipse cx="40" cy="55" rx="8" ry="6" fill="#f97316" opacity="0.8" />
      <ellipse cx="58" cy="62" rx="6" ry="5" fill="#1c1917" opacity="0.6" />
      <ellipse cx="50" cy="62" rx="13" ry="9" fill="#fafaf9" />
    </motion.g>

    {/* Graceful legs */}
    <motion.g animate={isMoving ? { y: [0, -1.5, 0, 1.5, 0] } : {}} transition={{ duration: 0.28, repeat: Infinity }}>
      <ellipse cx="34" cy="75" rx="4.5" ry="7" fill="#a8a29e" />
      <ellipse cx="66" cy="75" rx="4.5" ry="7" fill="#a8a29e" />
      <ellipse cx="42" cy="73" rx="4" ry="8" fill="#d6d3d1" />
      <ellipse cx="58" cy="73" rx="4" ry="8" fill="#d6d3d1" />
      <ellipse cx="34" cy="81" rx="4" ry="2" fill="#78716c" />
      <ellipse cx="66" cy="81" rx="4" ry="2" fill="#78716c" />
      <ellipse cx="42" cy="80" rx="3.5" ry="1.8" fill="#78716c" />
      <ellipse cx="58" cy="80" rx="3.5" ry="1.8" fill="#78716c" />
    </motion.g>

    {/* Elegant curving tail */}
    <motion.path
      d="M72 54 Q92 34 90 55 Q88 74 80 66"
      fill="url(#teenCatFur)"
      animate={isPetting ? { d: ["M72 54 Q92 34 90 55 Q88 74 80 66", "M72 54 Q96 30 94 52 Q90 72 82 64", "M72 54 Q92 34 90 55 Q88 74 80 66"] } : isSad ? { d: "M72 56 Q80 62 76 72 Q72 80 70 76" } : { rotate: [-4, 4, -4] }}
      transition={{ duration: isPetting ? 0.55 : 1.8, repeat: isPetting ? 2 : Infinity }}
      style={{ transformOrigin: '72px 56px' }}
    />

    {/* Refined head */}
    <motion.g
      animate={isEating ? { y: [0, 4, 0], rotate: [0, 2, 0] } : isSad ? { y: 1.5, rotate: -2 } : {}}
      transition={{ duration: 0.18, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 34px' }}
    >
      <circle cx="50" cy="34" r="18" fill="url(#teenCatFur)" />
      {/* Calico patch on head */}
      <ellipse cx="58" cy="28" rx="7" ry="5" fill="#f97316" opacity="0.7" />

      {/* Elegant ears */}
      <motion.path
        d="M30 32 L24 10 L42 28 Z"
        fill="url(#teenCatFur)"
        animate={isPetting ? { rotate: [-6, 6, -6] } : isSad ? { rotate: 14 } : { rotate: [0, -2, 0, 2, 0] }}
        transition={{ duration: isPetting ? 0.18 : 2.8, repeat: isPetting ? 4 : Infinity }}
        style={{ transformOrigin: '34px 30px' }}
      />
      <path d="M32 30 L28 15 L40 28 Z" fill="#ffc0cb" />
      <motion.path
        d="M70 32 L76 10 L58 28 Z"
        fill="#f97316"
        animate={isPetting ? { rotate: [6, -6, 6] } : isSad ? { rotate: -14 } : { rotate: [0, 2, 0, -2, 0] }}
        transition={{ duration: isPetting ? 0.18 : 2.8, repeat: isPetting ? 4 : Infinity }}
        style={{ transformOrigin: '66px 30px' }}
      />
      <path d="M68 30 L72 15 L60 28 Z" fill="#ffc0cb" />

      {/* Almond eyes */}
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.05 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '42px 32px' }}
      >
        <ellipse cx="42" cy="32" rx="5" ry="6" fill="#a3e635" />
        <ellipse cx="42" cy="32" rx="2" ry="5" fill="#1c1917" />
        <ellipse cx="43" cy="30" rx="1.5" ry="2" fill="white" />
      </motion.g>
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.05 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '58px 32px' }}
      >
        <ellipse cx="58" cy="32" rx="5" ry="6" fill="#a3e635" />
        <ellipse cx="58" cy="32" rx="2" ry="5" fill="#1c1917" />
        <ellipse cx="59" cy="30" rx="1.5" ry="2" fill="white" />
      </motion.g>

      <path d="M47 42 L50 46 L53 42 Z" fill="#ffc0cb" />

      {isPetting ? (
        <path d="M44 49 Q50 55 56 49" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
      ) : isSad ? (
        <path d="M46 50 Q50 47 54 50" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <g>
          <path d="M50 46 L50 49" stroke="#78716c" strokeWidth="1.5" />
          <path d="M47 51 Q50 54 53 51" fill="none" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      <motion.g stroke="#a8a29e" strokeWidth="0.7" animate={isPetting ? { x: [0, 2, 0, -2, 0] } : {}} transition={{ duration: 0.28, repeat: isPetting ? 4 : 0 }}>
        <line x1="20" y1="40" x2="35" y2="42" />
        <line x1="19" y1="45" x2="34" y2="45" />
        <line x1="65" y1="42" x2="80" y2="40" />
        <line x1="66" y1="45" x2="81" y2="45" />
      </motion.g>
    </motion.g>

    {isPetting && (
      <>
        <motion.ellipse cx="34" cy="38" rx="3.5" ry="1.8" fill="#ffc0cb" initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} />
        <motion.ellipse cx="66" cy="38" rx="3.5" ry="1.8" fill="#ffc0cb" initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} />
      </>
    )}
  </svg>
);

// ===== GUARDIAN CAT - Nine-Tailed Zen Cat =====
const GuardianCatSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage' | 'facingDirection'>> = ({ 
  size = 400, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <radialGradient id="guardianCatFur" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="40%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </radialGradient>
      <radialGradient id="guardianCatGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
      <filter id="guardianCatShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3"/>
      </filter>
    </defs>

    {/* Mystical aura */}
    <motion.circle
      cx="50" cy="55" r="38"
      fill="url(#guardianCatGlow)"
      animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />

    {/* Nine tails spread */}
    <motion.g
      animate={{ rotate: isPetting ? [-3, 3, -3] : [0, -1, 0, 1, 0] }}
      transition={{ duration: isPetting ? 0.4 : 3, repeat: Infinity }}
      style={{ transformOrigin: '72px 58px' }}
    >
      {[...Array(9)].map((_, i) => {
        const angle = -40 + i * 10;
        const length = 25 + Math.abs(4 - i) * 3;
        return (
          <motion.path
            key={i}
            d={`M72 58 Q${85 + Math.cos(angle * Math.PI / 180) * 15} ${45 + Math.sin(angle * Math.PI / 180) * 20} ${72 + Math.cos(angle * Math.PI / 180) * length} ${58 + Math.sin(angle * Math.PI / 180) * length}`}
            fill="none"
            stroke="url(#tailGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ 
              d: isPetting 
                ? [`M72 58 Q${85 + Math.cos(angle * Math.PI / 180) * 15} ${45 + Math.sin(angle * Math.PI / 180) * 20} ${72 + Math.cos(angle * Math.PI / 180) * length} ${58 + Math.sin(angle * Math.PI / 180) * length}`,
                   `M72 58 Q${88 + Math.cos((angle + 5) * Math.PI / 180) * 15} ${42 + Math.sin((angle + 5) * Math.PI / 180) * 20} ${74 + Math.cos((angle + 5) * Math.PI / 180) * length} ${56 + Math.sin((angle + 5) * Math.PI / 180) * length}`,
                   `M72 58 Q${85 + Math.cos(angle * Math.PI / 180) * 15} ${45 + Math.sin(angle * Math.PI / 180) * 20} ${72 + Math.cos(angle * Math.PI / 180) * length} ${58 + Math.sin(angle * Math.PI / 180) * length}`]
                : undefined
            }}
            transition={{ duration: 0.8, repeat: isPetting ? 2 : 0, delay: i * 0.05 }}
          />
        );
      })}
      {/* Tail tip flames */}
      {[...Array(9)].map((_, i) => {
        const angle = -40 + i * 10;
        const length = 25 + Math.abs(4 - i) * 3;
        return (
          <motion.circle
            key={`tip-${i}`}
            cx={72 + Math.cos(angle * Math.PI / 180) * length}
            cy={58 + Math.sin(angle * Math.PI / 180) * length}
            r="2"
            fill="#fbbf24"
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        );
      })}
    </motion.g>

    {/* Majestic body */}
    <motion.g
      animate={{ 
        scaleY: isPetting ? [1, 0.92, 1.06, 1] : [1, 1.015, 1, 0.985, 1],
        scaleX: isPetting ? [1, 1.06, 0.94, 1] : [1, 0.985, 1, 1.015, 1]
      }}
      transition={{ duration: isPetting ? 0.5 : 4, repeat: isPetting ? 0 : Infinity }}
      style={{ transformOrigin: '50px 58px' }}
    >
      <ellipse cx="50" cy="58" rx="22" ry="16" fill="url(#guardianCatFur)" filter="url(#guardianCatShadow)" />
      <ellipse cx="50" cy="62" rx="12" ry="8" fill="#fffbeb" />
    </motion.g>

    {/* Elegant legs */}
    <motion.g animate={isMoving ? { y: [0, -1, 0, 1, 0] } : {}} transition={{ duration: 0.32, repeat: Infinity }}>
      <ellipse cx="36" cy="73" rx="4" ry="7" fill="#d97706" />
      <ellipse cx="64" cy="73" rx="4" ry="7" fill="#d97706" />
      <ellipse cx="44" cy="72" rx="3.5" ry="8" fill="#f59e0b" />
      <ellipse cx="56" cy="72" rx="3.5" ry="8" fill="#f59e0b" />
      <ellipse cx="36" cy="79" rx="3.5" ry="1.8" fill="#b45309" />
      <ellipse cx="64" cy="79" rx="3.5" ry="1.8" fill="#b45309" />
      <ellipse cx="44" cy="79" rx="3" ry="1.5" fill="#b45309" />
      <ellipse cx="56" cy="79" rx="3" ry="1.5" fill="#b45309" />
    </motion.g>

    {/* Mystical head */}
    <motion.g
      animate={isEating ? { y: [0, 4, 0], rotate: [0, 2, 0] } : isSad ? { y: 1, rotate: -1.5 } : {}}
      transition={{ duration: 0.18, repeat: isEating ? Infinity : 0 }}
      style={{ transformOrigin: '50px 32px' }}
    >
      <circle cx="50" cy="32" r="16" fill="url(#guardianCatFur)" />

      {/* Third eye mark */}
      <motion.ellipse
        cx="50" cy="24" rx="2" ry="2"
        fill="#ef4444"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Mystical ears with flames */}
      <motion.path
        d="M32 30 L26 10 L42 26 Z"
        fill="url(#guardianCatFur)"
        animate={isPetting ? { rotate: [-5, 5, -5] } : isSad ? { rotate: 12 } : { rotate: [0, -1.5, 0, 1.5, 0] }}
        transition={{ duration: isPetting ? 0.18 : 3, repeat: isPetting ? 4 : Infinity }}
        style={{ transformOrigin: '35px 28px' }}
      />
      <motion.circle cx="26" cy="10" r="2" fill="#f59e0b" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <path d="M34 28 L30 16 L40 26 Z" fill="#ffc0cb" />
      <motion.path
        d="M68 30 L74 10 L58 26 Z"
        fill="url(#guardianCatFur)"
        animate={isPetting ? { rotate: [5, -5, 5] } : isSad ? { rotate: -12 } : { rotate: [0, 1.5, 0, -1.5, 0] }}
        transition={{ duration: isPetting ? 0.18 : 3, repeat: isPetting ? 4 : Infinity }}
        style={{ transformOrigin: '65px 28px' }}
      />
      <motion.circle cx="74" cy="10" r="2" fill="#f59e0b" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
      <path d="M66 28 L70 16 L60 26 Z" fill="#ffc0cb" />

      {/* Wise golden eyes */}
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.05 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '43px 30px' }}
      >
        <ellipse cx="43" cy="30" rx="4.5" ry="5.5" fill="#fbbf24" />
        <ellipse cx="43" cy="30" rx="1.8" ry="4.5" fill="#1c1917" />
        <ellipse cx="44" cy="28.5" rx="1.2" ry="1.8" fill="white" />
        <motion.ellipse cx="43" cy="30" rx="5" ry="6" fill="none" stroke="#f59e0b" strokeWidth="0.5"
          animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.05 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '57px 30px' }}
      >
        <ellipse cx="57" cy="30" rx="4.5" ry="5.5" fill="#fbbf24" />
        <ellipse cx="57" cy="30" rx="1.8" ry="4.5" fill="#1c1917" />
        <ellipse cx="58" cy="28.5" rx="1.2" ry="1.8" fill="white" />
        <motion.ellipse cx="57" cy="30" rx="5" ry="6" fill="none" stroke="#f59e0b" strokeWidth="0.5"
          animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>

      <path d="M47 38 L50 42 L53 38 Z" fill="#ffc0cb" />

      {isPetting ? (
        <path d="M45 45 Q50 50 55 45" fill="none" stroke="#b45309" strokeWidth="1.3" strokeLinecap="round" />
      ) : isSad ? (
        <path d="M46 46 Q50 44 54 46" fill="none" stroke="#b45309" strokeWidth="1.3" strokeLinecap="round" />
      ) : (
        <g>
          <path d="M50 42 L50 45" stroke="#b45309" strokeWidth="1.3" />
          <path d="M47 47 Q50 50 53 47" fill="none" stroke="#b45309" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      )}

      <motion.g stroke="#d97706" strokeWidth="0.6" animate={isPetting ? { x: [0, 1.5, 0, -1.5, 0] } : {}} transition={{ duration: 0.25, repeat: isPetting ? 4 : 0 }}>
        <line x1="22" y1="36" x2="36" y2="38" />
        <line x1="21" y1="41" x2="35" y2="41" />
        <line x1="64" y1="38" x2="78" y2="36" />
        <line x1="65" y1="41" x2="79" y2="41" />
      </motion.g>
    </motion.g>

    {isPetting && (
      <>
        <motion.ellipse cx="35" cy="35" rx="3" ry="1.5" fill="#ffc0cb" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
        <motion.ellipse cx="65" cy="35" rx="3" ry="1.5" fill="#ffc0cb" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
      </>
    )}

    {/* Floating spirit particles */}
    <motion.circle cx="25" cy="40" r="1.5" fill="#fbbf24" animate={{ opacity: [0, 1, 0], y: [-5, -15] }} transition={{ duration: 2, repeat: Infinity }} />
    <motion.circle cx="75" cy="45" r="1.2" fill="#fbbf24" animate={{ opacity: [0, 1, 0], y: [-5, -15] }} transition={{ duration: 2, repeat: Infinity, delay: 0.7 }} />
    <motion.circle cx="30" cy="70" r="1" fill="#fbbf24" animate={{ opacity: [0, 1, 0], y: [-5, -12] }} transition={{ duration: 2, repeat: Infinity, delay: 1.3 }} />
  </svg>
);

// ===== BABY FISH - Small Fry =====
const BabyFishSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage' | 'facingDirection'>> = ({ 
  size = 280, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-xl">
    <defs>
      <linearGradient id="babyFishBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a5f3fc" />
        <stop offset="50%" stopColor="#67e8f9" />
        <stop offset="100%" stopColor="#22d3ee" />
      </linearGradient>
      <radialGradient id="babyFishBelly" cx="40%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#ecfeff" />
        <stop offset="100%" stopColor="#cffafe" />
      </radialGradient>
      <filter id="babyFishGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <motion.g
      animate={{ 
        y: isMoving ? [0, -4, 0, 4, 0] : [0, -2, 0, 2, 0],
        rotate: isMoving ? [-3, 3, -3] : 0
      }}
      transition={{ duration: isMoving ? 0.4 : 2, repeat: Infinity }}
      style={{ transformOrigin: '50px 50px' }}
    >
      {/* Chubby round body */}
      <motion.ellipse
        cx="48" cy="50" rx="22" ry="18"
        fill="url(#babyFishBody)"
        filter="url(#babyFishGlow)"
        animate={isPetting ? { scaleY: [1, 0.88, 1.1, 1], scaleX: [1, 1.08, 0.92, 1] } : {}}
        transition={{ duration: 0.45 }}
        style={{ transformOrigin: '48px 50px' }}
      />

      {/* Belly */}
      <ellipse cx="44" cy="55" rx="14" ry="10" fill="url(#babyFishBelly)" />

      {/* Tiny tail */}
      <motion.path
        d="M70 50 L85 40 L82 50 L85 60 Z"
        fill="url(#babyFishBody)"
        animate={{ rotate: [-12, 12, -12] }}
        transition={{ duration: 0.3, repeat: Infinity }}
        style={{ transformOrigin: '70px 50px' }}
      />

      {/* Little dorsal fin */}
      <motion.path
        d="M38 32 Q48 22 58 32"
        fill="#22d3ee"
        animate={{ scaleY: [1, 1.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ transformOrigin: '48px 32px' }}
      />

      {/* Small side fin */}
      <motion.ellipse
        cx="38" cy="54" rx="6" ry="4"
        fill="#22d3ee"
        animate={{ rotate: [-12, 12, -12] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ transformOrigin: '42px 54px' }}
      />

      {/* Big cute eye */}
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '36px 46px' }}
      >
        <circle cx="36" cy="46" r="10" fill="white" />
        <circle cx="36" cy="46" r="7" fill="#0ea5e9" />
        <circle cx="36" cy="46" r="4" fill="#0c4a6e" />
        <circle cx="38" cy="44" r="3" fill="white" />
        <circle cx="34" cy="48" r="1.5" fill="white" opacity="0.6" />
      </motion.g>

      {/* Cute mouth */}
      {isPetting ? (
        <ellipse cx="24" cy="52" rx="4" ry="3" fill="#f472b6" />
      ) : isSad ? (
        <ellipse cx="24" cy="52" rx="2.5" ry="1.5" fill="#0c4a6e" />
      ) : isEating ? (
        <motion.ellipse cx="24" cy="52" rx="4" ry="4" fill="#0c4a6e" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.15, repeat: Infinity }} />
      ) : (
        <ellipse cx="24" cy="52" rx="3" ry="2" fill="#0c4a6e" />
      )}

      {/* Bubbles */}
      <motion.circle cx="18" cy="44" r="2" fill="none" stroke="#67e8f9" strokeWidth="0.8"
        animate={{ y: [0, -10], opacity: [1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <motion.circle cx="14" cy="48" r="1.5" fill="none" stroke="#67e8f9" strokeWidth="0.6"
        animate={{ y: [0, -12], opacity: [1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }} />

      {/* Cheek blush */}
      {isPetting && (
        <motion.ellipse cx="30" cy="54" rx="4" ry="2" fill="#f9a8d4" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
      )}
    </motion.g>
  </svg>
);

// ===== TEEN FISH - Goldfish =====
const TeenFishSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage' | 'facingDirection'>> = ({ 
  size = 340, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <linearGradient id="teenFishBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fcd34d" />
        <stop offset="30%" stopColor="#f59e0b" />
        <stop offset="70%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
      <radialGradient id="teenFishBelly" cx="40%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="100%" stopColor="#fde68a" />
      </radialGradient>
      <filter id="teenFishGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <motion.g
      animate={{ 
        y: isMoving ? [0, -3, 0, 3, 0] : [0, -1.5, 0, 1.5, 0],
        rotate: isMoving ? [-2, 2, -2] : 0
      }}
      transition={{ duration: isMoving ? 0.45 : 2, repeat: Infinity }}
      style={{ transformOrigin: '50px 50px' }}
    >
      {/* Elegant body */}
      <motion.ellipse
        cx="45" cy="50" rx="26" ry="18"
        fill="url(#teenFishBody)"
        filter="url(#teenFishGlow)"
        animate={isPetting ? { scaleY: [1, 0.9, 1.08, 1], scaleX: [1, 1.06, 0.94, 1] } : {}}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: '45px 50px' }}
      />

      {/* Shimmering belly */}
      <ellipse cx="40" cy="55" rx="16" ry="10" fill="url(#teenFishBelly)" />

      {/* Flowing tail */}
      <motion.path
        d="M70 50 L92 32 L88 50 L92 68 Z"
        fill="url(#teenFishBody)"
        animate={{ rotate: [-10, 10, -10] }}
        transition={{ duration: 0.4, repeat: Infinity }}
        style={{ transformOrigin: '70px 50px' }}
      />

      {/* Elegant dorsal fin */}
      <motion.path
        d="M32 32 Q45 18 58 32"
        fill="#ea580c"
        animate={{ scaleY: [1, 1.15, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        style={{ transformOrigin: '45px 32px' }}
      />

      {/* Flowing side fins */}
      <motion.ellipse
        cx="35" cy="55" rx="8" ry="5"
        fill="#f59e0b"
        animate={{ rotate: [-15, 15, -15] }}
        transition={{ duration: 0.55, repeat: Infinity }}
        style={{ transformOrigin: '40px 55px' }}
      />

      {/* Beautiful eye */}
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '32px 46px' }}
      >
        <circle cx="32" cy="46" r="8" fill="white" />
        <circle cx="32" cy="46" r="5.5" fill="#1c1917" />
        <circle cx="34" cy="44" r="2.5" fill="white" />
        <circle cx="30" cy="47" r="1" fill="white" opacity="0.6" />
      </motion.g>

      {/* Scales pattern */}
      <ellipse cx="50" cy="50" rx="3" ry="4" fill="#fcd34d" opacity="0.4" />
      <ellipse cx="56" cy="48" rx="2.5" ry="3.5" fill="#fcd34d" opacity="0.4" />
      <ellipse cx="54" cy="54" rx="2.5" ry="3.5" fill="#fcd34d" opacity="0.4" />

      {/* Mouth */}
      {isPetting ? (
        <ellipse cx="20" cy="52" rx="4.5" ry="3.5" fill="#f472b6" />
      ) : isSad ? (
        <ellipse cx="20" cy="52" rx="2.5" ry="1.5" fill="#7c2d12" />
      ) : (
        <ellipse cx="20" cy="52" rx="3.5" ry="2.5" fill="#7c2d12" />
      )}

      {/* Bubbles */}
      <motion.circle cx="14" cy="44" r="2.5" fill="none" stroke="#fde68a" strokeWidth="0.8"
        animate={{ y: [0, -12], opacity: [1, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <motion.circle cx="10" cy="50" r="1.8" fill="none" stroke="#fde68a" strokeWidth="0.6"
        animate={{ y: [0, -14], opacity: [1, 0] }} transition={{ duration: 1.9, repeat: Infinity, delay: 0.4 }} />

      {isPetting && (
        <motion.ellipse cx="26" cy="52" rx="3.5" ry="1.8" fill="#fda4af" initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} />
      )}
    </motion.g>
  </svg>
);

// ===== GUARDIAN FISH - Dragon Fish =====
const GuardianFishSVG: React.FC<Omit<EvolutionPetSVGProps, 'type' | 'stage' | 'facingDirection'>> = ({ 
  size = 400, isPetting, isEating, isBlinking, isSad, isMoving 
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
    <defs>
      <linearGradient id="dragonFishBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="30%" stopColor="#7c3aed" />
        <stop offset="70%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#3730a3" />
      </linearGradient>
      <radialGradient id="dragonFishBelly" cx="40%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#e9d5ff" />
        <stop offset="100%" stopColor="#c4b5fd" />
      </radialGradient>
      <radialGradient id="dragonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="dragonFinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <filter id="dragonGlowFilter">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Mystical aura */}
    <motion.circle
      cx="50" cy="50" r="40"
      fill="url(#dragonGlow)"
      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />

    <motion.g
      animate={{ 
        y: isMoving ? [0, -3, 0, 3, 0] : [0, -1.5, 0, 1.5, 0],
        rotate: isMoving ? [-2, 2, -2] : 0
      }}
      transition={{ duration: isMoving ? 0.5 : 2.5, repeat: Infinity }}
      style={{ transformOrigin: '50px 50px' }}
    >
      {/* Serpentine body */}
      <motion.ellipse
        cx="42" cy="50" rx="28" ry="16"
        fill="url(#dragonFishBody)"
        filter="url(#dragonGlowFilter)"
        animate={isPetting ? { scaleY: [1, 0.92, 1.06, 1], scaleX: [1, 1.04, 0.96, 1] } : {}}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: '42px 50px' }}
      />

      {/* Iridescent belly */}
      <ellipse cx="38" cy="54" rx="18" ry="9" fill="url(#dragonFishBelly)" />

      {/* Majestic flowing tail */}
      <motion.g
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ transformOrigin: '70px 50px' }}
      >
        <path d="M68 50 L95 25 L90 50 L95 75 Z" fill="url(#dragonFinGrad)" />
        {/* Tail details */}
        <path d="M72 50 L88 32" fill="none" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.6" />
        <path d="M72 50 L88 68" fill="none" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.6" />
      </motion.g>

      {/* Crown-like dorsal fin */}
      <motion.g
        animate={{ scaleY: [1, 1.1, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{ transformOrigin: '42px 34px' }}
      >
        <path d="M28 34 Q32 18 38 26 Q42 12 48 26 Q54 18 58 34" fill="url(#dragonFinGrad)" />
        {/* Fin spines */}
        <motion.circle cx="38" cy="20" r="1.5" fill="#c084fc" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.circle cx="48" cy="16" r="1.5" fill="#c084fc" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
      </motion.g>

      {/* Dragon whiskers */}
      <motion.g
        animate={isPetting ? { rotate: [-5, 5, -5] } : {}}
        transition={{ duration: 0.3, repeat: isPetting ? 4 : 0 }}
        style={{ transformOrigin: '20px 48px' }}
      >
        <path d="M22 46 Q8 38 4 44" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M22 50 Q6 50 2 54" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
        <motion.circle cx="4" cy="44" r="1.5" fill="#e9d5ff" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.circle cx="2" cy="54" r="1.5" fill="#e9d5ff" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
      </motion.g>

      {/* Elegant side fins */}
      <motion.ellipse
        cx="32" cy="56" rx="10" ry="5"
        fill="url(#dragonFinGrad)"
        animate={{ rotate: [-12, 12, -12] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        style={{ transformOrigin: '38px 56px' }}
      />

      {/* Wise dragon eye */}
      <motion.g
        animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: '30px 46px' }}
      >
        <ellipse cx="30" cy="46" rx="7" ry="8" fill="white" />
        <ellipse cx="30" cy="46" rx="5" ry="6.5" fill="#fbbf24" />
        <ellipse cx="30" cy="46" rx="2" ry="5" fill="#1c1917" />
        <ellipse cx="31" cy="44" rx="1.5" ry="2" fill="white" />
        <motion.ellipse cx="30" cy="46" rx="7.5" ry="8.5" fill="none" stroke="#a855f7" strokeWidth="0.5"
          animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.g>

      {/* Scale patterns */}
      <ellipse cx="48" cy="48" rx="3" ry="4" fill="#c084fc" opacity="0.3" />
      <ellipse cx="54" cy="46" rx="2.5" ry="3.5" fill="#c084fc" opacity="0.3" />
      <ellipse cx="52" cy="52" rx="2.5" ry="3.5" fill="#c084fc" opacity="0.3" />
      <ellipse cx="58" cy="50" rx="2" ry="3" fill="#c084fc" opacity="0.3" />

      {/* Mouth */}
      {isPetting ? (
        <ellipse cx="18" cy="50" rx="4" ry="3" fill="#f472b6" />
      ) : isSad ? (
        <ellipse cx="18" cy="50" rx="2" ry="1.2" fill="#3730a3" />
      ) : (
        <ellipse cx="18" cy="50" rx="3" ry="2" fill="#3730a3" />
      )}

      {/* Mystical bubbles */}
      <motion.circle cx="12" cy="42" r="2.5" fill="none" stroke="#c084fc" strokeWidth="0.8"
        animate={{ y: [0, -15], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="8" cy="48" r="2" fill="none" stroke="#c084fc" strokeWidth="0.6"
        animate={{ y: [0, -18], opacity: [1, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }} />
      <motion.circle cx="14" cy="54" r="1.5" fill="none" stroke="#c084fc" strokeWidth="0.5"
        animate={{ y: [0, -12], opacity: [1, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 1 }} />

      {isPetting && (
        <motion.ellipse cx="24" cy="52" rx="3" ry="1.5" fill="#f9a8d4" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
      )}
    </motion.g>

    {/* Spirit particles */}
    <motion.circle cx="15" cy="35" r="1.5" fill="#c084fc" animate={{ opacity: [0, 1, 0], y: [-5, -15] }} transition={{ duration: 2, repeat: Infinity }} />
    <motion.circle cx="85" cy="40" r="1.2" fill="#c084fc" animate={{ opacity: [0, 1, 0], y: [-5, -12] }} transition={{ duration: 2, repeat: Infinity, delay: 0.8 }} />
    <motion.circle cx="80" cy="65" r="1" fill="#c084fc" animate={{ opacity: [0, 1, 0], y: [-5, -10] }} transition={{ duration: 2, repeat: Infinity, delay: 1.5 }} />
  </svg>
);

// Main component that selects the right pet
export const EvolutionPetSVG: React.FC<EvolutionPetSVGProps> = (props) => {
  const { type, stage, facingDirection, size: propSize, ...petProps } = props;
  
  // Get size based on evolution stage
  const getSize = () => {
    if (propSize) return propSize;
    switch (stage) {
      case 'baby': return 280;
      case 'teen': return 340;
      case 'guardian': return 400;
    }
  };
  
  const size = getSize();

  // Flip horizontally if facing left
  const wrapperStyle: React.CSSProperties = facingDirection === 'left' 
    ? { transform: 'scaleX(-1)' } 
    : {};

  const getPetComponent = () => {
    switch (type) {
      case 'dog':
        switch (stage) {
          case 'baby': return <BabyDogSVG {...petProps} size={size} />;
          case 'teen': return <TeenDogSVG {...petProps} size={size} />;
          case 'guardian': return <GuardianDogSVG {...petProps} size={size} />;
        }
        break;
      case 'cat':
        switch (stage) {
          case 'baby': return <BabyCatSVG {...petProps} size={size} />;
          case 'teen': return <TeenCatSVG {...petProps} size={size} />;
          case 'guardian': return <GuardianCatSVG {...petProps} size={size} />;
        }
        break;
      case 'fish':
        switch (stage) {
          case 'baby': return <BabyFishSVG {...petProps} size={size} />;
          case 'teen': return <TeenFishSVG {...petProps} size={size} />;
          case 'guardian': return <GuardianFishSVG {...petProps} size={size} />;
        }
        break;
    }
  };

  return (
    <div style={wrapperStyle}>
      {getPetComponent()}
    </div>
  );
};

export default EvolutionPetSVG;
