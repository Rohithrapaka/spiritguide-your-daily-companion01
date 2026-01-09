import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMood } from '@/contexts/MoodContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Heart, Zap, Sparkles } from 'lucide-react';

interface PetState {
  energy: number;
  level: number;
  type: string;
}

const petMoods = {
  happy: { eyeColor: '#4ade80', expression: '◠' },
  neutral: { eyeColor: '#60a5fa', expression: '–' },
  sad: { eyeColor: '#a78bfa', expression: '◡' },
  tired: { eyeColor: '#94a3b8', expression: '–' },
};

const getPetMood = (moodScore: number | null, energy: number) => {
  if (energy < 20) return 'tired';
  if (!moodScore || moodScore <= 3) return 'sad';
  if (moodScore <= 6) return 'neutral';
  return 'happy';
};

export const SoulPet: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currentMood, moodHistory } = useMood();
  const { user } = useAuth();
  const [petState, setPetState] = useState<PetState>({ energy: 50, level: 1, type: 'spirit_fox' });
  const [isBlinking, setIsBlinking] = useState(false);

  const lastMoodScore = moodHistory.length > 0 ? moodHistory[0].score : currentMood;
  const petMood = getPetMood(lastMoodScore, petState.energy);
  const moodConfig = petMoods[petMood];

  // Fetch pet state from profile
  useEffect(() => {
    const fetchPetState = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('pet_energy, pet_level, pet_type')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setPetState({
          energy: data.pet_energy ?? 50,
          level: data.pet_level ?? 1,
          type: data.pet_type ?? 'spirit_fox',
        });
      }
    };
    fetchPetState();
  }, [user]);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Update energy based on daily challenges
  useEffect(() => {
    const updateEnergy = async () => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const { data: challenges } = await supabase
        .from('daily_challenges')
        .select('completed_quests')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (challenges?.completed_quests) {
        const completedCount = challenges.completed_quests.length;
        const newEnergy = Math.min(100, 30 + completedCount * 20);
        setPetState(prev => ({ ...prev, energy: newEnergy }));
        
        await supabase
          .from('profiles')
          .update({ pet_energy: newEnergy })
          .eq('user_id', user.id);
      }
    };
    updateEnergy();
  }, [user]);

  const size = compact ? 80 : 140;

  return (
    <div className={cn(
      "relative flex flex-col items-center gap-3",
      compact ? "scale-75" : ""
    )}>
      {/* Pet Container */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          style={{
            background: `radial-gradient(circle, ${moodConfig.eyeColor}40 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pet SVG */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="relative z-10"
        >
          {/* Body */}
          <motion.ellipse
            cx="50"
            cy="55"
            rx="35"
            ry="30"
            fill="url(#petGradient)"
            animate={{
              ry: [30, 32, 30],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Ears */}
          <motion.path
            d="M25 35 L15 10 L35 25 Z"
            fill="url(#petGradient)"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: '25px 30px' }}
          />
          <motion.path
            d="M75 35 L85 10 L65 25 Z"
            fill="url(#petGradient)"
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ transformOrigin: '75px 30px' }}
          />

          {/* Inner Ears */}
          <path d="M24 32 L18 15 L32 26 Z" fill="hsl(var(--primary) / 0.3)" />
          <path d="M76 32 L82 15 L68 26 Z" fill="hsl(var(--primary) / 0.3)" />

          {/* Face */}
          <ellipse cx="50" cy="45" rx="25" ry="20" fill="url(#faceGradient)" />

          {/* Eyes */}
          <AnimatePresence>
            {!isBlinking ? (
              <>
                <motion.ellipse
                  cx="40"
                  cy="42"
                  rx="6"
                  ry="7"
                  fill={moodConfig.eyeColor}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.1 }}
                />
                <motion.ellipse
                  cx="60"
                  cy="42"
                  rx="6"
                  ry="7"
                  fill={moodConfig.eyeColor}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.1 }}
                />
                {/* Eye highlights */}
                <circle cx="42" cy="40" r="2" fill="white" opacity="0.8" />
                <circle cx="62" cy="40" r="2" fill="white" opacity="0.8" />
              </>
            ) : (
              <>
                <line x1="34" y1="42" x2="46" y2="42" stroke={moodConfig.eyeColor} strokeWidth="2" strokeLinecap="round" />
                <line x1="54" y1="42" x2="66" y2="42" stroke={moodConfig.eyeColor} strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </AnimatePresence>

          {/* Nose */}
          <ellipse cx="50" cy="50" rx="3" ry="2" fill="hsl(var(--primary))" />

          {/* Mouth based on mood */}
          {petMood === 'happy' && (
            <path d="M44 54 Q50 60 56 54" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
          )}
          {petMood === 'sad' && (
            <path d="M44 58 Q50 54 56 58" fill="none" stroke="hsl(var(--primary) / 0.6)" strokeWidth="2" strokeLinecap="round" />
          )}
          {(petMood === 'neutral' || petMood === 'tired') && (
            <line x1="46" y1="56" x2="54" y2="56" stroke="hsl(var(--primary) / 0.6)" strokeWidth="2" strokeLinecap="round" />
          )}

          {/* Whiskers */}
          <g opacity="0.4">
            <line x1="20" y1="48" x2="32" y2="50" stroke="hsl(var(--foreground))" strokeWidth="1" />
            <line x1="20" y1="52" x2="32" y2="52" stroke="hsl(var(--foreground))" strokeWidth="1" />
            <line x1="68" y1="50" x2="80" y2="48" stroke="hsl(var(--foreground))" strokeWidth="1" />
            <line x1="68" y1="52" x2="80" y2="52" stroke="hsl(var(--foreground))" strokeWidth="1" />
          </g>

          {/* Tail */}
          <motion.path
            d="M80 65 Q95 55 90 75 Q85 85 75 75"
            fill="url(#petGradient)"
            animate={{
              d: [
                "M80 65 Q95 55 90 75 Q85 85 75 75",
                "M80 65 Q100 60 92 78 Q87 88 77 76",
                "M80 65 Q95 55 90 75 Q85 85 75 75",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Gradients */}
          <defs>
            <radialGradient id="petGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.9)" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </radialGradient>
            <radialGradient id="faceGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="hsl(var(--secondary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary) / 0.8)" />
            </radialGradient>
          </defs>
        </svg>

        {/* Sparkle effects when happy */}
        {petMood === 'happy' && (
          <>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
            <motion.div
              className="absolute -top-1 -left-3"
              animate={{ scale: [0, 1, 0], rotate: [0, -180, -360] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Stats Bar */}
      {!compact && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="flex items-center gap-4 text-xs">
            {/* Energy */}
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${petState.energy}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            {/* Level */}
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-muted-foreground font-medium">Lv.{petState.level}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/70 italic">
            {petMood === 'happy' && "Feeling joyful!"}
            {petMood === 'neutral' && "Calm and present"}
            {petMood === 'sad' && "Here with you"}
            {petMood === 'tired' && "Needs some rest"}
          </p>
        </div>
      )}
    </div>
  );
};

export default SoulPet;
