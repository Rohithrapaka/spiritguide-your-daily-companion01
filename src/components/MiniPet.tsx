import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type PetType = 'dog' | 'cat' | 'fish';

const MiniDog: React.FC<{ isHappy: boolean }> = ({ isHappy }) => (
  <svg width="40" height="40" viewBox="0 0 100 100">
    <defs>
      <radialGradient id="miniDogFur" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="100%" stopColor="#a67c52" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="60" rx="25" ry="20" fill="url(#miniDogFur)" />
    <circle cx="50" cy="38" r="18" fill="url(#miniDogFur)" />
    <ellipse cx="32" cy="28" rx="8" ry="12" fill="#8b6914" />
    <ellipse cx="68" cy="28" rx="8" ry="12" fill="#8b6914" />
    <ellipse cx="42" cy="35" rx="4" ry={isHappy ? 2 : 5} fill="#3d2914" />
    <ellipse cx="58" cy="35" rx="4" ry={isHappy ? 2 : 5} fill="#3d2914" />
    <ellipse cx="50" cy="44" rx="4" ry="3" fill="#3d2914" />
    {isHappy ? (
      <path d="M44 50 Q50 56 56 50" fill="none" stroke="#3d2914" strokeWidth="2" strokeLinecap="round" />
    ) : (
      <line x1="46" y1="50" x2="54" y2="50" stroke="#3d2914" strokeWidth="2" strokeLinecap="round" />
    )}
  </svg>
);

const MiniCat: React.FC<{ isHappy: boolean }> = ({ isHappy }) => (
  <svg width="40" height="40" viewBox="0 0 100 100">
    <defs>
      <radialGradient id="miniCatFur" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#6b7280" />
        <stop offset="100%" stopColor="#4b5563" />
      </radialGradient>
    </defs>
    <ellipse cx="50" cy="60" rx="22" ry="18" fill="url(#miniCatFur)" />
    <circle cx="50" cy="38" r="16" fill="url(#miniCatFur)" />
    <path d="M32 32 L28 12 L42 28 Z" fill="url(#miniCatFur)" />
    <path d="M68 32 L72 12 L58 28 Z" fill="url(#miniCatFur)" />
    <path d="M34 30 L30 16 L40 27 Z" fill="#ffc0cb" />
    <path d="M66 30 L70 16 L60 27 Z" fill="#ffc0cb" />
    <ellipse cx="42" cy="36" rx="4" ry={isHappy ? 1 : 5} fill="#10b981" />
    <ellipse cx="58" cy="36" rx="4" ry={isHappy ? 1 : 5} fill="#10b981" />
    <path d="M47 44 L50 47 L53 44 Z" fill="#ffc0cb" />
    {isHappy ? (
      <path d="M44 50 Q50 56 56 50" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
    ) : (
      <line x1="46" y1="50" x2="54" y2="50" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" />
    )}
  </svg>
);

const MiniFish: React.FC<{ isHappy: boolean }> = ({ isHappy }) => (
  <svg width="40" height="40" viewBox="0 0 100 100">
    <defs>
      <radialGradient id="miniFishBody" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#2563eb" />
      </radialGradient>
    </defs>
    <ellipse cx="45" cy="50" rx="25" ry="16" fill="url(#miniFishBody)" />
    <path d="M70 50 L88 38 L85 50 L88 62 Z" fill="url(#miniFishBody)" />
    <path d="M35 34 Q45 22 55 34" fill="#2563eb" />
    <circle cx="30" cy="46" r="6" fill="white" />
    <circle cx="30" cy="46" r="4" fill="#1e3a8a" />
    <circle cx="28" cy="44" r="1.5" fill="white" opacity="0.9" />
    {isHappy ? (
      <ellipse cx="18" cy="52" rx="3" ry="2.5" fill="#f472b6" />
    ) : (
      <ellipse cx="18" cy="52" rx="2.5" ry="1.5" fill="#1e3a8a" />
    )}
  </svg>
);

// Zzz particles for sleeping
const ZzzParticle: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.span
    className="absolute text-xs font-medium text-muted-foreground/60"
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
  const [position, setPosition] = useState(50);
  
  const lastMoodScore = moodHistory.length > 0 ? moodHistory[0].score : currentMood;
  const isHappy = lastMoodScore > 6;
  const isSad = lastMoodScore < 4;

  // Load pet type
  useEffect(() => {
    const loadPetType = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('pet_type')
        .eq('user_id', user.id)
        .single();
      
      if (data?.pet_type && ['dog', 'cat', 'fish'].includes(data.pet_type)) {
        setPetType(data.pet_type as PetType);
      }
    };
    loadPetType();
  }, [user]);

  // Roaming animation for happy state
  useEffect(() => {
    if (isSad) {
      setPosition(85); // Go to corner when sad
      return;
    }

    if (isHappy) {
      const interval = setInterval(() => {
        setPosition(prev => {
          const direction = Math.random() > 0.5 ? 1 : -1;
          const newPos = prev + direction * (Math.random() * 20 + 10);
          return Math.max(10, Math.min(80, newPos));
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHappy, isSad]);

  const renderPet = () => {
    const props = { isHappy };
    switch (petType) {
      case 'dog': return <MiniDog {...props} />;
      case 'cat': return <MiniCat {...props} />;
      case 'fish': return <MiniFish {...props} />;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute bottom-1 flex items-end"
        animate={{ 
          left: `${position}%`,
          scaleX: position > 50 ? 1 : -1,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 80, 
          damping: 15 
        }}
      >
        {/* The pet */}
        <motion.div
          animate={
            isHappy 
              ? { y: [0, -8, 0] } 
              : isSad 
                ? { rotate: [0, -5, 0] }
                : { y: [0, -2, 0] }
          }
          transition={{ 
            duration: isHappy ? 0.8 : 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {renderPet()}
        </motion.div>

        {/* Zzz particles when sleeping */}
        {isSad && (
          <div className="absolute -top-4 -right-2">
            <ZzzParticle delay={0} />
            <ZzzParticle delay={0.8} />
            <ZzzParticle delay={1.6} />
          </div>
        )}

        {/* Happy sparkle */}
        {isHappy && (
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2"
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <span className="text-yellow-400 text-xs">✨</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MiniPet;
