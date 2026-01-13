import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { PetType, EvolutionStage, PET_INFO } from '@/lib/petChallenges';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EvolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  petType: PetType;
  fromStage: EvolutionStage;
  toStage: EvolutionStage;
  reason: string;
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({
  isOpen,
  onClose,
  petType,
  fromStage,
  toStage,
  reason
}) => {
  const [showNewForm, setShowNewForm] = useState(false);
  const petInfo = PET_INFO[petType];

  useEffect(() => {
    if (isOpen) {
      setShowNewForm(false);
      const timer = setTimeout(() => setShowNewForm(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getStageEmoji = (stage: EvolutionStage) => {
    if (petType === 'dog') {
      return stage === 'baby' ? '🐕' : stage === 'teen' ? '🦮' : '🐕‍🦺';
    }
    if (petType === 'cat') {
      return stage === 'baby' ? '🐱' : stage === 'teen' ? '🐈' : '😺';
    }
    return stage === 'baby' ? '🐟' : stage === 'teen' ? '🐠' : '🐉';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-none bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden">
        <DialogTitle className="sr-only">Pet Evolution</DialogTitle>
        
        {/* Sparkle background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
              className="absolute left-1/2 top-1/2"
            >
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 py-6 text-center">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Evolution!
              </h2>
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-muted-foreground text-sm">
              Your {petInfo.name} has evolved!
            </p>
          </motion.div>

          {/* Evolution Animation */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Old Form */}
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ 
                opacity: showNewForm ? 0.3 : 1,
                scale: showNewForm ? 0.8 : 1
              }}
              className="text-center"
            >
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-2",
                "bg-secondary/50"
              )}>
                {getStageEmoji(fromStage)}
              </div>
              <p className="text-xs text-muted-foreground">
                {petInfo.evolutionNames[fromStage]}
              </p>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ArrowRight className="h-6 w-6 text-primary" />
            </motion.div>

            {/* New Form */}
            <AnimatePresence>
              {showNewForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(var(--primary), 0)',
                        '0 0 30px 10px rgba(var(--primary), 0.3)',
                        '0 0 0 0 rgba(var(--primary), 0)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={cn(
                      "w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mb-2",
                      `bg-gradient-to-br ${petInfo.color}`
                    )}
                  >
                    {getStageEmoji(toStage)}
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm font-semibold text-primary"
                  >
                    {petInfo.evolutionNames[toStage]}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reason */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="bg-primary/10 rounded-xl p-4 mb-6"
          >
            <p className="text-sm">
              <span className="text-primary font-semibold">✨ Evolved because:</span>
              <br />
              {reason}
            </p>
          </motion.div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={cn(
              "px-8 py-3 rounded-full font-semibold",
              `bg-gradient-to-r ${petInfo.color} text-white`,
              "shadow-lg hover:shadow-xl transition-shadow"
            )}
          >
            Amazing! 🎉
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvolutionModal;
