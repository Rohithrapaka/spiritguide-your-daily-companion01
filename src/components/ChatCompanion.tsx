import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Ghost, Phone, Loader2, AlertCircle, Trash2, Wind, ThumbsUp, ThumbsDown, Mic } from 'lucide-react';
import { useMood } from '@/contexts/MoodContext';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useTypingAnalytics } from '@/hooks/useTypingAnalytics';
import { VoiceJournal } from './VoiceJournal';
import { MiniPet } from './MiniPet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
  isVoice?: boolean;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

// Tone-aware opening messages based on mood
const getOpeningMessage = (moodScore: number, userName: string): string => {
  const name = userName || 'there';
  if (moodScore <= 3) {
    return `I'm here with you, ${name}. No pressure to talk—just know I'm listening whenever you're ready.`;
  }
  if (moodScore <= 5) {
    return `Hey ${name}, I'm here for you. Take your time—there's no rush.`;
  }
  if (moodScore <= 7) {
    return `Hi ${name}! How's your day going?`;
  }
  return `${name}! Great to see you feeling good. What's on your mind?`;
};

const getSystemPrompt = (moodScore: number, userName: string, toneFeedback: 'helpful' | 'not-helpful' | null, isVoiceMessage: boolean = false) => {
  // Adjust tone based on mood score
  let toneGuidance = '';
  if (moodScore <= 3) {
    toneGuidance = `The user is feeling quite low right now. Be extra gentle, calm, and grounding. Use soft language. Keep responses short (1-2 sentences). Never offer advice unless explicitly asked. Focus entirely on listening and validating.`;
  } else if (moodScore <= 5) {
    toneGuidance = `The user is feeling somewhat low. Be warm and steady. Keep responses brief (2-3 sentences). Listen more than suggest. Only offer gentle support if it feels natural.`;
  } else if (moodScore <= 7) {
    toneGuidance = `The user is in a balanced state. Be warm and conversational. Keep responses concise (2-3 sentences). You can be gently encouraging.`;
  } else {
    toneGuidance = `The user is feeling good. Match their positive energy authentically. Keep responses light and warm (2-3 sentences).`;
  }

  // Adjust if user gave feedback that tone wasn't helpful
  if (toneFeedback === 'not-helpful') {
    toneGuidance += ` IMPORTANT: The user indicated the current tone isn't quite right. Be even softer, shorter, and more spacious in your responses. Less is more.`;
  }

  // Special handling for voice messages
  let voiceGuidance = '';
  if (isVoiceMessage) {
    voiceGuidance = `
IMPORTANT: The user is speaking this out loud via voice journal. Respond with high empathy. Use phrases like "I hear that in your voice" or "I'm right here with you" or "Thank you for sharing that with me." Be extra present and validating.`;
  }

  return `You are SpiritGuide, a compassionate AI companion for students. You listen deeply and respond with empathy.

${toneGuidance}
${voiceGuidance}

Core principles:
- Listen first. Never give advice or solutions unless the user explicitly asks for them.
- Validate feelings without trying to fix them.
- Use calm, grounding language. Avoid exclamation marks when mood is low.
- Keep responses short and spacious—let the user lead.
- If someone expresses severe distress or mentions self-harm, gently encourage reaching out to a crisis helpline.
- Never diagnose or replace professional support.

Speaking with ${userName || 'a student'}.`;
};

export const ChatCompanion: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisButton, setShowCrisisButton] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [toneFeedback, setToneFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [showGroundingExercise, setShowGroundingExercise] = useState(false);
  const [showVoiceJournal, setShowVoiceJournal] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentMood } = useMood();
  const { privacyMode, isBlurred } = usePrivacy();
  const { user, userProfile } = useAuth();
  const { theme } = useTheme();
  
  // Typing analytics for behavioral insights
  const { metrics, handleKeyDown, markNudgeSent, saveAverageWPM } = useTypingAnalytics();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  useEffect(() => {
    setShowCrisisButton(currentMood <= 3);
  }, [currentMood]);

  // Load chat history on mount (if not in privacy mode)
  useEffect(() => {
    if (user && !privacyMode) {
      loadChatHistory();
    }
  }, [user, privacyMode]);

  const loadChatHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error loading chat history:', error);
      return;
    }

    const loadedMessages: Message[] = data.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(msg.created_at)
    }));

    setMessages(loadedMessages);
  };

  const saveMessage = async (message: Message) => {
    if (!user || privacyMode) return;

    const { error } = await supabase
      .from('chats')
      .insert({
        user_id: user.id,
        role: message.role,
        content: message.content
      });

    if (error) {
      console.error('Error saving message:', error);
    }
  };

  const sendMessage = async (customInput?: string, isVoice: boolean = false) => {
    const messageText = customInput || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
      isVoice,
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customInput) setInput('');
    setIsLoading(true);
    setStreamingContent('');

    // Save user message
    await saveMessage(userMessage);
    
    // Save typing average periodically
    await saveAverageWPM();

    // Track message count for feedback prompt
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    
    // Show feedback prompt after 5 messages
    if (newCount === 5 && !toneFeedback) {
      setShowFeedbackPrompt(true);
    }

    try {
      const systemPrompt = getSystemPrompt(currentMood, userProfile?.name || 'Student', toneFeedback, isVoice);
      
      // Build conversation history for the API
      const conversationHistory = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: messageText }
      ];

      // Call with streaming
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: conversationHistory,
          systemPrompt 
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${resp.status}`);
      }

      if (!resp.body) {
        throw new Error('No response body');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullContent += content;
              setStreamingContent(fullContent);
            }
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Check for crisis keywords
      const crisisKeywords = ['suicide', 'hurt myself', 'end it', 'kill myself', 'self-harm'];
      if (crisisKeywords.some(kw => messageText.toLowerCase().includes(kw))) {
        setShowCrisisButton(true);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullContent || "I'm here for you. Could you tell me more?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');
      
      // Save assistant message
      await saveMessage(assistantMessage);
    } catch (error) {
      console.error('Chat error:', error);
      setStreamingContent('');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error 
          ? `⚠️ ${error.message}` 
          : "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice transcription
  const handleVoiceTranscription = (text: string, isVoice: boolean) => {
    setShowVoiceJournal(false);
    sendMessage(text, isVoice);
  };

  // Check for typing nudge
  useEffect(() => {
    if (metrics.shouldNudge && !isLoading && messages.length > 2) {
      const userName = userProfile?.name || 'there';
      const nudgeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `You seem a little tired, ${userName}. Is it time for a 5-minute screen break? 💙`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, nudgeMessage]);
      markNudgeSent();
    }
  }, [metrics.shouldNudge, isLoading, messages.length, userProfile?.name, markNudgeSent]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    handleKeyDown(e);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    if (!user) return;
    
    // Clear local state
    setMessages([]);
    
    // Delete from database if not in privacy mode
    if (!privacyMode) {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error clearing chat history:', error);
      }
    }
  };

  return (
    <div className={cn(
      "relative flex flex-col h-[540px] rounded-3xl overflow-hidden transition-all duration-300",
      theme === 'warm' ? "warm-card" : "glass-card",
      isBlurred && "privacy-blur"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-5 py-4 border-b border-border/30",
        theme === 'dark' && "bg-background/40"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-full",
            privacyMode ? "bg-muted/60" : "bg-primary/8"
          )}>
            {privacyMode ? (
              <Ghost className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Bot className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-[15px]">
              {privacyMode ? 'Ghost Mode Active' : 'SpiritGuide'}
            </h3>
            <p className="text-xs text-muted-foreground/80">
              {privacyMode ? 'Messages not saved' : 'Here to listen'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-muted-foreground/70 hover:text-destructive hover:bg-destructive/8"
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear conversation?</AlertDialogTitle>
                  <AlertDialogDescription className="leading-relaxed">
                    This will permanently delete all messages. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={clearChat}
                    className="bg-destructive/90 text-destructive-foreground hover:bg-destructive rounded-full"
                  >
                    Clear chat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {showCrisisButton && (
            <a
              href="tel:988"
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium",
                "bg-destructive/90 text-destructive-foreground"
              )}
            >
              <Phone className="h-4 w-4" />
              988
            </a>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {messages.length === 0 && !streamingContent && (
          <div className="text-center py-10 px-4">
            <Bot className="h-14 w-14 mx-auto mb-5 text-primary/40" />
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
              {getOpeningMessage(currentMood, userProfile?.name || '')}
            </p>
          </div>
        )}

        {/* Feedback prompt */}
        {showFeedbackPrompt && !toneFeedback && (
          <div className={cn(
            "mx-auto max-w-sm p-4 rounded-2xl text-center animate-fade-in mb-4",
            theme === 'warm' ? "bg-secondary/60" : "bg-muted/60"
          )}>
            <p className="text-sm text-muted-foreground mb-3">
              Is the current tone helpful for you?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setToneFeedback('helpful');
                  setShowFeedbackPrompt(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  "bg-primary/10 hover:bg-primary/20 text-primary"
                )}
              >
                <ThumbsUp className="h-4 w-4" />
                Yes
              </button>
              <button
                onClick={() => {
                  setToneFeedback('not-helpful');
                  setShowFeedbackPrompt(false);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                <ThumbsDown className="h-4 w-4" />
                Not quite
              </button>
            </div>
          </div>
        )}

        {/* Grounding exercise */}
        {showGroundingExercise && (
          <div className={cn(
            "mx-auto max-w-sm p-5 rounded-2xl text-center animate-fade-in mb-4",
            theme === 'warm' ? "bg-sage-light/30 border border-primary/20" : "bg-primary/10 border border-primary/20"
          )}>
            <Wind className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h4 className="font-serif font-semibold mb-2">Gentle Breathing</h4>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              If you'd like, try taking a slow breath in for 4 counts, hold for 4, and out for 4. No pressure—just a suggestion.
            </p>
            <button
              onClick={() => setShowGroundingExercise(false)}
              className="text-sm text-primary hover:underline"
            >
              Close
            </button>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === 'user' ? "flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              message.role === 'user' 
                ? "bg-primary/90 text-primary-foreground" 
                : theme === 'warm' ? "bg-sage-light/60" : "bg-muted/60"
            )}>
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : privacyMode ? (
                <Ghost className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-primary/80" />
              )}
            </div>
            <div className={cn(
              "max-w-[70%] rounded-2xl px-4 py-3",
              message.role === 'user'
                ? "bg-primary/90 text-primary-foreground"
                : message.isError
                  ? "bg-destructive/8 border border-destructive/15"
                  : theme === 'warm' 
                    ? "bg-secondary/70" 
                    : "bg-muted/50"
            )}>
              {message.isError && (
                <div className="flex items-center gap-2 mb-1.5 text-destructive/80">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Error</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingContent && (
          <div className="flex gap-3 animate-fade-in">
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              theme === 'warm' ? "bg-sage-light/60" : "bg-muted/60"
            )}>
              {privacyMode ? (
                <Ghost className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-primary/80" />
              )}
            </div>
            <div className={cn(
              "max-w-[70%] rounded-2xl px-4 py-3",
              theme === 'warm' ? "bg-secondary/70" : "bg-muted/50"
            )}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {streamingContent}
                <span className="inline-block w-1.5 h-4 ml-1 bg-primary/40 rounded-sm animate-pulse" />
              </p>
            </div>
          </div>
        )}

        {isLoading && !streamingContent && (
          <div className="flex gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              theme === 'warm' ? "bg-sage-light/60" : "bg-muted/60"
            )}>
              <Loader2 className="h-4 w-4 animate-spin text-primary/70" />
            </div>
            <div className={cn(
              "rounded-2xl px-4 py-3",
              theme === 'warm' ? "bg-secondary/70" : "bg-muted/50"
            )}>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={cn(
        "p-4 border-t border-border/50",
        theme === 'dark' && "bg-background/50"
      )}>
        {privacyMode && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Ghost className="h-3 w-3" />
            <span>Ghost mode: Your messages won't be saved</span>
          </div>
        )}
        
        {/* Grounding suggestion for low mood */}
        {currentMood <= 4 && !showGroundingExercise && messages.length > 0 && (
          <button
            onClick={() => setShowGroundingExercise(true)}
            className={cn(
              "flex items-center gap-2 text-xs text-muted-foreground mb-3 px-3 py-1.5 rounded-full",
              "hover:bg-secondary/80 transition-colors"
            )}
          >
            <Wind className="h-3 w-3" />
            <span>Need a moment to breathe?</span>
          </button>
        )}
        
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Share what's on your mind..."
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-2xl px-4 py-3 text-sm",
              "bg-secondary/80 border border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
              "placeholder:text-muted-foreground transition-all duration-200"
            )}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className={cn(
              "rounded-full w-12 h-12 p-0 transition-all duration-200",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "hover:shadow-md focus:ring-2 focus:ring-primary/30"
            )}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Disclaimer */}
        <p className="text-[10px] text-muted-foreground/60 text-center mt-3 leading-relaxed">
          SpiritGuide is not a substitute for professional mental health care.
        </p>
      </div>

      {/* Mini Pet - roams/sleeps based on mood */}
      <MiniPet />
    </div>
  );
};
