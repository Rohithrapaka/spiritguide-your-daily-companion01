export type PetType = 'dog' | 'cat' | 'fish';
export type EvolutionStage = 'baby' | 'teen' | 'guardian';
export type ChallengeType = 'daily' | 'weekly';

export interface PetChallenge {
  id: string;
  petType: PetType;
  type: ChallengeType;
  title: string;
  description: string;
  target: number;
  xpReward: number;
  icon: string;
}

export interface PetInfo {
  type: PetType;
  name: string;
  emoji: string;
  role: string;
  description: string;
  evolutionNames: Record<EvolutionStage, string>;
  color: string;
}

// XP thresholds for evolution
export const EVOLUTION_THRESHOLDS = {
  teen: 100,    // XP needed to evolve from baby to teen
  guardian: 300 // XP needed to evolve from teen to guardian
};

// Challenge requirements for evolution
export const CHALLENGE_REQUIREMENTS = {
  teen: 5,      // Challenges needed for teen
  guardian: 15  // Challenges needed for guardian
};

export const PET_INFO: Record<PetType, PetInfo> = {
  dog: {
    type: 'dog',
    name: 'Calm Pet',
    emoji: '🐕',
    role: 'Calm & Relaxation',
    description: 'Grows when you practice breathing, grounding, or stress relief',
    evolutionNames: {
      baby: 'Puppy',
      teen: 'Golden Retriever',
      guardian: 'Winged Celestial Dog'
    },
    color: 'from-amber-400 to-orange-500'
  },
  cat: {
    type: 'cat',
    name: 'Focus Pet',
    emoji: '🐈',
    role: 'Focus & Productivity',
    description: 'Grows when you complete focus, productivity, or consistency challenges',
    evolutionNames: {
      baby: 'Kitten',
      teen: 'Calico',
      guardian: 'Nine-tailed Zen Cat'
    },
    color: 'from-purple-400 to-indigo-500'
  },
  fish: {
    type: 'fish',
    name: 'Hope Pet',
    emoji: '🐟',
    role: 'Reflection & Hope',
    description: 'Grows when you journal, reflect, or talk about emotions',
    evolutionNames: {
      baby: 'Small Fry',
      teen: 'Goldfish',
      guardian: 'Dragon Fish'
    },
    color: 'from-cyan-400 to-blue-500'
  }
};

export const PET_CHALLENGES: PetChallenge[] = [
  // Dog (Calm) - Daily Challenges
  {
    id: 'dog_breathing_daily',
    petType: 'dog',
    type: 'daily',
    title: 'Deep Breaths',
    description: 'Complete 3 breathing sessions',
    target: 3,
    xpReward: 15,
    icon: '🌬️'
  },
  {
    id: 'dog_grounding_daily',
    petType: 'dog',
    type: 'daily',
    title: 'Stay Grounded',
    description: 'Practice grounding exercise',
    target: 1,
    xpReward: 10,
    icon: '🌿'
  },
  {
    id: 'dog_calm_daily',
    petType: 'dog',
    type: 'daily',
    title: 'Moment of Calm',
    description: 'Use stress relief tool',
    target: 2,
    xpReward: 12,
    icon: '☮️'
  },
  // Dog - Weekly Challenges
  {
    id: 'dog_zen_weekly',
    petType: 'dog',
    type: 'weekly',
    title: 'Zen Master',
    description: 'Complete 10 calm sessions',
    target: 10,
    xpReward: 50,
    icon: '🧘'
  },
  {
    id: 'dog_peace_weekly',
    petType: 'dog',
    type: 'weekly',
    title: 'Inner Peace',
    description: 'Log 5 calm moods',
    target: 5,
    xpReward: 40,
    icon: '✨'
  },

  // Cat (Focus) - Daily Challenges
  {
    id: 'cat_focus_daily',
    petType: 'cat',
    type: 'daily',
    title: 'Focus Session',
    description: 'Complete 2 focus sessions',
    target: 2,
    xpReward: 15,
    icon: '🎯'
  },
  {
    id: 'cat_task_daily',
    petType: 'cat',
    type: 'daily',
    title: 'Task Master',
    description: 'Complete 3 daily tasks',
    target: 3,
    xpReward: 12,
    icon: '✅'
  },
  {
    id: 'cat_streak_daily',
    petType: 'cat',
    type: 'daily',
    title: 'Consistency Check',
    description: 'Check in with your mood',
    target: 1,
    xpReward: 10,
    icon: '📊'
  },
  // Cat - Weekly Challenges
  {
    id: 'cat_productive_weekly',
    petType: 'cat',
    type: 'weekly',
    title: 'Productivity Pro',
    description: 'Complete 15 focus sessions',
    target: 15,
    xpReward: 60,
    icon: '🏆'
  },
  {
    id: 'cat_discipline_weekly',
    petType: 'cat',
    type: 'weekly',
    title: 'Discipline',
    description: 'Check in 7 days straight',
    target: 7,
    xpReward: 45,
    icon: '🔥'
  },

  // Fish (Hope) - Daily Challenges
  {
    id: 'fish_journal_daily',
    petType: 'fish',
    type: 'daily',
    title: 'Daily Reflection',
    description: 'Write in your journal',
    target: 1,
    xpReward: 15,
    icon: '📝'
  },
  {
    id: 'fish_chat_daily',
    petType: 'fish',
    type: 'daily',
    title: 'Open Up',
    description: 'Have 2 chat conversations',
    target: 2,
    xpReward: 12,
    icon: '💬'
  },
  {
    id: 'fish_emotion_daily',
    petType: 'fish',
    type: 'daily',
    title: 'Name Your Feeling',
    description: 'Log mood with emotion tags',
    target: 1,
    xpReward: 10,
    icon: '💭'
  },
  // Fish - Weekly Challenges
  {
    id: 'fish_reflect_weekly',
    petType: 'fish',
    type: 'weekly',
    title: 'Deep Thinker',
    description: 'Write 5 journal entries',
    target: 5,
    xpReward: 50,
    icon: '🌊'
  },
  {
    id: 'fish_share_weekly',
    petType: 'fish',
    type: 'weekly',
    title: 'Heart to Heart',
    description: 'Have 10 meaningful chats',
    target: 10,
    xpReward: 55,
    icon: '💝'
  }
];

export function getChallengesForPet(petType: PetType): PetChallenge[] {
  return PET_CHALLENGES.filter(c => c.petType === petType);
}

export function getDailyChallenges(petType: PetType): PetChallenge[] {
  return PET_CHALLENGES.filter(c => c.petType === petType && c.type === 'daily');
}

export function getWeeklyChallenges(petType: PetType): PetChallenge[] {
  return PET_CHALLENGES.filter(c => c.petType === petType && c.type === 'weekly');
}

export function calculateEvolutionStage(xp: number, challengesCompleted: number): EvolutionStage {
  if (xp >= EVOLUTION_THRESHOLDS.guardian && challengesCompleted >= CHALLENGE_REQUIREMENTS.guardian) {
    return 'guardian';
  }
  if (xp >= EVOLUTION_THRESHOLDS.teen && challengesCompleted >= CHALLENGE_REQUIREMENTS.teen) {
    return 'teen';
  }
  return 'baby';
}

export function getNextEvolutionRequirements(currentStage: EvolutionStage, currentXp: number, currentChallenges: number) {
  if (currentStage === 'guardian') {
    return null; // Max evolution
  }
  
  const nextStage = currentStage === 'baby' ? 'teen' : 'guardian';
  const xpNeeded = EVOLUTION_THRESHOLDS[nextStage] - currentXp;
  const challengesNeeded = CHALLENGE_REQUIREMENTS[nextStage] - currentChallenges;
  
  return {
    nextStage,
    xpNeeded: Math.max(0, xpNeeded),
    challengesNeeded: Math.max(0, challengesNeeded),
    xpProgress: Math.min(100, (currentXp / EVOLUTION_THRESHOLDS[nextStage]) * 100),
    challengeProgress: Math.min(100, (currentChallenges / CHALLENGE_REQUIREMENTS[nextStage]) * 100)
  };
}
