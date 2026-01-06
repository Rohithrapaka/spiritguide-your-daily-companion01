import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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

    const entry: Omit<MoodEntry, 'id'> = {
      score: currentMood,
      tags: currentTags,
      timestamp: new Date(),
      userId: user.uid
    };

    await addDoc(collection(db, 'mood_logs'), {
      ...entry,
      timestamp: Timestamp.fromDate(entry.timestamp)
    });

    setMoodHistory(prev => [{ ...entry, id: Date.now().toString() }, ...prev]);
    setHasCheckedInToday(true);
  };

  const loadMoodHistory = async () => {
    if (!user) return;

    const q = query(
      collection(db, 'mood_logs'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const snapshot = await getDocs(q);
    const entries: MoodEntry[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as MoodEntry[];

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
