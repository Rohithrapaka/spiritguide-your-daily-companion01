import React, { useState, useEffect } from 'react';
import { Quote, Sparkles, BookOpen } from 'lucide-react';
import { getRandomQuote, animeQuotes } from '@/lib/quotes';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

export const WisdomCard: React.FC = () => {
  const [quote, setQuote] = useState(getRandomQuote());
  const { theme } = useTheme();
  const isAnime = animeQuotes.some(q => q.text === quote.text);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl p-7 md:p-9",
      "transition-all duration-300",
      theme === 'warm' 
        ? "warm-card bg-gradient-to-br from-card via-card to-secondary/20" 
        : "glass-card"
    )}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Sparkles className="w-full h-full" />
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-5 rotate-12">
        <Quote className="w-full h-full" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className={cn(
            "p-2 rounded-full",
            theme === 'warm' ? "bg-sage-light" : "bg-primary/20"
          )}>
            {isAnime ? (
              <Sparkles className="h-5 w-5 text-primary" />
            ) : (
              <BookOpen className="h-5 w-5 text-primary" />
            )}
          </div>
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {isAnime ? 'Anime Wisdom' : 'Scripture'}
          </span>
        </div>

        <blockquote className="relative">
          <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/15" />
          <p className="font-serif text-xl md:text-2xl leading-[1.7] pl-6 mb-5">
            "{quote.text}"
          </p>
          <footer className="pl-6">
            <cite className="text-muted-foreground/80 font-medium not-italic text-sm">
              — {quote.source}
            </cite>
          </footer>
        </blockquote>
      </div>

      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 pointer-events-none",
        theme === 'warm'
          ? "bg-gradient-to-t from-sage/5 to-transparent"
          : "bg-gradient-to-t from-primary/5 to-transparent"
      )} />
    </div>
  );
};
