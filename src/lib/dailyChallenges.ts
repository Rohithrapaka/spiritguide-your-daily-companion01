export interface SoulQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'breathing' | 'hydration' | 'connection' | 'movement' | 'mindfulness' | 'gratitude';
}

export const soulQuests: SoulQuest[] = [
  {
    id: 'breathing-1',
    title: '1-Minute Breathing',
    description: 'Take a moment to focus on your breath. Inhale for 4 seconds, hold for 4, exhale for 4.',
    icon: '🌬️',
    category: 'breathing'
  },
  {
    id: 'hydration-1',
    title: 'Hydrate Your Soul',
    description: 'Drink a full glass of water. Your body and mind will thank you!',
    icon: '💧',
    category: 'hydration'
  },
  {
    id: 'connection-1',
    title: 'Reach Out',
    description: 'Send a kind message to a friend or family member. Connection heals.',
    icon: '💬',
    category: 'connection'
  },
  {
    id: 'movement-1',
    title: 'Gentle Stretch',
    description: 'Stand up and stretch your body for 2 minutes. Release the tension.',
    icon: '🧘',
    category: 'movement'
  },
  {
    id: 'mindfulness-1',
    title: 'Present Moment',
    description: 'Name 5 things you can see, 4 you can hear, 3 you can touch. Ground yourself.',
    icon: '🌸',
    category: 'mindfulness'
  },
  {
    id: 'gratitude-1',
    title: 'Gratitude Moment',
    description: 'Write down or think of 3 things you\'re grateful for today.',
    icon: '✨',
    category: 'gratitude'
  },
  {
    id: 'breathing-2',
    title: 'Box Breathing',
    description: 'Practice box breathing: 4 counts in, 4 hold, 4 out, 4 hold. Repeat 4 times.',
    icon: '📦',
    category: 'breathing'
  },
  {
    id: 'movement-2',
    title: 'Walk & Refresh',
    description: 'Take a short 5-minute walk, even if it\'s just around your room.',
    icon: '🚶',
    category: 'movement'
  },
  {
    id: 'mindfulness-2',
    title: 'Digital Detox',
    description: 'Put your phone on silent for 15 minutes and just be.',
    icon: '📵',
    category: 'mindfulness'
  },
  {
    id: 'connection-2',
    title: 'Self-Compassion',
    description: 'Say something kind to yourself. You deserve your own love too.',
    icon: '💝',
    category: 'connection'
  }
];

export const getDailyQuests = (date: Date = new Date()): SoulQuest[] => {
  // Use the date as a seed for consistent daily quests
  const seed = date.toDateString();
  const shuffled = [...soulQuests].sort(() => {
    const hash = seed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.sin(hash) - 0.5;
  });
  return shuffled.slice(0, 3);
};
