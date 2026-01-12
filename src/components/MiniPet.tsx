import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getEvolutionStage, EvolutionStage, PetType } from './pet/EvolutionPetSVG';

// Mini versions of evolved pets with mood-aware expressions
const MiniDog: React.FC<{ isHappy: boolean; stage: EvolutionStage }> = ({ isHappy, stage }) => {
  const stageColors = {
    baby: { primary: '#fce7c8', secondary: '#e8c896', accent: '#c4956c' },
    teen: { primary: '#f5d89a', secondary: '#d4a556', accent: '#b8860b' },
    guardian: { primary: '#fff8e7', secondary: '#ffd700', accent: '#ff6b35' }
  };
  const colors = stageColors[stage];
  
  return (
    <svg width="48" height="48" viewBox="0 0 100 100">
      <defs>
        <radialGradient id={`miniDogFur-${stage}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </radialGradient>
        {stage === 'guardian' && (
          <radialGradient id="miniDogGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      
      {/* Guardian glow */}
      {stage === 'guardian' && (
        <circle cx="50" cy="50" r="42" fill="url(#miniDogGlow)">
          <animate attributeName="r" values="40;45;40" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      
      <ellipse cx="50" cy="60" rx="25" ry="20" fill={`url(#miniDogFur-${stage})`} />
      <circle cx="50" cy="38" r="18" fill={`url(#miniDogFur-${stage})`} />
      
      {/* Ears - different by stage */}
      {stage === 'baby' && (
        <>
          <ellipse cx="32" cy="28" rx="6" ry="10" fill={colors.accent} />
          <ellipse cx="68" cy="28" rx="6" ry="10" fill={colors.accent} />
        </>
      )}
      {stage === 'teen' && (
        <>
          <ellipse cx="30" cy="26" rx="8" ry="14" fill={colors.accent} />
          <ellipse cx="70" cy="26" rx="8" ry="14" fill={colors.accent} />
        </>
      )}
      {stage === 'guardian' && (
        <>
          <ellipse cx="28" cy="24" rx="10" ry="16" fill={colors.accent} />
          <ellipse cx="72" cy="24" rx="10" ry="16" fill={colors.accent} />
          {/* Wings hint */}
          <path d="M12 55 Q5 45 15 40 Q20 50 18 60 Z" fill="#ffd70060" />
          <path d="M88 55 Q95 45 85 40 Q80 50 82 60 Z" fill="#ffd70060" />
        </>
      )}
      
      {/* Eyes */}
      <ellipse cx="42" cy="35" rx="4" ry={isHappy ? 2 : 5} fill="#3d2914" />
      <ellipse cx="58" cy="35" rx="4" ry={isHappy ? 2 : 5} fill="#3d2914" />
      
      {/* Nose */}
      <ellipse cx="50" cy="44" rx="4" ry="3" fill="#3d2914" />
      
      {/* Mouth */}
      {isHappy ? (
        <path d="M44 50 Q50 56 56 50" fill="none" stroke="#3d2914" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M44 52 Q50 48 56 52" fill="none" stroke="#3d2914" strokeWidth="2" strokeLinecap="round" />
      )}
      
      {/* Crown for guardian */}
      {stage === 'guardian' && (
        <path d="M38 18 L42 8 L50 14 L58 8 L62 18" fill="#ffd700" stroke="#ff8c00" strokeWidth="1" />
      )}
    </svg>
  );
};

const MiniCat: React.FC<{ isHappy: boolean; stage: EvolutionStage }> = ({ isHappy, stage }) => {
  const stageColors = {
    baby: { primary: '#b0b8c4', secondary: '#8b939f', accent: '#6b7280' },
    teen: { primary: '#f5f5f4', secondary: '#ffa500', accent: '#4b5563' },
    guardian: { primary: '#fef3c7', secondary: '#f59e0b', accent: '#7c3aed' }
  };
  const colors = stageColors[stage];
  const tailCount = stage === 'guardian' ? 3 : 1;
  
  return (
    <svg width="48" height="48" viewBox="0 0 100 100">
      <defs>
        <radialGradient id={`miniCatFur-${stage}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </radialGradient>
        {stage === 'guardian' && (
          <radialGradient id="miniCatAura" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      
      {/* Guardian aura */}
      {stage === 'guardian' && (
        <circle cx="50" cy="50" r="42" fill="url(#miniCatAura)">
          <animate attributeName="r" values="40;45;40" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      
      {/* Multiple tails for guardian */}
      {Array.from({ length: tailCount }).map((_, i) => (
        <motion.path
          key={i}
          d={`M75 65 Q${90 + i * 3} ${50 - i * 5} ${85 + i * 5} ${35 - i * 8}`}
          fill="none"
          stroke={stage === 'guardian' ? '#f59e0b' : colors.accent}
          strokeWidth="4"
          strokeLinecap="round"
          animate={{ d: [
            `M75 65 Q${90 + i * 3} ${50 - i * 5} ${85 + i * 5} ${35 - i * 8}`,
            `M75 65 Q${85 + i * 3} ${55 - i * 5} ${90 + i * 5} ${40 - i * 8}`,
            `M75 65 Q${90 + i * 3} ${50 - i * 5} ${85 + i * 5} ${35 - i * 8}`,
          ]}}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
      
      <ellipse cx="50" cy="60" rx="22" ry="18" fill={`url(#miniCatFur-${stage})`} />
      <circle cx="50" cy="38" r="16" fill={`url(#miniCatFur-${stage})`} />
      
      {/* Ears */}
      <path d="M32 32 L28 12 L42 28 Z" fill={`url(#miniCatFur-${stage})`} />
      <path d="M68 32 L72 12 L58 28 Z" fill={`url(#miniCatFur-${stage})`} />
      <path d="M34 30 L30 16 L40 27 Z" fill="#ffc0cb" />
      <path d="M66 30 L70 16 L60 27 Z" fill="#ffc0cb" />
      
      {/* Eyes */}
      <ellipse cx="42" cy="36" rx="4" ry={isHappy ? 1 : 5} fill={stage === 'guardian' ? '#a855f7' : '#10b981'} />
      <ellipse cx="58" cy="36" rx="4" ry={isHappy ? 1 : 5} fill={stage === 'guardian' ? '#a855f7' : '#10b981'} />
      
      {/* Nose */}
      <path d="M47 44 L50 47 L53 44 Z" fill="#ffc0cb" />
      
      {/* Mouth */}
      {isHappy ? (
        <path d="M44 50 Q50 56 56 50" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" />
      ) : (
        <path d="M44 52 Q50 48 56 52" fill="none" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" />
      )}
      
      {/* Third eye for guardian */}
      {stage === 'guardian' && (
        <ellipse cx="50" cy="30" rx="3" ry="4" fill="#a855f7" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </ellipse>
      )}
    </svg>
  );
};

const MiniFish: React.FC<{ isHappy: boolean; stage: EvolutionStage }> = ({ isHappy, stage }) => {
  const stageColors = {
    baby: { primary: '#a5f3fc', secondary: '#22d3ee', accent: '#0891b2' },
    teen: { primary: '#fcd34d', secondary: '#f59e0b', accent: '#ea580c' },
    guardian: { primary: '#a855f7', secondary: '#7c3aed', accent: '#4c1d95' }
  };
  const colors = stageColors[stage];
  
  return (
    <svg width="48" height="48" viewBox="0 0 100 100">
      <defs>
        <linearGradient id={`miniFishBody-${stage}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        {stage === 'guardian' && (
          <radialGradient id="miniFishDragonGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      
      {/* Guardian dragon glow */}
      {stage === 'guardian' && (
        <circle cx="50" cy="50" r="42" fill="url(#miniFishDragonGlow)">
          <animate attributeName="r" values="40;45;40" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      
      {/* Dragon whiskers for guardian */}
      {stage === 'guardian' && (
        <>
          <motion.path d="M20 42 Q5 35 0 30" fill="none" stroke="#a855f7" strokeWidth="2"
            animate={{ d: ['M20 42 Q5 35 0 30', 'M20 42 Q8 32 3 28', 'M20 42 Q5 35 0 30'] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.path d="M20 58 Q5 65 0 70" fill="none" stroke="#a855f7" strokeWidth="2"
            animate={{ d: ['M20 58 Q5 65 0 70', 'M20 58 Q8 68 3 72', 'M20 58 Q5 65 0 70'] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
        </>
      )}
      
      <ellipse cx="45" cy="50" rx="25" ry="16" fill={`url(#miniFishBody-${stage})`} />
      <path d="M70 50 L88 38 L85 50 L88 62 Z" fill={`url(#miniFishBody-${stage})`} />
      
      {/* Fins - bigger for higher stages */}
      <path 
        d={stage === 'guardian' 
          ? "M30 30 Q45 10 60 30" 
          : stage === 'teen' 
            ? "M33 32 Q45 18 57 32"
            : "M35 34 Q45 22 55 34"
        } 
        fill={colors.accent} 
      />
      
      {/* Eye */}
      <circle cx="30" cy="46" r="6" fill="white" />
      <circle cx="30" cy="46" r="4" fill={colors.accent} />
      <circle cx="28" cy="44" r="1.5" fill="white" opacity="0.9" />
      
      {/* Blush/expression */}
      {isHappy ? (
        <ellipse cx="18" cy="52" rx="3" ry="2.5" fill="#f472b6" />
      ) : (
        <ellipse cx="18" cy="52" rx="2.5" ry="1.5" fill={colors.accent} />
      )}
      
      {/* Dragon horns for guardian */}
      {stage === 'guardian' && (
        <>
          <path d="M25 35 L18 22 L28 32 Z" fill="#7c3aed" />
          <path d="M40 32 L38 18 L45 30 Z" fill="#7c3aed" />
        </>
      )}
    </svg>
  );
};

// Zzz particles for sleeping
const ZzzParticle: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.span
    className="absolute text-xs font-medium text-blue-400/60"
    initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
    animate={{ 
      opacity: [0, 1, 1, 0], 
      x: [0, 10, 15], 
      y: [0, -15, -30],
      scale: [0.5, 1, 0.8]
    }}
    transition={{ 
      duration: 2.5, 
      repeat: Infinity, 
      delay,
      ease: "easeOut"
    }}
  >
    z
  </motion.span>
);

export const MiniPet: React.FC = () => {
  const { currentMood, moodHistory } = useMood();
  const { user } = useAuth();
  const [petType, setPetType] = useState<PetType>('dog');
  const [evolutionStage, setEvolutionStage] = useState<EvolutionStage>('baby');
  const [position, setPosition] = useState(50);
  
  const lastMoodScore = moodHistory.length > 0 ? moodHistory[0].score : currentMood;
  const isHappy = lastMoodScore > 6;
  const isSad = lastMoodScore < 4;
  const isVeryHappy = lastMoodScore >= 8;

  // Load pet type and evolution data
  useEffect(() => {
    const loadPetData = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('pet_type, total_challenges_completed')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        if (data.pet_type && ['dog', 'cat', 'fish'].includes(data.pet_type)) {
          setPetType(data.pet_type as PetType);
        }
        setEvolutionStage(getEvolutionStage(data.total_challenges_completed || 0));
      }
    };
    loadPetData();
  }, [user]);

  // Roaming animation for happy state
  useEffect(() => {
    if (isSad) {
      setPosition(90); // Go to corner when sad
      return;
    }

    if (isHappy) {
      const interval = setInterval(() => {
        setPosition(prev => {
          const speed = isVeryHappy ? 25 : 15;
          const direction = Math.random() > 0.5 ? 1 : -1;
          const newPos = prev + direction * (Math.random() * speed + 10);
          return Math.max(10, Math.min(85, newPos));
        });
      }, isVeryHappy ? 1500 : 2500);
      return () => clearInterval(interval);
    }
  }, [isHappy, isSad, isVeryHappy]);

  const renderPet = () => {
    const props = { isHappy, stage: evolutionStage };
    switch (petType) {
      case 'dog': return <MiniDog {...props} />;
      case 'cat': return <MiniCat {...props} />;
      case 'fish': return <MiniFish {...props} />;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute bottom-1 flex items-end"
        animate={{ 
          left: `${position}%`,
          scaleX: position > 50 ? 1 : -1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: isSad ? 30 : isVeryHappy ? 100 : 70, 
          damping: isSad ? 25 : 15 
        }}
      >
        {/* The pet with mood-aware animation */}
        <motion.div
          animate={
            isVeryHappy 
              ? { y: [0, -15, 0], rotate: [0, 5, -5, 0] }
              : isHappy 
                ? { y: [0, -10, 0] } 
                : isSad 
                  ? { rotate: [0, -5, 0], scale: 0.85, y: [0, 1, 0] }
                  : { y: [0, -3, 0] }
          }
          transition={{ 
            duration: isVeryHappy ? 0.5 : isHappy ? 0.6 : isSad ? 3 : 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {renderPet()}
        </motion.div>

        {/* Zzz particles when sleeping/sad */}
        {isSad && (
          <div className="absolute -top-8 right-0">
            <ZzzParticle delay={0} />
            <ZzzParticle delay={0.8} />
            <ZzzParticle delay={1.6} />
          </div>
        )}

        {/* Happy sparkles - more for very happy */}
        {isHappy && (
          <>
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: isVeryHappy ? 0.5 : 1.5 }}
            >
              <span className="text-yellow-400 text-sm">✨</span>
            </motion.div>
            {isVeryHappy && (
              <>
                <motion.div
                  className="absolute -top-1 -left-2"
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                >
                  <span className="text-pink-400 text-xs">💕</span>
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-2"
                  animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 360] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                >
                  <span className="text-amber-400 text-xs">⭐</span>
                </motion.div>
              </>
            )}
          </>
        )}

        {/* Evolution stage indicator */}
        {evolutionStage === 'guardian' && (
          <motion.div
            className="absolute -top-5 left-1/2 -translate-x-1/2"
            animate={{ y: [0, -2, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs">👑</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MiniPet;
