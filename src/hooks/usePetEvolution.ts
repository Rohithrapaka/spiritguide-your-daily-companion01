import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { EvolutionStage, PetType } from '@/components/pet/EvolutionPetSVG';

interface PetProfile {
  petType: PetType;
  petName: string | null;
  petLevel: number;
  petEnergy: number;
  lovePoints: number;
  totalChallengesCompleted: number;
}

interface UsePetEvolutionReturn {
  petProfile: PetProfile;
  evolutionStage: EvolutionStage;
  isLoading: boolean;
  updatePetName: (name: string) => Promise<void>;
  updatePetType: (type: PetType) => Promise<void>;
  addLovePoints: (amount: number) => Promise<void>;
  incrementChallenges: () => Promise<void>;
  triggerLevelUp: boolean;
  setTriggerLevelUp: (val: boolean) => void;
}

export const getEvolutionStage = (level: number): EvolutionStage => {
  if (level >= 16) return 'guardian';
  if (level >= 6) return 'teen';
  return 'baby';
};

export const calculateLevel = (totalChallenges: number): number => {
  // Level formula: each level requires more challenges
  // Level 1: 0-2, Level 2: 3-5, Level 3: 6-9, etc.
  let level = 1;
  let threshold = 0;
  let increment = 3;
  
  while (totalChallenges >= threshold + increment) {
    threshold += increment;
    level++;
    increment = Math.floor(increment * 1.2) + 1;
    if (level >= 25) break; // Cap at level 25
  }
  
  return level;
};

export const usePetEvolution = (): UsePetEvolutionReturn => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [triggerLevelUp, setTriggerLevelUp] = useState(false);
  
  const [petProfile, setPetProfile] = useState<PetProfile>({
    petType: 'dog',
    petName: null,
    petLevel: 1,
    petEnergy: 50,
    lovePoints: 0,
    totalChallengesCompleted: 0
  });

  // Load profile from Supabase
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('pet_type, pet_name, pet_level, pet_energy, love_points, total_challenges_completed')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading pet profile:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        const totalChallenges = data.total_challenges_completed || 0;
        const calculatedLevel = calculateLevel(totalChallenges);
        
        setPetProfile({
          petType: (data.pet_type as PetType) || 'dog',
          petName: data.pet_name,
          petLevel: calculatedLevel,
          petEnergy: data.pet_energy || 50,
          lovePoints: data.love_points || 0,
          totalChallengesCompleted: totalChallenges
        });

        // Update level in DB if it changed
        if (calculatedLevel !== data.pet_level) {
          await supabase
            .from('profiles')
            .update({ pet_level: calculatedLevel })
            .eq('user_id', user.id);
        }
      }

      setIsLoading(false);
    };

    loadProfile();
  }, [user]);

  // Calculate total challenges on mount
  useEffect(() => {
    const calculateTotalChallenges = async () => {
      if (!user) return;

      const { data: challenges } = await supabase
        .from('daily_challenges')
        .select('completed_quests')
        .eq('user_id', user.id);

      if (challenges) {
        const total = challenges.reduce((sum, day) => {
          return sum + (day.completed_quests?.length || 0);
        }, 0);

        const newLevel = calculateLevel(total);
        const prevLevel = petProfile.petLevel;

        setPetProfile(prev => ({
          ...prev,
          totalChallengesCompleted: total,
          petLevel: newLevel
        }));

        // Trigger level up animation if level increased
        if (newLevel > prevLevel && prevLevel > 0) {
          setTriggerLevelUp(true);
        }

        // Update in database
        await supabase
          .from('profiles')
          .update({ 
            total_challenges_completed: total,
            pet_level: newLevel
          })
          .eq('user_id', user.id);
      }
    };

    if (!isLoading && user) {
      calculateTotalChallenges();
    }
  }, [user, isLoading]);

  const updatePetName = useCallback(async (name: string) => {
    if (!user) return;

    setPetProfile(prev => ({ ...prev, petName: name }));

    await supabase
      .from('profiles')
      .update({ pet_name: name })
      .eq('user_id', user.id);
  }, [user]);

  const updatePetType = useCallback(async (type: PetType) => {
    if (!user) return;

    setPetProfile(prev => ({ ...prev, petType: type }));

    await supabase
      .from('profiles')
      .update({ pet_type: type })
      .eq('user_id', user.id);
  }, [user]);

  const addLovePoints = useCallback(async (amount: number) => {
    if (!user) return;

    const newPoints = Math.min(100, petProfile.lovePoints + amount);
    setPetProfile(prev => ({ ...prev, lovePoints: newPoints }));

    await supabase
      .from('profiles')
      .update({ love_points: newPoints })
      .eq('user_id', user.id);
  }, [user, petProfile.lovePoints]);

  const incrementChallenges = useCallback(async () => {
    if (!user) return;

    const newTotal = petProfile.totalChallengesCompleted + 1;
    const newLevel = calculateLevel(newTotal);
    const prevLevel = petProfile.petLevel;

    setPetProfile(prev => ({
      ...prev,
      totalChallengesCompleted: newTotal,
      petLevel: newLevel
    }));

    // Trigger level up animation if level increased
    if (newLevel > prevLevel) {
      setTriggerLevelUp(true);
    }

    await supabase
      .from('profiles')
      .update({ 
        total_challenges_completed: newTotal,
        pet_level: newLevel
      })
      .eq('user_id', user.id);
  }, [user, petProfile]);

  const evolutionStage = getEvolutionStage(petProfile.petLevel);

  return {
    petProfile,
    evolutionStage,
    isLoading,
    updatePetName,
    updatePetType,
    addLovePoints,
    incrementChallenges,
    triggerLevelUp,
    setTriggerLevelUp
  };
};

export default usePetEvolution;
