import React from 'react';
import { Sparkles, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { PrivacyToggle } from './PrivacyToggle';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useState } from 'react';

export const Header: React.FC = () => {
  const { userProfile, logout } = useAuth();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={cn(
      "sticky top-0 z-50 border-b border-border/50 backdrop-blur-md",
      theme === 'warm' 
        ? "bg-background/90" 
        : "bg-background/70"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-2 rounded-xl float-animation",
              theme === 'warm' 
                ? "bg-gradient-to-br from-sage-light to-sage/20" 
                : "bg-gradient-to-br from-primary/30 to-accent/20"
            )}>
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold gradient-text">
                SpiritGuide
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Your companion
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <PrivacyToggle />
            <ThemeToggle />
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right">
                <p className="text-sm font-medium">{userProfile?.name}</p>
                <p className="text-xs text-muted-foreground">{userProfile?.major}</p>
              </div>
              <button
                onClick={logout}
                className={cn(
                  "p-2 rounded-full transition-all duration-300",
                  "hover:bg-destructive/10 hover:text-destructive"
                )}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={cn(
            "md:hidden py-4 space-y-4 animate-fade-in",
            "border-t border-border"
          )}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{userProfile?.name}</p>
                <p className="text-xs text-muted-foreground">{userProfile?.major}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <PrivacyToggle />
            </div>
            <ThemeToggle />
          </div>
        )}
      </div>
    </header>
  );
};
