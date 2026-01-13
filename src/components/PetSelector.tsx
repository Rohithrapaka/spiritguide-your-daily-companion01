import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { PetType, PET_INFO } from '@/lib/petChallenges';
import { usePetProgress } from '@/hooks/usePetProgress';
import { Sparkles } from 'lucide-react';

interface PetSelectorProps {
  selectedPet: PetType;
  onSelectPet: (pet: PetType) => void;
}

export const PetSelector: React.FC<PetSelectorProps> = ({
  selectedPet,
  onSelectPet
}) => {
  const { theme } = useTheme();
  const { getPetProgress } = usePetProgress();

  const pets: PetType[] = ['dog', 'cat', 'fish'];

  return (
    <div className="flex gap-3 justify-center">
      {pets.map((petType) => {
        const petInfo = PET_INFO[petType];
        const progress = getPetProgress(petType);
        const isSelected = selectedPet === petType;

        return (
          <motion.button
            key={petType}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectPet(petType)}
            className={cn(
              "relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all",
              isSelected 
                ? `bg-gradient-to-br ${petInfo.color} text-white shadow-lg`
                : theme === 'warm' ? "bg-secondary/50 hover:bg-secondary" : "bg-secondary/30 hover:bg-secondary/50"
            )}
          >
            {/* Evolution indicator */}
            {progress.evolutionStage !== 'baby' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1"
              >
                <div className={cn(
                  "p-0.5 rounded-full",
                  progress.evolutionStage === 'guardian' 
                    ? "bg-yellow-400" 
                    : "bg-primary"
                )}>
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </motion.div>
            )}

            <span className="text-2xl">{petInfo.emoji}</span>
            <span className={cn(
              "text-xs font-medium",
              !isSelected && "text-muted-foreground"
            )}>
              {petInfo.evolutionNames[progress.evolutionStage]}
            </span>
            <span className={cn(
              "text-[10px]",
              isSelected ? "text-white/80" : "text-muted-foreground"
            )}>
              Lv.{progress.level}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default PetSelector;
