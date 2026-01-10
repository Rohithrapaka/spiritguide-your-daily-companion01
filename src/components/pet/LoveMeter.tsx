import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoveMeterProps {
  lovePoints: number;
  maxPoints?: number;
}

export const LoveMeter: React.FC<LoveMeterProps> = ({ 
  lovePoints, 
  maxPoints = 100 
}) => {
  const percentage = Math.min(100, (lovePoints / maxPoints) * 100);
  
  // Heart fill color based on level
  const getHeartColor = () => {
    if (percentage >= 80) return 'from-pink-400 to-rose-500';
    if (percentage >= 50) return 'from-pink-300 to-rose-400';
    if (percentage >= 25) return 'from-pink-200 to-rose-300';
    return 'from-gray-300 to-gray-400';
  };

  return (
    <div className="flex items-center gap-2">
      {/* Heart icon with pulse */}
      <motion.div
        animate={percentage >= 80 ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="relative"
      >
        <Heart 
          className={`w-6 h-6 ${percentage >= 50 ? 'text-rose-500' : 'text-rose-300'}`}
          fill={percentage >= 25 ? 'currentColor' : 'none'}
        />
        {percentage >= 80 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="w-6 h-6 text-rose-400" fill="currentColor" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Love bar */}
      <div className="relative w-24 h-5 bg-muted/50 rounded-full overflow-hidden border border-border/50">
        {/* Fill */}
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getHeartColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        
        {/* Hearts inside */}
        {percentage >= 60 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-xs">💕</span>
          </motion.div>
        )}
      </div>
      
      {/* Points text */}
      <span className="text-xs font-medium text-muted-foreground min-w-[2.5rem]">
        {lovePoints}
      </span>
    </div>
  );
};

export default LoveMeter;
