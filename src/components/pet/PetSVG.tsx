import React from 'react';
import { motion } from 'framer-motion';

type PetType = 'dog' | 'cat' | 'fish';

interface PetSVGProps {
  type: PetType;
  size?: number;
  isPetting: boolean;
  isEating: boolean;
  isBlinking: boolean;
  isSad: boolean;
  facingDirection: 'left' | 'right';
  isMoving: boolean;
}

// Realistic Dog SVG - 300-400px size
const DogSVG: React.FC<Omit<PetSVGProps, 'type'>> = ({ 
  size = 350, 
  isPetting, 
  isEating, 
  isBlinking, 
  isSad,
  isMoving 
}) => {
  const scale = size / 100;
  
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
      <defs>
        <radialGradient id="dogFurMain" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#e8c896" />
          <stop offset="40%" stopColor="#d4a574" />
          <stop offset="100%" stopColor="#8b6914" />
        </radialGradient>
        <radialGradient id="dogBellyGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#faf6f0" />
          <stop offset="100%" stopColor="#f0e6d8" />
        </radialGradient>
        <radialGradient id="dogNose" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4a3728" />
          <stop offset="100%" stopColor="#2d1f14" />
        </radialGradient>
        <filter id="petShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Body with breathing animation */}
      <motion.g
        animate={{ 
          scaleY: isPetting ? [1, 0.92, 1.06, 1] : [1, 1.015, 1, 0.985, 1],
          scaleX: isPetting ? [1, 1.06, 0.94, 1] : [1, 0.99, 1, 1.01, 1]
        }}
        transition={{ 
          duration: isPetting ? 0.5 : 3,
          repeat: isPetting ? 0 : Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: '50px 60px' }}
      >
        {/* Main body */}
        <ellipse cx="50" cy="60" rx="28" ry="22" fill="url(#dogFurMain)" filter="url(#petShadow)" />
        {/* Belly */}
        <ellipse cx="50" cy="64" rx="16" ry="12" fill="url(#dogBellyGrad)" />
      </motion.g>
      
      {/* Back legs */}
      <motion.g
        animate={isMoving ? { y: [0, -2, 0, 2, 0] } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
      >
        <ellipse cx="32" cy="78" rx="7" ry="9" fill="#a67c52" />
        <ellipse cx="68" cy="78" rx="7" ry="9" fill="#a67c52" />
        {/* Paws */}
        <ellipse cx="32" cy="85" rx="6" ry="4" fill="#8b6914" />
        <ellipse cx="68" cy="85" rx="6" ry="4" fill="#8b6914" />
      </motion.g>
      
      {/* Front legs with walking motion */}
      <motion.g
        animate={isMoving ? { y: [0, 2, 0, -2, 0] } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
      >
        <ellipse cx="38" cy="76" rx="5" ry="10" fill="#c4956c" />
        <ellipse cx="62" cy="76" rx="5" ry="10" fill="#c4956c" />
        <ellipse cx="38" cy="85" rx="5" ry="3" fill="#8b6914" />
        <ellipse cx="62" cy="85" rx="5" ry="3" fill="#8b6914" />
      </motion.g>
      
      {/* Tail with wagging */}
      <motion.path
        d="M76 52 Q92 38 88 55 Q84 68 78 62"
        fill="url(#dogFurMain)"
        animate={
          isPetting 
            ? { rotate: [-25, 25, -25, 25, 0] } 
            : isSad 
              ? { rotate: -15 }
              : { rotate: [-8, 8, -8] }
        }
        transition={{ 
          duration: isPetting ? 0.4 : 1.2, 
          repeat: isPetting ? 2 : Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: '76px 58px' }}
      />
      
      {/* Head */}
      <motion.g
        animate={
          isEating 
            ? { y: [0, 8, 0], rotate: [0, 5, 0] } 
            : isSad 
              ? { y: 3, rotate: -3 }
              : {}
        }
        transition={{ duration: 0.25, repeat: isEating ? Infinity : 0 }}
        style={{ transformOrigin: '50px 35px' }}
      >
        {/* Head base */}
        <circle cx="50" cy="32" r="20" fill="url(#dogFurMain)" />
        
        {/* Snout */}
        <ellipse cx="50" cy="42" rx="10" ry="8" fill="#e8c896" />
        
        {/* Ears with droop when sad */}
        <motion.ellipse
          cx="28" cy="22" rx="9" ry="14"
          fill="#8b6914"
          animate={
            isPetting 
              ? { rotate: [-8, 8, -8] } 
              : isSad 
                ? { rotate: 25, y: 8 }
                : { rotate: [0, -3, 0] }
          }
          transition={{ duration: isPetting ? 0.25 : 2, repeat: isPetting ? 3 : Infinity }}
          style={{ transformOrigin: '32px 30px' }}
        />
        <motion.ellipse
          cx="72" cy="22" rx="9" ry="14"
          fill="#8b6914"
          animate={
            isPetting 
              ? { rotate: [8, -8, 8] } 
              : isSad 
                ? { rotate: -25, y: 8 }
                : { rotate: [0, 3, 0] }
          }
          transition={{ duration: isPetting ? 0.25 : 2, repeat: isPetting ? 3 : Infinity }}
          style={{ transformOrigin: '68px 30px' }}
        />
        
        {/* Inner ears */}
        <ellipse cx="29" cy="24" rx="4" ry="7" fill="#d4a574" />
        <ellipse cx="71" cy="24" rx="4" ry="7" fill="#d4a574" />
        
        {/* Eyes with blinking */}
        <motion.g
          animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: '42px 30px' }}
        >
          <ellipse cx="42" cy="30" rx="5" ry="6" fill="#2d1f14" />
          <circle cx="43" cy="28" r="2" fill="white" opacity="0.9" />
        </motion.g>
        <motion.g
          animate={isBlinking || isPetting ? { scaleY: 0.1 } : { scaleY: 1 }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: '58px 30px' }}
        >
          <ellipse cx="58" cy="30" rx="5" ry="6" fill="#2d1f14" />
          <circle cx="59" cy="28" r="2" fill="white" opacity="0.9" />
        </motion.g>
        
        {/* Eyebrows for expression */}
        {isSad && (
          <>
            <line x1="38" y1="23" x2="46" y2="25" stroke="#6b5344" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="54" y1="25" x2="62" y2="23" stroke="#6b5344" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
        
        {/* Nose */}
        <ellipse cx="50" cy="40" rx="5" ry="4" fill="url(#dogNose)" />
        <ellipse cx="49" cy="39" rx="1.5" ry="1" fill="white" opacity="0.4" />
        
        {/* Mouth */}
        {isPetting ? (
          <g>
            <path d="M42 46 Q50 54 58 46" fill="none" stroke="#4a3728" strokeWidth="2" strokeLinecap="round" />
            {/* Tongue */}
            <motion.ellipse
              cx="50" cy="52" rx="5" ry="7"
              fill="#ff8fa3"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              style={{ transformOrigin: '50px 46px' }}
            />
          </g>
        ) : isEating ? (
          <motion.ellipse
            cx="50" cy="47" rx="4" ry="4"
            fill="#4a3728"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          />
        ) : isSad ? (
          <path d="M44 48 Q50 44 56 48" fill="none" stroke="#4a3728" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <path d="M45 46 Q50 50 55 46" fill="none" stroke="#4a3728" strokeWidth="1.5" strokeLinecap="round" />
        )}
      </motion.g>
      
      {/* Blush when happy */}
      {isPetting && (
        <>
          <motion.ellipse
            cx="34" cy="36" rx="4" ry="2"
            fill="#ffb6c1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
          />
          <motion.ellipse
            cx="66" cy="36" rx="4" ry="2"
            fill="#ffb6c1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
          />
        </>
      )}
    </svg>
  );
};

// Realistic Cat SVG
const CatSVG: React.FC<Omit<PetSVGProps, 'type'>> = ({ 
  size = 350, 
  isPetting, 
  isEating, 
  isBlinking, 
  isSad,
  isMoving 
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
      <defs>
        <radialGradient id="catFurMain" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="40%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#4b5563" />
        </radialGradient>
        <radialGradient id="catBellyGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </radialGradient>
        <filter id="catShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Body with breathing */}
      <motion.g
        animate={{ 
          scaleY: isPetting ? [1, 0.88, 1.08, 1] : [1, 1.02, 1, 0.98, 1],
          scaleX: isPetting ? [1, 1.08, 0.92, 1] : [1, 0.98, 1, 1.02, 1]
        }}
        transition={{ 
          duration: isPetting ? 0.5 : 4,
          repeat: isPetting ? 0 : Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: '50px 58px' }}
      >
        <ellipse cx="50" cy="58" rx="26" ry="20" fill="url(#catFurMain)" filter="url(#catShadow)" />
        <ellipse cx="50" cy="62" rx="14" ry="10" fill="url(#catBellyGrad)" />
      </motion.g>
      
      {/* Tail with elegant movement */}
      <motion.path
        d="M74 55 Q95 35 92 60 Q89 82 80 70"
        fill="url(#catFurMain)"
        animate={
          isPetting 
            ? { d: [
                "M74 55 Q95 35 92 60 Q89 82 80 70",
                "M74 55 Q100 30 96 55 Q92 78 82 68",
                "M74 55 Q95 35 92 60 Q89 82 80 70"
              ] }
            : isSad
              ? { d: "M74 58 Q82 65 78 75 Q74 82 72 78" }
              : { rotate: [-5, 5, -5] }
        }
        transition={{ duration: isPetting ? 0.6 : 2, repeat: isPetting ? 2 : Infinity }}
        style={{ transformOrigin: '74px 58px' }}
      />
      
      {/* Legs */}
      <motion.g animate={isMoving ? { y: [0, -1, 0, 1, 0] } : {}} transition={{ duration: 0.25, repeat: Infinity }}>
        <ellipse cx="34" cy="76" rx="5" ry="8" fill="#4b5563" />
        <ellipse cx="66" cy="76" rx="5" ry="8" fill="#4b5563" />
        <ellipse cx="42" cy="74" rx="4" ry="9" fill="#6b7280" />
        <ellipse cx="58" cy="74" rx="4" ry="9" fill="#6b7280" />
        {/* Paws */}
        <ellipse cx="34" cy="83" rx="4" ry="2.5" fill="#374151" />
        <ellipse cx="66" cy="83" rx="4" ry="2.5" fill="#374151" />
        <ellipse cx="42" cy="82" rx="3.5" ry="2" fill="#374151" />
        <ellipse cx="58" cy="82" rx="3.5" ry="2" fill="#374151" />
      </motion.g>
      
      {/* Head */}
      <motion.g
        animate={
          isEating 
            ? { y: [0, 5, 0], rotate: [0, 3, 0] }
            : isSad
              ? { y: 2, rotate: -2 }
              : {}
        }
        transition={{ duration: 0.2, repeat: isEating ? Infinity : 0 }}
        style={{ transformOrigin: '50px 32px' }}
      >
        <circle cx="50" cy="32" r="18" fill="url(#catFurMain)" />
        
        {/* Ears */}
        <motion.path
          d="M28 28 L22 6 L40 22 Z"
          fill="url(#catFurMain)"
          animate={
            isPetting 
              ? { rotate: [-6, 6, -6] }
              : isSad
                ? { rotate: 15 }
                : { rotate: [0, -2, 0, 2, 0] }
          }
          transition={{ duration: isPetting ? 0.2 : 3, repeat: isPetting ? 4 : Infinity }}
          style={{ transformOrigin: '32px 28px' }}
        />
        <path d="M30 26 L26 12 L38 23 Z" fill="#ffc0cb" />
        <motion.path
          d="M72 28 L78 6 L60 22 Z"
          fill="url(#catFurMain)"
          animate={
            isPetting 
              ? { rotate: [6, -6, 6] }
              : isSad
                ? { rotate: -15 }
                : { rotate: [0, 2, 0, -2, 0] }
          }
          transition={{ duration: isPetting ? 0.2 : 3, repeat: isPetting ? 4 : Infinity }}
          style={{ transformOrigin: '68px 28px' }}
        />
        <path d="M70 26 L74 12 L62 23 Z" fill="#ffc0cb" />
        
        {/* Eyes */}
        <motion.g
          animate={isBlinking || isPetting ? { scaleY: 0.05 } : { scaleY: 1 }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: '42px 30px' }}
        >
          <ellipse cx="42" cy="30" rx="5" ry="6" fill="#10b981" />
          <ellipse cx="42" cy="30" rx="2" ry="5" fill="#064e3b" />
          <circle cx="43" cy="28" r="1.5" fill="white" opacity="0.8" />
        </motion.g>
        <motion.g
          animate={isBlinking || isPetting ? { scaleY: 0.05 } : { scaleY: 1 }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: '58px 30px' }}
        >
          <ellipse cx="58" cy="30" rx="5" ry="6" fill="#10b981" />
          <ellipse cx="58" cy="30" rx="2" ry="5" fill="#064e3b" />
          <circle cx="59" cy="28" r="1.5" fill="white" opacity="0.8" />
        </motion.g>
        
        {/* Nose */}
        <path d="M47 40 L50 44 L53 40 Z" fill="#ffc0cb" />
        
        {/* Mouth */}
        {isPetting ? (
          <path d="M44 47 Q50 53 56 47" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
        ) : isSad ? (
          <path d="M45 48 Q50 45 55 48" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <g>
            <path d="M50 44 L50 47" stroke="#4b5563" strokeWidth="1.5" />
            <path d="M47 48 Q50 51 53 48" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}
        
        {/* Whiskers */}
        <motion.g 
          stroke="#9ca3af" 
          strokeWidth="0.8"
          animate={isPetting ? { x: [0, 2, 0, -2, 0] } : {}}
          transition={{ duration: 0.3, repeat: isPetting ? 4 : 0 }}
        >
          <line x1="18" y1="38" x2="35" y2="40" />
          <line x1="17" y1="43" x2="34" y2="43" />
          <line x1="18" y1="48" x2="35" y2="46" />
          <line x1="65" y1="40" x2="82" y2="38" />
          <line x1="66" y1="43" x2="83" y2="43" />
          <line x1="65" y1="46" x2="82" y2="48" />
        </motion.g>
      </motion.g>
      
      {/* Blush */}
      {isPetting && (
        <>
          <motion.ellipse cx="34" cy="36" rx="3" ry="1.5" fill="#ffc0cb" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
          <motion.ellipse cx="66" cy="36" rx="3" ry="1.5" fill="#ffc0cb" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
        </>
      )}
    </svg>
  );
};

// Realistic Fish SVG
const FishSVG: React.FC<Omit<PetSVGProps, 'type'>> = ({ 
  size = 350, 
  isPetting, 
  isEating, 
  isBlinking, 
  isSad,
  isMoving 
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-2xl">
      <defs>
        <linearGradient id="fishBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="30%" stopColor="#60a5fa" />
          <stop offset="70%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id="fishBellyGrad" cx="40%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </radialGradient>
        <filter id="fishGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Swimming body motion */}
      <motion.g
        animate={{ 
          y: isMoving ? [0, -3, 0, 3, 0] : [0, -1, 0, 1, 0],
          rotate: isMoving ? [-2, 2, -2] : 0
        }}
        transition={{ duration: isMoving ? 0.5 : 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '50px 50px' }}
      >
        {/* Main body */}
        <motion.ellipse
          cx="42" cy="50" rx="28" ry="18"
          fill="url(#fishBodyGrad)"
          filter="url(#fishGlow)"
          animate={isPetting ? { scaleY: [1, 0.9, 1.1, 1], scaleX: [1, 1.05, 0.95, 1] } : {}}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: '42px 50px' }}
        />
        
        {/* Belly */}
        <ellipse cx="38" cy="55" rx="16" ry="9" fill="url(#fishBellyGrad)" />
        
        {/* Tail */}
        <motion.path
          d="M70 50 L90 32 L86 50 L90 68 Z"
          fill="url(#fishBodyGrad)"
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '70px 50px' }}
        />
        
        {/* Dorsal fin */}
        <motion.path
          d="M30 32 Q42 15 54 32"
          fill="#2563eb"
          animate={{ scaleY: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: '42px 32px' }}
        />
        
        {/* Pectoral fins */}
        <motion.ellipse
          cx="32" cy="56" rx="8" ry="4"
          fill="#3b82f6"
          animate={{ rotate: [-15, 15, -15] }}
          transition={{ duration: 0.6, repeat: Infinity }}
          style={{ transformOrigin: '38px 56px' }}
        />
        <motion.ellipse
          cx="32" cy="44" rx="6" ry="3"
          fill="#3b82f6"
          animate={{ rotate: [10, -10, 10] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          style={{ transformOrigin: '36px 44px' }}
        />
        
        {/* Scales pattern */}
        <g fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8">
          <path d="M28 45 Q34 42 40 45" />
          <path d="M34 50 Q40 47 46 50" />
          <path d="M38 55 Q44 52 50 55" />
          <path d="M44 45 Q50 42 56 45" />
          <path d="M48 50 Q54 47 60 50" />
        </g>
        
        {/* Eye */}
        <motion.g
          animate={isBlinking ? { scaleY: 0.1 } : { scaleY: 1 }}
          transition={{ duration: 0.1 }}
          style={{ transformOrigin: '26px 46px' }}
        >
          <circle cx="26" cy="46" r="8" fill="white" />
          <circle cx="26" cy="46" r="5" fill="#1e3a8a" />
          <circle cx="24" cy="44" r="2" fill="white" opacity="0.9" />
        </motion.g>
        
        {/* Mouth */}
        {isPetting ? (
          <motion.ellipse
            cx="12" cy="50" rx="4" ry="3"
            fill="#f472b6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        ) : isEating ? (
          <motion.ellipse
            cx="12" cy="50" rx="5" ry="5"
            fill="#1e3a8a"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 0.2, repeat: Infinity }}
          />
        ) : (
          <ellipse cx="12" cy="50" rx="3" ry="2" fill="#1e3a8a" />
        )}
        
        {/* Bubbles when happy */}
        {isPetting && (
          <>
            <motion.circle
              cx="8" cy="38" r="3"
              fill="none"
              stroke="#bfdbfe"
              strokeWidth="1"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -25, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.circle
              cx="4" cy="44" r="2"
              fill="none"
              stroke="#bfdbfe"
              strokeWidth="1"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -20, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
            <motion.circle
              cx="10" cy="42" r="1.5"
              fill="none"
              stroke="#bfdbfe"
              strokeWidth="1"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.7 }}
            />
          </>
        )}
      </motion.g>
    </svg>
  );
};

export const PetSVG: React.FC<PetSVGProps> = (props) => {
  const { type, facingDirection, ...rest } = props;
  const svgProps = { ...rest, facingDirection };
  
  return (
    <div style={{ transform: facingDirection === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
      {type === 'dog' && <DogSVG {...svgProps} />}
      {type === 'cat' && <CatSVG {...svgProps} />}
      {type === 'fish' && <FishSVG {...svgProps} />}
    </div>
  );
};

export default PetSVG;
