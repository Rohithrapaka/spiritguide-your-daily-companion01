import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Star } from 'lucide-react';
import { getDailyQuests, SoulQuest } from '@/lib/dailyChallenges';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const DailyChallenges: React.FC = () => {
  const [quests, setQuests] = useState<SoulQuest[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [sparklingId, setSparklingId] = useState<string | null>(null);
  const { theme } = useTheme();
  const { user } = useAuth();

  useEffect(() => {
    setQuests(getDailyQuests());
    loadCompletedQuests();
  }, [user]);

  const loadCompletedQuests = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('daily_challenges')
      .select('completed_quests')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (error) {
      console.error('Error loading challenges:', error);
      return;
    }

    if (data) {
      setCompletedIds(new Set(data.completed_quests || []));
    }
  };

  const toggleQuest = async (questId: string) => {
    if (!user) return;

    const newCompletedIds = new Set(completedIds);
    const isCompleting = !completedIds.has(questId);
    
    if (isCompleting) {
      newCompletedIds.add(questId);
      setSparklingId(questId);
      setTimeout(() => setSparklingId(null), 600);
    } else {
      newCompletedIds.delete(questId);
    }
    
    setCompletedIds(newCompletedIds);

    const today = new Date().toISOString().split('T')[0];
    const completedArray = Array.from(newCompletedIds);

    // Upsert: insert or update on conflict
    const { error } = await supabase
      .from('daily_challenges')
      .upsert({
        user_id: user.id,
        date: today,
        completed_quests: completedArray
      }, {
        onConflict: 'user_id,date'
      });

    if (error) {
      console.error('Error saving challenges:', error);
    }
  };

  const completedCount = completedIds.size;
  const totalQuests = quests.length;

  return (
    <div className={cn(
      "rounded-3xl p-6 transition-all duration-500",
      theme === 'warm' ? "warm-card" : "glass-card"
    )}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Soul Quests
          </h3>
          <p className="text-sm text-muted-foreground">Daily challenges for your wellbeing</p>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-sm font-semibold",
          completedCount === totalQuests 
            ? "bg-primary text-primary-foreground" 
            : "bg-secondary text-secondary-foreground"
        )}>
          {completedCount}/{totalQuests}
        </div>
      </div>

      <div className="space-y-3">
        {quests.map((quest) => {
          const isCompleted = completedIds.has(quest.id);
          const isSparkle = sparklingId === quest.id;

          return (
            <button
              key={quest.id}
              onClick={() => toggleQuest(quest.id)}
              className={cn(
                "w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300",
                "text-left group",
                isCompleted 
                  ? theme === 'warm' 
                    ? "bg-sage-light/50" 
                    : "bg-primary/10"
                  : "bg-secondary/50 hover:bg-secondary"
              )}
            >
              <div className={cn(
                "relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300",
                "flex items-center justify-center",
                isCompleted 
                  ? "bg-primary border-primary" 
                  : "border-border group-hover:border-primary"
              )}>
                {isCompleted && (
                  <Check className={cn(
                    "h-4 w-4 text-primary-foreground",
                    isSparkle && "sparkle"
                  )} />
                )}
                
                {/* Sparkle effect */}
                {isSparkle && (
                  <>
                    <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-accent sparkle" />
                    <Sparkles className="absolute -bottom-1 -left-2 h-3 w-3 text-primary sparkle" style={{ animationDelay: '0.1s' }} />
                    <Sparkles className="absolute -top-1 left-3 h-3 w-3 text-accent sparkle" style={{ animationDelay: '0.2s' }} />
                  </>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{quest.icon}</span>
                  <h4 className={cn(
                    "font-semibold transition-all duration-300",
                    isCompleted && "line-through opacity-70"
                  )}>
                    {quest.title}
                  </h4>
                </div>
                <p className={cn(
                  "text-sm text-muted-foreground mt-1",
                  isCompleted && "line-through opacity-50"
                )}>
                  {quest.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {completedCount === totalQuests && (
        <div className={cn(
          "mt-4 p-4 rounded-2xl text-center",
          "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
        )}>
          <Sparkles className="h-6 w-6 mx-auto mb-2 text-accent" />
          <p className="font-semibold">All quests complete! ✨</p>
          <p className="text-sm text-muted-foreground">You're taking great care of yourself today.</p>
        </div>
      )}
    </div>
  );
};
