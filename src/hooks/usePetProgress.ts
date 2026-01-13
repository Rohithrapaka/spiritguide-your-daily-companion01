import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PetType, 
  EvolutionStage, 
  PetChallenge,
  calculateEvolutionStage,
  getChallengesForPet
} from '@/lib/petChallenges';

export interface PetProgress {
  petType: PetType;
  xp: number;
  level: number;
  evolutionStage: EvolutionStage;
  challengesCompleted: number;
}

export interface ChallengeProgress {
  challengeId: string;
  progress: number;
  target: number;
  completed: boolean;
}

interface EvolutionEvent {
  petType: PetType;
  fromStage: EvolutionStage;
  toStage: EvolutionStage;
  reason: string;
}

export function usePetProgress() {
  const { user } = useAuth();
  const [allPetProgress, setAllPetProgress] = useState<Record<PetType, PetProgress>>({
    dog: { petType: 'dog', xp: 0, level: 1, evolutionStage: 'baby', challengesCompleted: 0 },
    cat: { petType: 'cat', xp: 0, level: 1, evolutionStage: 'baby', challengesCompleted: 0 },
    fish: { petType: 'fish', xp: 0, level: 1, evolutionStage: 'baby', challengesCompleted: 0 }
  });
  const [challengeProgress, setChallengeProgress] = useState<Record<string, ChallengeProgress>>({});
  const [loading, setLoading] = useState(true);
  const [evolutionEvent, setEvolutionEvent] = useState<EvolutionEvent | null>(null);

  // Load pet progress from database
  const loadProgress = useCallback(async () => {
    if (!user) return;

    try {
      // Load pet progress
      const { data: progressData } = await supabase
        .from('pet_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressData) {
        const newProgress = { ...allPetProgress };
        progressData.forEach((p: any) => {
          newProgress[p.pet_type as PetType] = {
            petType: p.pet_type,
            xp: p.xp,
            level: p.level,
            evolutionStage: p.evolution_stage,
            challengesCompleted: p.challenges_completed
          };
        });
        setAllPetProgress(newProgress);
      }

      // Load challenge progress for today
      const today = new Date().toISOString().split('T')[0];
      const { data: challengeData } = await supabase
        .from('pet_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('reset_at', today);

      if (challengeData) {
        const newChallengeProgress: Record<string, ChallengeProgress> = {};
        challengeData.forEach((c: any) => {
          newChallengeProgress[c.challenge_id] = {
            challengeId: c.challenge_id,
            progress: c.progress,
            target: c.target,
            completed: c.completed
          };
        });
        setChallengeProgress(newChallengeProgress);
      }
    } catch (error) {
      console.error('Error loading pet progress:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Initialize pet progress if it doesn't exist
  const initializePetProgress = useCallback(async (petType: PetType) => {
    if (!user) return;

    const { error } = await supabase
      .from('pet_progress')
      .upsert({
        user_id: user.id,
        pet_type: petType,
        xp: 0,
        level: 1,
        evolution_stage: 'baby',
        challenges_completed: 0
      }, { onConflict: 'user_id,pet_type' });

    if (error) {
      console.error('Error initializing pet progress:', error);
    }
  }, [user]);

  // Add XP to a specific pet
  const addXp = useCallback(async (petType: PetType, amount: number, reason: string) => {
    if (!user) return;

    const currentProgress = allPetProgress[petType];
    const newXp = currentProgress.xp + amount;
    const newChallengesCompleted = currentProgress.challengesCompleted + 1;
    const newStage = calculateEvolutionStage(newXp, newChallengesCompleted);
    const newLevel = Math.floor(newXp / 50) + 1;

    // Check for evolution
    if (newStage !== currentProgress.evolutionStage) {
      setEvolutionEvent({
        petType,
        fromStage: currentProgress.evolutionStage,
        toStage: newStage,
        reason
      });
    }

    // Update local state
    setAllPetProgress(prev => ({
      ...prev,
      [petType]: {
        ...prev[petType],
        xp: newXp,
        level: newLevel,
        evolutionStage: newStage,
        challengesCompleted: newChallengesCompleted
      }
    }));

    // Update database
    const { error } = await supabase
      .from('pet_progress')
      .upsert({
        user_id: user.id,
        pet_type: petType,
        xp: newXp,
        level: newLevel,
        evolution_stage: newStage,
        challenges_completed: newChallengesCompleted
      }, { onConflict: 'user_id,pet_type' });

    if (error) {
      console.error('Error updating pet progress:', error);
    }
  }, [user, allPetProgress]);

  // Update challenge progress
  const updateChallengeProgress = useCallback(async (
    challenge: PetChallenge, 
    incrementBy: number = 1
  ) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const currentProgress = challengeProgress[challenge.id]?.progress || 0;
    const newProgress = Math.min(currentProgress + incrementBy, challenge.target);
    const isCompleted = newProgress >= challenge.target;
    const wasCompleted = challengeProgress[challenge.id]?.completed || false;

    // Update local state
    setChallengeProgress(prev => ({
      ...prev,
      [challenge.id]: {
        challengeId: challenge.id,
        progress: newProgress,
        target: challenge.target,
        completed: isCompleted
      }
    }));

    // Update database
    await supabase
      .from('pet_challenges')
      .upsert({
        user_id: user.id,
        pet_type: challenge.petType,
        challenge_id: challenge.id,
        challenge_type: challenge.type,
        progress: newProgress,
        target: challenge.target,
        completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
        reset_at: today
      }, { onConflict: 'user_id,pet_type,challenge_id,reset_at' });

    // Award XP if challenge just completed
    if (isCompleted && !wasCompleted) {
      await addXp(challenge.petType, challenge.xpReward, challenge.title);
    }
  }, [user, challengeProgress, addXp]);

  // Get progress for a specific pet
  const getPetProgress = useCallback((petType: PetType) => {
    return allPetProgress[petType];
  }, [allPetProgress]);

  // Get challenge progress for a specific pet
  const getPetChallengeProgress = useCallback((petType: PetType) => {
    const challenges = getChallengesForPet(petType);
    return challenges.map(c => ({
      challenge: c,
      progress: challengeProgress[c.id] || { 
        challengeId: c.id, 
        progress: 0, 
        target: c.target, 
        completed: false 
      }
    }));
  }, [challengeProgress]);

  // Clear evolution event after it's been shown
  const clearEvolutionEvent = useCallback(() => {
    setEvolutionEvent(null);
  }, []);

  return {
    allPetProgress,
    loading,
    evolutionEvent,
    clearEvolutionEvent,
    addXp,
    updateChallengeProgress,
    getPetProgress,
    getPetChallengeProgress,
    initializePetProgress,
    refreshProgress: loadProgress
  };
}
