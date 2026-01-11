import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Edit2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { EvolutionStage, getEvolutionProgress } from './EvolutionPetSVG';

interface PetNameTagProps {
  name: string;
  onNameChange: (name: string) => void;
  stage: EvolutionStage;
}

export const PetNameTag: React.FC<PetNameTagProps> = ({ name, onNameChange, stage }) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  const handleSave = () => {
    if (tempName.trim()) {
      onNameChange(tempName.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempName(name);
    setIsEditing(false);
  };

  const stageColors = {
    baby: 'from-pink-200 to-pink-300 dark:from-pink-400/30 dark:to-pink-500/30',
    teen: 'from-blue-200 to-indigo-300 dark:from-blue-400/30 dark:to-indigo-500/30',
    guardian: 'from-amber-200 to-yellow-300 dark:from-amber-400/30 dark:to-yellow-500/30'
  };

  const stageIcons = {
    baby: '🌱',
    teen: '⭐',
    guardian: '👑'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative px-4 py-2 rounded-full shadow-lg",
        "bg-gradient-to-r",
        stageColors[stage],
        "border border-white/50 dark:border-white/20"
      )}
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-24 bg-transparent text-sm font-semibold text-foreground outline-none border-b border-foreground/30"
              maxLength={12}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <button onClick={handleSave} className="p-1 hover:bg-white/20 rounded-full">
              <Check className="w-3.5 h-3.5 text-green-600" />
            </button>
            <button onClick={handleCancel} className="p-1 hover:bg-white/20 rounded-full">
              <X className="w-3.5 h-3.5 text-red-500" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-sm">{stageIcons[stage]}</span>
            <span className="text-sm font-semibold text-foreground">
              {name || 'Name me!'}
            </span>
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <Edit2 className="w-3 h-3 text-muted-foreground" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface LoveMeterProps {
  lovePoints: number;
  maxPoints?: number;
}

export const LoveMeter: React.FC<LoveMeterProps> = ({ lovePoints, maxPoints = 100 }) => {
  const percentage = Math.min(100, (lovePoints / maxPoints) * 100);
  
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1.5">
        <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
        <span className="text-xs font-medium text-muted-foreground">Love</span>
      </div>
      
      {/* Heart-shaped meter container */}
      <div className="relative w-16 h-14">
        {/* Heart background */}
        <svg viewBox="0 0 24 22" className="absolute inset-0 w-full h-full">
          <defs>
            <clipPath id="heartClip">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </clipPath>
            <linearGradient id="loveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          
          {/* Heart outline */}
          <path 
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="none"
            stroke="#f9a8d4"
            strokeWidth="1"
          />
          
          {/* Filled portion */}
          <g clipPath="url(#heartClip)">
            <motion.rect
              x="0"
              y={22 - (22 * percentage / 100)}
              width="24"
              height={22 * percentage / 100}
              fill="url(#loveGradient)"
              initial={false}
              animate={{ y: 22 - (22 * percentage / 100) }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            />
          </g>
        </svg>
        
        {/* Sparkle when full */}
        {percentage >= 90 && (
          <motion.div
            className="absolute -top-1 left-1/2 -translate-x-1/2"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        )}
      </div>
      
      <span className="text-xs font-semibold text-pink-500">{lovePoints}</span>
    </div>
  );
};

interface EvolutionProgressProps {
  stage: EvolutionStage;
  totalChallenges: number;
}

export const EvolutionProgress: React.FC<EvolutionProgressProps> = ({ stage, totalChallenges }) => {
  const progress = getEvolutionProgress(totalChallenges);
  
  const stageInfo = {
    baby: { name: 'Baby', next: 'Teen', required: 6, icon: '🌱' },
    teen: { name: 'Teen', next: 'Guardian', required: 16, icon: '⭐' },
    guardian: { name: 'Guardian', next: null, required: null, icon: '👑' }
  };

  const info = stageInfo[stage];

  return (
    <div className="flex flex-col gap-2 min-w-[120px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Evolution</span>
        <span className="text-xs">{info.icon} {info.name}</span>
      </div>
      
      <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            stage === 'baby' && "bg-gradient-to-r from-pink-400 to-pink-500",
            stage === 'teen' && "bg-gradient-to-r from-blue-400 to-indigo-500",
            stage === 'guardian' && "bg-gradient-to-r from-amber-400 to-yellow-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        />
      </div>
      
      {info.next && (
        <span className="text-[10px] text-muted-foreground text-center">
          {info.required! - totalChallenges} challenges to {info.next}
        </span>
      )}
      {stage === 'guardian' && (
        <span className="text-[10px] text-amber-500 text-center font-medium">
          ✨ Max Level!
        </span>
      )}
    </div>
  );
};

interface LovePopupProps {
  amount: number;
  x: number;
  y: number;
  onComplete: () => void;
}

export const LovePopup: React.FC<LovePopupProps> = ({ amount, x, y, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="absolute pointer-events-none z-50 flex items-center gap-1"
      style={{ left: x, top: y }}
      initial={{ opacity: 1, scale: 0.5, y: 0 }}
      animate={{ opacity: 0, scale: 1.2, y: -40 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
      <span className="text-sm font-bold text-pink-500">+{amount}</span>
    </motion.div>
  );
};

export default { PetNameTag, LoveMeter, EvolutionProgress, LovePopup };
