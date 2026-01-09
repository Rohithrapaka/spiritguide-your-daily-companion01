import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TypingMetrics {
  currentWPM: number;
  averageWPM: number;
  backspaceFrequency: number;
  isTypingSlow: boolean;
  shouldNudge: boolean;
}

export const useTypingAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<TypingMetrics>({
    currentWPM: 0,
    averageWPM: 0,
    backspaceFrequency: 0,
    isTypingSlow: false,
    shouldNudge: false,
  });

  const keystrokeTimestamps = useRef<number[]>([]);
  const backspaceCount = useRef(0);
  const totalKeystrokes = useRef(0);
  const sessionWPMs = useRef<number[]>([]);
  const lastNudgeTime = useRef<number>(0);
  const storedAverageWPM = useRef<number>(0);

  // Load user's average WPM from profile
  useEffect(() => {
    const loadAverageWPM = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('typing_average_wpm')
        .eq('user_id', user.id)
        .single();

      if (data?.typing_average_wpm) {
        storedAverageWPM.current = Number(data.typing_average_wpm);
        setMetrics(prev => ({ ...prev, averageWPM: storedAverageWPM.current }));
      }
    };
    loadAverageWPM();
  }, [user]);

  // Calculate WPM from recent keystrokes
  const calculateCurrentWPM = useCallback(() => {
    const now = Date.now();
    // Only count keystrokes in the last 10 seconds
    const recentKeystrokes = keystrokeTimestamps.current.filter(
      ts => now - ts < 10000
    );

    if (recentKeystrokes.length < 5) return 0;

    const timeSpanMs = now - recentKeystrokes[0];
    const timeSpanMinutes = timeSpanMs / 60000;
    
    // Assume average word length of 5 characters
    const estimatedWords = recentKeystrokes.length / 5;
    const wpm = Math.round(estimatedWords / timeSpanMinutes);

    return Math.min(wpm, 200); // Cap at 200 WPM
  }, []);

  // Handle keydown events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = Date.now();
    
    if (e.key === 'Backspace') {
      backspaceCount.current++;
    }
    
    // Only track printable characters and backspace
    if (e.key.length === 1 || e.key === 'Backspace') {
      totalKeystrokes.current++;
      keystrokeTimestamps.current.push(now);
      
      // Keep only last 100 keystrokes
      if (keystrokeTimestamps.current.length > 100) {
        keystrokeTimestamps.current = keystrokeTimestamps.current.slice(-100);
      }

      const currentWPM = calculateCurrentWPM();
      const backspaceFrequency = totalKeystrokes.current > 0 
        ? (backspaceCount.current / totalKeystrokes.current) * 100 
        : 0;

      // Update session WPMs for average calculation
      if (currentWPM > 0) {
        sessionWPMs.current.push(currentWPM);
        if (sessionWPMs.current.length > 50) {
          sessionWPMs.current = sessionWPMs.current.slice(-50);
        }
      }

      // Calculate session average
      const sessionAverage = sessionWPMs.current.length > 0
        ? sessionWPMs.current.reduce((a, b) => a + b, 0) / sessionWPMs.current.length
        : storedAverageWPM.current;

      // Determine if typing is slow (30% below average)
      const referenceWPM = storedAverageWPM.current || sessionAverage || 40;
      const isTypingSlow = currentWPM > 0 && currentWPM < referenceWPM * 0.7;
      
      // Only nudge if: slow typing, high backspace, and hasn't nudged in 5 minutes
      const shouldNudge = isTypingSlow && 
        backspaceFrequency > 15 && 
        (now - lastNudgeTime.current > 300000);

      setMetrics({
        currentWPM,
        averageWPM: Math.round(sessionAverage),
        backspaceFrequency: Math.round(backspaceFrequency),
        isTypingSlow,
        shouldNudge,
      });
    }
  }, [calculateCurrentWPM]);

  // Mark that a nudge was sent
  const markNudgeSent = useCallback(() => {
    lastNudgeTime.current = Date.now();
    setMetrics(prev => ({ ...prev, shouldNudge: false }));
  }, []);

  // Save average WPM to profile periodically
  const saveAverageWPM = useCallback(async () => {
    if (!user || sessionWPMs.current.length < 10) return;

    const newAverage = sessionWPMs.current.reduce((a, b) => a + b, 0) / sessionWPMs.current.length;
    
    // Weighted average with stored value
    const weightedAverage = storedAverageWPM.current > 0
      ? (storedAverageWPM.current * 0.7 + newAverage * 0.3)
      : newAverage;

    await supabase
      .from('profiles')
      .update({ typing_average_wpm: Math.round(weightedAverage) })
      .eq('user_id', user.id);

    storedAverageWPM.current = weightedAverage;
  }, [user]);

  // Reset session metrics
  const resetSession = useCallback(() => {
    keystrokeTimestamps.current = [];
    backspaceCount.current = 0;
    totalKeystrokes.current = 0;
    sessionWPMs.current = [];
    setMetrics(prev => ({
      ...prev,
      currentWPM: 0,
      backspaceFrequency: 0,
      isTypingSlow: false,
      shouldNudge: false,
    }));
  }, []);

  return {
    metrics,
    handleKeyDown,
    markNudgeSent,
    saveAverageWPM,
    resetSession,
  };
};

export default useTypingAnalytics;
