import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ArrowUp } from 'lucide-react';

interface LevelUpEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const LevelUpEffect: React.FC<LevelUpEffectProps> = ({ 
  isActive, 
  onComplete 
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => {
            setTimeout(() => onComplete?.(), 2000);
          }}
        >
          {/* Background flash */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-amber-300/40 to-yellow-400/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Center burst */}
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
            {/* Radiating circles */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border-4 border-yellow-400"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 3 + i, opacity: 0 }}
                transition={{ 
                  duration: 1, 
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
                style={{
                  width: 100,
                  height: 100,
                  left: -50,
                  top: -50
                }}
              />
            ))}
            
            {/* Stars burst */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 8) * 150,
                  y: Math.sin((i * Math.PI * 2) / 8) * 150,
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 0.5],
                  rotate: 360
                }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              >
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
            
            {/* Sparkles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 300 - 50,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.1 + Math.random() * 0.3,
                  ease: "easeOut"
                }}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
              </motion.div>
            ))}
            
            {/* Center icon */}
            <motion.div
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-2xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.4, delay: 0.5, repeat: 2 }}
              >
                <ArrowUp className="w-12 h-12 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Level up text */}
          <motion.div
            className="absolute mt-40 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <motion.h2
              className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.8, delay: 0.6, repeat: 2 }}
            >
              LEVEL UP!
            </motion.h2>
            <motion.p
              className="text-lg text-amber-600 dark:text-amber-400 mt-2 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Your pet is evolving! ✨
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Love popup effect
interface LovePopupProps {
  isActive: boolean;
  x: number;
  y: number;
  amount?: number;
}

export const LovePopup: React.FC<LovePopupProps> = ({ 
  isActive, 
  x, 
  y, 
  amount = 10 
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute pointer-events-none z-20"
          style={{ left: x, top: y }}
          initial={{ y: 0, opacity: 1, scale: 0.5 }}
          animate={{ y: -50, opacity: 0, scale: 1.2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-lg">
            <span>💕</span>
            <span>+{amount}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpEffect;
