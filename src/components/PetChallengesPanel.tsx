import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Progress } from '@/components/ui/progress';
import { 
  PetType, 
  PET_INFO, 
  getDailyChallenges, 
  getWeeklyChallenges,
  getNextEvolutionRequirements,
  PetChallenge
} from '@/lib/petChallenges';
import { usePetProgress, ChallengeProgress } from '@/hooks/usePetProgress';
import { Sparkles, Trophy, Target, Calendar, Zap } from 'lucide-react';

interface PetChallengesPanelProps {
  selectedPet: PetType;
  onChallengeComplete?: (challenge: PetChallenge) => void;
}

export const PetChallengesPanel: React.FC<PetChallengesPanelProps> = ({
  selectedPet,
  onChallengeComplete
}) => {
  const { theme } = useTheme();
  const { 
    getPetProgress, 
    getPetChallengeProgress, 
    updateChallengeProgress 
  } = usePetProgress();
  
  const petProgress = getPetProgress(selectedPet);
  const challengeProgressList = getPetChallengeProgress(selectedPet);
  const petInfo = PET_INFO[selectedPet];
  const nextEvolution = getNextEvolutionRequirements(
    petProgress.evolutionStage, 
    petProgress.xp, 
    petProgress.challengesCompleted
  );

  const dailyChallenges = getDailyChallenges(selectedPet);
  const weeklyChallenges = getWeeklyChallenges(selectedPet);

  const getChallengeProgressData = (challengeId: string): ChallengeProgress => {
    const found = challengeProgressList.find(c => c.challenge.id === challengeId);
    return found?.progress || { challengeId, progress: 0, target: 0, completed: false };
  };

  const handleIncrementProgress = async (challenge: PetChallenge) => {
    await updateChallengeProgress(challenge, 1);
    if (onChallengeComplete) {
      onChallengeComplete(challenge);
    }
  };

  return (
    <div className={cn(
      "rounded-2xl p-5 h-full overflow-y-auto",
      theme === 'warm' ? "warm-card" : "glass-card"
    )}>
      {/* Pet Header */}
      <div className={cn(
        "rounded-xl p-4 mb-5",
        `bg-gradient-to-r ${petInfo.color} text-white`
      )}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{petInfo.emoji}</span>
          <div>
            <h3 className="font-bold text-lg">{petInfo.name}</h3>
            <p className="text-sm opacity-90">{petInfo.role}</p>
          </div>
        </div>
        
        {/* Current Evolution */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">
            {petInfo.evolutionNames[petProgress.evolutionStage]}
          </span>
          <span className="text-xs opacity-75 ml-auto">
            Level {petProgress.level}
          </span>
        </div>

        {/* XP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>XP: {petProgress.xp}</span>
            {nextEvolution && (
              <span>{nextEvolution.xpNeeded} XP to {petInfo.evolutionNames[nextEvolution.nextStage]}</span>
            )}
          </div>
          <Progress 
            value={nextEvolution?.xpProgress || 100} 
            className="h-2 bg-white/20"
          />
        </div>

        {/* Evolution Requirements */}
        {nextEvolution && (
          <div className="mt-3 pt-3 border-t border-white/20 text-xs">
            <div className="flex items-center gap-2">
              <Trophy className="h-3 w-3" />
              <span>
                Challenges: {petProgress.challengesCompleted} / {
                  nextEvolution.nextStage === 'teen' ? 5 : 15
                }
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Daily Challenges */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Daily Challenges</h4>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {dailyChallenges.map((challenge) => {
              const progress = getChallengeProgressData(challenge.id);
              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  progress={progress}
                  onIncrement={() => handleIncrementProgress(challenge)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Weekly Challenges */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Weekly Challenges</h4>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {weeklyChallenges.map((challenge) => {
              const progress = getChallengeProgressData(challenge.id);
              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  progress={progress}
                  onIncrement={() => handleIncrementProgress(challenge)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface ChallengeCardProps {
  challenge: PetChallenge;
  progress: ChallengeProgress;
  onIncrement: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  progress, 
  onIncrement 
}) => {
  const { theme } = useTheme();
  const progressPercent = (progress.progress / challenge.target) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl p-3 relative overflow-hidden",
        progress.completed 
          ? "bg-primary/10 border border-primary/30" 
          : theme === 'warm' ? "bg-secondary/50" : "bg-secondary/30"
      )}
    >
      {/* Completed overlay */}
      {progress.completed && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <div className="bg-primary text-primary-foreground rounded-full p-1">
            <Sparkles className="h-3 w-3" />
          </div>
        </motion.div>
      )}

      <div className="flex items-start gap-3">
        <span className="text-2xl">{challenge.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h5 className={cn(
              "font-medium text-sm",
              progress.completed && "line-through opacity-60"
            )}>
              {challenge.title}
            </h5>
            <span className="text-xs text-primary flex items-center gap-1">
              <Zap className="h-3 w-3" />
              +{challenge.xpReward}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {challenge.description}
          </p>
          
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <Progress 
              value={progressPercent} 
              className="h-1.5 flex-1"
            />
            <span className="text-xs font-medium whitespace-nowrap">
              {progress.progress}/{challenge.target}
            </span>
          </div>
        </div>
      </div>

      {/* Manual increment button (for testing/demo) */}
      {!progress.completed && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onIncrement}
          className={cn(
            "mt-2 w-full py-1.5 rounded-lg text-xs font-medium",
            "bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          )}
        >
          + Log Progress
        </motion.button>
      )}
    </motion.div>
  );
};

export default PetChallengesPanel;
