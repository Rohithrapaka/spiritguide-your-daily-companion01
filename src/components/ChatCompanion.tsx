import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Ghost, Phone, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useMood } from '@/contexts/MoodContext';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isError?: boolean;
}

const getSystemPrompt = (moodScore: number, userName: string) => {
  const moodContext = moodScore <= 4 
    ? `The user ${userName} is currently feeling low (mood score: ${moodScore}/10). Be extra gentle, grounding, and supportive. Offer comfort and validation. Avoid being overly cheerful. Focus on small, manageable steps.`
    : moodScore === 5
    ? `The user ${userName} is feeling balanced (mood score: ${moodScore}/10). Be warm and supportive while gently encouraging them.`
    : `The user ${userName} is feeling good (mood score: ${moodScore}/10). Be encouraging and help them maintain their positive state while being authentic.`;

  return `You are SpiritGuide, a compassionate AI mental health companion for students. You provide warm, supportive conversations while being mindful of boundaries.

${moodContext}

Key guidelines:
- Be warm, empathetic, and non-judgmental
- Use gentle language and validate feelings
- Offer practical, small steps when appropriate
- Never diagnose or replace professional help
- If someone expresses severe distress or mentions self-harm, encourage them to reach out to a crisis helpline or professional
- Remember context from the conversation
- Keep responses concise but meaningful (2-4 sentences usually)
- You can reference anime wisdom and scripture when naturally relevant, as the user appreciates these sources

You are speaking with ${userName}, a student.`;
};

export const ChatCompanion: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisButton, setShowCrisisButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentMood } = useMood();
  const { privacyMode, isBlurred } = usePrivacy();
  const { user, userProfile } = useAuth();
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Save user message
    await saveMessage(userMessage);

    try {
      const systemPrompt = getSystemPrompt(currentMood, userProfile?.name || 'Student');
      
      // Build conversation history for the API
      const conversationHistory = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: userInput }
      ];

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages: conversationHistory,
          systemPrompt 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to connect to AI');
      }

      if (data?.error) {
        console.error('API error:', data.error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.error,
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const aiContent = data?.content;
      
      if (!aiContent) {
        throw new Error('No response from AI');
      }

      // Check for crisis keywords
      const crisisKeywords = ['suicide', 'hurt myself', 'end it', 'kill myself', 'self-harm'];
      if (crisisKeywords.some(kw => userInput.toLowerCase().includes(kw))) {
        setShowCrisisButton(true);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant message
      await saveMessage(assistantMessage);
    } catch (error) {
      console.error('Chat error:', error);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
      "flex flex-col h-[500px] rounded-3xl overflow-hidden transition-all duration-500",
      theme === 'warm' ? "warm-card" : "glass-card",
      isBlurred && "privacy-blur"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b border-border",
        theme === 'dark' && "bg-background/50"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-full",
            privacyMode ? "bg-muted" : "bg-primary/10"
          )}>
            {privacyMode ? (
              <Ghost className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Bot className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">
              {privacyMode ? 'Ghost Mode Active' : 'SpiritGuide'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {privacyMode ? 'Messages not saved' : 'Your compassionate companion'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          {showCrisisButton && (
            <a
              href="tel:988"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium",
                "bg-destructive text-destructive-foreground animate-pulse"
              )}
            >
              <Phone className="h-4 w-4" />
              Crisis Line: 988
            </a>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 text-primary/50" />
            <p className="text-muted-foreground">
              Hi {userProfile?.name || 'there'}! I'm here to listen and support you. 
              How are you feeling right now?
            </p>
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
                ? "bg-primary text-primary-foreground" 
                : theme === 'warm' ? "bg-sage-light" : "bg-accent/20"
            )}>
              {message.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : privacyMode ? (
                <Ghost className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Bot className="h-4 w-4 text-primary" />
              )}
            </div>
            <div className={cn(
              "max-w-[75%] rounded-2xl px-4 py-3",
              message.role === 'user'
                ? "bg-primary text-primary-foreground"
                : message.isError
                  ? "bg-destructive/10 border border-destructive/20"
                  : theme === 'warm' 
                    ? "bg-secondary" 
                    : "bg-muted"
            )}>
              {message.isError && (
                <div className="flex items-center gap-2 mb-1 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">Error</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              theme === 'warm' ? "bg-sage-light" : "bg-accent/20"
            )}>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
            <div className={cn(
              "rounded-2xl px-4 py-3",
              theme === 'warm' ? "bg-secondary" : "bg-muted"
            )}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={cn(
        "p-4 border-t border-border",
        theme === 'dark' && "bg-background/50"
      )}>
        {privacyMode && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Ghost className="h-3 w-3" />
            <span>Ghost mode: Your messages won't be saved</span>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Share what's on your mind..."
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-2xl px-4 py-3 text-sm",
              "bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary/20",
              "placeholder:text-muted-foreground"
            )}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={cn(
              "rounded-full w-12 h-12 p-0",
              "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
