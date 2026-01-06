import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { WisdomCard } from '@/components/WisdomCard';
import { MoodCheckin } from '@/components/MoodCheckin';
import { DailyChallenges } from '@/components/DailyChallenges';
import { ChatCompanion } from '@/components/ChatCompanion';
import { MoodAnalytics } from '@/components/MoodAnalytics';
import { useTheme } from '@/contexts/ThemeContext';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useMood } from '@/contexts/MoodContext';
import { cn } from '@/lib/utils';
import { MessageCircle, BarChart3, Home as HomeIcon, Sparkles } from 'lucide-react';

type Tab = 'home' | 'chat' | 'progress';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const { theme } = useTheme();
  const { isBlurred } = usePrivacy();
  const { hasCheckedInToday } = useMood();

  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: HomeIcon },
    { id: 'chat' as Tab, label: 'Chat', icon: MessageCircle },
    { id: 'progress' as Tab, label: 'Progress', icon: BarChart3 },
  ];

  return (
    <div className={cn(
      "min-h-screen",
      theme === 'warm'
        ? "bg-gradient-to-br from-background via-cream to-secondary/20"
        : "bg-gradient-to-br from-background via-background to-secondary/10"
    )}>
      <Header />

      {/* Tab Navigation */}
      <div className={cn(
        "sticky top-16 z-40 backdrop-blur-md border-b border-border/50",
        theme === 'warm' ? "bg-background/80" : "bg-background/60"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={cn(
        "container mx-auto px-4 py-8",
        isBlurred && "privacy-blur"
      )}>
        {activeTab === 'home' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Wisdom Quote */}
            <WisdomCard />

            {/* Mood Check-in & Daily Challenges Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              <MoodCheckin />
              <DailyChallenges />
            </div>

            {/* Quick Chat Prompt */}
            {hasCheckedInToday && (
              <div className={cn(
                "rounded-3xl p-6 text-center transition-all duration-500",
                theme === 'warm' ? "warm-card" : "glass-card"
              )}>
                <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-serif text-lg font-semibold mb-2">
                  Ready to talk?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your AI companion is here to listen and support you.
                </p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                    "bg-primary text-primary-foreground font-semibold",
                    "hover:bg-primary/90 transition-all duration-300 shadow-glow"
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  Start Chatting
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <ChatCompanion />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <MoodAnalytics />
          </div>
        )}
      </main>

      {/* Bottom Decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none">
        <div className={cn(
          "absolute inset-0",
          theme === 'warm'
            ? "bg-gradient-to-t from-cream/50 to-transparent"
            : "bg-gradient-to-t from-background/80 to-transparent"
        )} />
      </div>
    </div>
  );
};

export default Dashboard;
