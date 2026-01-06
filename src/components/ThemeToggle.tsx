import React from 'react';
import { Moon, Sun, Leaf } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
        "border border-border hover:shadow-soft",
        theme === 'warm' 
          ? "bg-secondary text-secondary-foreground" 
          : "glass-card text-foreground"
      )}
      aria-label="Toggle theme"
    >
      <div className={cn(
        "flex items-center gap-2 transition-all duration-300",
        theme === 'warm' ? "opacity-100" : "opacity-50"
      )}>
        <Sun className="h-4 w-4" />
        <span className="text-sm font-medium">Warm</span>
      </div>
      
      <div className={cn(
        "w-10 h-5 rounded-full relative transition-colors duration-300",
        theme === 'warm' ? "bg-sage-light" : "bg-primary/30"
      )}>
        <div className={cn(
          "absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 shadow-sm",
          theme === 'warm' 
            ? "left-0.5 bg-primary" 
            : "left-5 bg-primary"
        )}>
          {theme === 'warm' ? (
            <Leaf className="h-2.5 w-2.5 text-primary-foreground absolute top-0.5 left-0.5" />
          ) : (
            <Moon className="h-2.5 w-2.5 text-primary-foreground absolute top-0.5 left-0.5" />
          )}
        </div>
      </div>
      
      <div className={cn(
        "flex items-center gap-2 transition-all duration-300",
        theme === 'dark' ? "opacity-100" : "opacity-50"
      )}>
        <Moon className="h-4 w-4" />
        <span className="text-sm font-medium">Glossy</span>
      </div>
    </button>
  );
};
