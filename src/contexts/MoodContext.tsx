import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type MoodTag = 'Anxious' | 'Calm' | 'Tired' | 'Energetic' | 'Motivated' | 'Peaceful' | 'Stressed' | 'Happy';

export interface MoodEntry {
  id?: string;
  score: number;
  tags: MoodTag[];
  timestamp: Date;
  userId: string;
}

interface MoodContextType {
  currentMood: number;
  currentTags: MoodTag[];
  moodHistory: MoodEntry[];
  setCurrentMood: (score: number) => void;
  toggleMoodTag: (tag: MoodTag) => void;
  saveMoodEntry: () => Promise<void>;
  loadMoodHistory: () => Promise<void>;
  hasCheckedInToday: boolean;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentMood, setCurrentMood] = useState(5);
  const [currentTags, setCurrentTags] = useState<MoodTag[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const toggleMoodTag = (tag: MoodTag) => {
    setCurrentTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const saveMoodEntry = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mood_logs')
      .insert({
        user_id: user.id,
        score: currentMood,
        tags: currentTags
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving mood entry:', error);
      return;
    }

    const newEntry: MoodEntry = {
      id: data.id,
      score: data.score,
      tags: data.tags as MoodTag[],
      timestamp: new Date(data.created_at),
      userId: data.user_id
    };

    setMoodHistory(prev => [newEntry, ...prev]);
    setHasCheckedInToday(true);
  };

  const loadMoodHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading mood history:', error);
      return;
    }

    const entries: MoodEntry[] = data.map(doc => ({
      id: doc.id,
      score: doc.score,
      tags: doc.tags as MoodTag[],
      timestamp: new Date(doc.created_at),
      userId: doc.user_id
    }));

    setMoodHistory(entries);

    // Check if user has checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEntry = entries.find(e => e.timestamp >= today);
    setHasCheckedInToday(!!todayEntry);

    if (todayEntry) {
      setCurrentMood(todayEntry.score);
      setCurrentTags(todayEntry.tags);
    }
  };

  useEffect(() => {
    if (user) {
      loadMoodHistory();
    }
  }, [user]);

  return (
    <MoodContext.Provider value={{
      currentMood,
      currentTags,
      moodHistory,
      setCurrentMood,
      toggleMoodTag,
      saveMoodEntry,
      loadMoodHistory,
      hasCheckedInToday
    }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
