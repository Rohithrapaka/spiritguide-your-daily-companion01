import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { WisdomCard } from '@/components/WisdomCard';
import { MoodCheckin } from '@/components/MoodCheckin';
import { ChatCompanion } from '@/components/ChatCompanion';
import { MoodAnalytics } from '@/components/MoodAnalytics';
import { PetPlayground } from '@/components/PetPlayground';
import { PetChallengesPanel } from '@/components/PetChallengesPanel';
import { PetSelector } from '@/components/PetSelector';
import { EvolutionModal } from '@/components/EvolutionModal';
import { useTheme } from '@/contexts/ThemeContext';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useMood } from '@/contexts/MoodContext';
import { usePetProgress } from '@/hooks/usePetProgress';
import { cn } from '@/lib/utils';
import { MessageCircle, BarChart3, Home as HomeIcon, Sparkles, PawPrint } from 'lucide-react';
import { PetType } from '@/lib/petChallenges';

type Tab = 'home' | 'chat' | 'progress' | 'pet';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedPet, setSelectedPet] = useState<PetType>('dog');
  const { theme } = useTheme();
  const { isBlurred } = usePrivacy();
  const { hasCheckedInToday } = useMood();
  const { evolutionEvent, clearEvolutionEvent, getPetProgress } = usePetProgress();

  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: HomeIcon },
    { id: 'chat' as Tab, label: 'Chat', icon: MessageCircle },
    { id: 'pet' as Tab, label: 'Pet', icon: PawPrint },
    { id: 'progress' as Tab, label: 'Progress', icon: BarChart3 },
  ];

  const currentPetProgress = getPetProgress(selectedPet);

  return (
    <div className={cn(
      "min-h-screen",
      theme === 'warm'
        ? "bg-gradient-to-br from-background via-cream to-secondary/20"
        : "bg-gradient-to-br from-background via-background to-secondary/10"
    )}>
      <Header />

      {/* Evolution Modal */}
      {evolutionEvent && (
        <EvolutionModal
          isOpen={!!evolutionEvent}
          onClose={clearEvolutionEvent}
          petType={evolutionEvent.petType}
          fromStage={evolutionEvent.fromStage}
          toStage={evolutionEvent.toStage}
          reason={evolutionEvent.reason}
        />
      )}

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
        "container mx-auto px-4 sm:px-6 py-10",
        isBlurred && "privacy-blur"
      )}>
        {activeTab === 'home' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            {/* Wisdom Quote */}
            <WisdomCard />

            {/* Mood Check-in */}
            <MoodCheckin />

            {/* Quick Chat Prompt */}
            {hasCheckedInToday && (
              <div className={cn(
                "rounded-3xl p-8 text-center transition-all duration-500",
                theme === 'warm' ? "warm-card" : "glass-card"
              )}>
                <Sparkles className="h-8 w-8 mx-auto mb-4 text-primary/70" />
                <h3 className="font-serif text-lg font-semibold mb-2">
                  Ready to talk?
                </h3>
                <p className="text-muted-foreground mb-5 max-w-md mx-auto leading-relaxed">
                  Your AI companion is here to listen and support you.
                </p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={cn(
                    "inline-flex items-center gap-2 px-7 py-3.5 rounded-full",
                    "bg-primary/90 text-primary-foreground font-semibold",
                    "hover:bg-primary transition-all duration-200",
                    "shadow-sm hover:shadow-md"
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
          <div className="max-w-xl mx-auto animate-fade-in">
            <ChatCompanion />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <MoodAnalytics />
          </div>
        )}

        {activeTab === 'pet' && (
          <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Pet Selector */}
            <div className={cn(
              "rounded-2xl p-4 mb-6",
              theme === 'warm' ? "warm-card" : "glass-card"
            )}>
              <h3 className="text-center text-sm text-muted-foreground mb-3">
                Choose your companion
              </h3>
              <PetSelector 
                selectedPet={selectedPet} 
                onSelectPet={setSelectedPet} 
              />
            </div>

            {/* Pet Area + Challenges */}
            <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-320px)]">
              {/* Pet Playground */}
              <div className={cn(
                "lg:col-span-3 rounded-3xl overflow-hidden",
                theme === 'warm' ? "warm-card" : "glass-card"
              )}>
                <PetPlayground 
                  selectedPetType={selectedPet}
                  evolutionStage={currentPetProgress.evolutionStage}
                />
              </div>

              {/* Challenges Panel */}
              <div className="lg:col-span-2">
                <PetChallengesPanel selectedPet={selectedPet} />
              </div>
            </div>
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
