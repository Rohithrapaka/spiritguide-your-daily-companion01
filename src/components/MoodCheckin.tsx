import React from 'react';
import { Smile, Frown, Meh, Sparkles, Sun, Moon, Zap, Coffee, Brain, Heart } from 'lucide-react';
import { useMood, MoodTag } from '@/contexts/MoodContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const moodTags: { tag: MoodTag; icon: React.ReactNode; color: string }[] = [
  { tag: 'Anxious', icon: <Brain className="h-4 w-4" />, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  { tag: 'Calm', icon: <Moon className="h-4 w-4" />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { tag: 'Tired', icon: <Coffee className="h-4 w-4" />, color: 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300' },
  { tag: 'Energetic', icon: <Zap className="h-4 w-4" />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  { tag: 'Motivated', icon: <Sparkles className="h-4 w-4" />, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  { tag: 'Peaceful', icon: <Sun className="h-4 w-4" />, color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { tag: 'Stressed', icon: <Brain className="h-4 w-4" />, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  { tag: 'Happy', icon: <Heart className="h-4 w-4" />, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300' },
];

const getMoodEmoji = (score: number) => {
  if (score <= 4) return { icon: <Frown className="h-8 w-8" />, label: 'Struggling', color: 'text-red-500' };
  if (score === 5) return { icon: <Meh className="h-8 w-8" />, label: 'Balanced', color: 'text-yellow-500' };
  return { icon: <Smile className="h-8 w-8" />, label: 'Flourishing', color: 'text-green-500' };
};

interface MoodCheckinProps {
  onComplete?: () => void;
}

export const MoodCheckin: React.FC<MoodCheckinProps> = ({ onComplete }) => {
  const { currentMood, setCurrentMood, currentTags, toggleMoodTag, saveMoodEntry, hasCheckedInToday } = useMood();
  const { theme } = useTheme();
  const moodInfo = getMoodEmoji(currentMood);

  const handleSave = async () => {
    await saveMoodEntry();
    onComplete?.();
  };

  return (
    <div className={cn(
      "rounded-3xl p-7 md:p-8 transition-all duration-300",
      theme === 'warm' ? "warm-card" : "glass-card"
    )}>
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl font-semibold mb-2">
          {hasCheckedInToday ? 'Update Your Mood' : 'How Are You Feeling?'}
        </h3>
        <p className="text-muted-foreground mb-1">
          Take a moment to check in with yourself
        </p>
        <p className="text-xs text-muted-foreground/70">
          This helps personalize your conversation experience
        </p>
      </div>

      {/* Mood Slider */}
      <div className="mb-9">
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className={cn("transition-all duration-200", moodInfo.color)}>
            {moodInfo.icon}
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold">{currentMood}</span>
            <span className="text-lg text-muted-foreground/70">/10</span>
          </div>
          <span className={cn("font-medium text-sm", moodInfo.color)}>{moodInfo.label}</span>
        </div>

        <div className="relative px-2">
          <input
            type="range"
            min="1"
            max="10"
            value={currentMood}
            onChange={(e) => setCurrentMood(Number(e.target.value))}
            className="mood-slider w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground/60 mt-3">
            <span>Struggling</span>
            <span>Balanced</span>
            <span>Thriving</span>
          </div>
        </div>
      </div>

      {/* Mood Tags Grid */}
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground mb-1 text-center">
          Select how you're feeling
        </p>
        <p className="text-xs text-muted-foreground/60 mb-4 text-center">
          Optional — skip if you prefer
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {moodTags.map(({ tag, icon, color }) => (
            <button
              key={tag}
              onClick={() => toggleMoodTag(tag)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-200",
                "border font-medium text-sm",
                currentTags.includes(tag)
                  ? cn(color, "border-current shadow-sm scale-[1.02]")
                  : "border-border/60 hover:border-primary/40 hover:bg-secondary/70 bg-secondary/40"
              )}
            >
              {icon}
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <Button
          onClick={handleSave}
          className={cn(
            "px-8 py-3.5 rounded-full font-semibold transition-all duration-200",
            "bg-primary/90 hover:bg-primary text-primary-foreground",
            "shadow-sm hover:shadow-md"
          )}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {hasCheckedInToday ? 'Update Check-in' : 'Save Check-in'}
        </Button>
      </div>
    </div>
  );
};
